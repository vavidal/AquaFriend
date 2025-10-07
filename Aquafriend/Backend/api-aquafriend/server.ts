import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { PrismaClient, Prisma } from '@prisma/client';
import AdminJS from 'adminjs';
import * as AdminJSExpress from '@adminjs/express';
import { Database, Resource } from '@adminjs/prisma';
import formidableMiddleware from 'express-formidable';

const app = express();
const prisma = new PrismaClient();
const PORT = Number(process.env.PORT || 3000);

app.use(cors({ origin: ['http://localhost:4200'], credentials: true }));
app.use(express.json());

const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) =>
  (req: Request, res: Response, next: NextFunction) =>
    fn(req, res, next).catch(next);

app.get('/', (_req, res) => {
  res.send('Aquafriend API ✅');
});

app.get('/api/health', asyncHandler(async (_req, res) => {
  await prisma.$queryRaw`SELECT 1`;
  res.json({ ok: true, service: 'api-aquafriend', now: new Date().toISOString() });
}));

app.get('/api/especies', asyncHandler(async (_req, res) => {
  const data = await prisma.especies.findMany({
    orderBy: { id_especie: 'asc' },
    take: 100,
  });
  res.json(data);
}));

app.get('/api/peces', asyncHandler(async (req, res) => {
  const limit = Math.min(Number(req.query.limit) || 100, 500);
  const offset = Number(req.query.offset) || 0;
  const rows = await prisma.$queryRaw<any[]>`
    SELECT * FROM peces ORDER BY id ASC LIMIT ${limit} OFFSET ${offset}
  `;
  res.json(rows);
}));

app.get('/api/programas', asyncHandler(async (_req, res) => {
  const data = await prisma.programas_educativos.findMany({
    orderBy: { id_plan: 'asc' },
  });
  res.json(data);
}));

AdminJS.registerAdapter({ Database, Resource });
(async () => {
  try {
    const admin = new AdminJS({
      rootPath: '/admin',
      databases: [prisma],
      branding: { companyName: 'Aquafriend Admin' },
    });
    const adminRouter = AdminJSExpress.buildRouter(admin);
    app.use(admin.options.rootPath, formidableMiddleware(), adminRouter);
  } catch (e) {
    console.error('AdminJS error:', e);
  }
})();

app.use((_req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    return res.status(400).json({ error: err.code, message: err.message });
  }
  console.error(err);
  res.status(500).json({ error: 'Internal Server Error' });
});

const server = app.listen(PORT, () => {
  console.log(`API lista en http://localhost:${PORT}`);
});

const shutdown = async () => {
  await prisma.$disconnect();
  server.close(() => process.exit(0));
};
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
