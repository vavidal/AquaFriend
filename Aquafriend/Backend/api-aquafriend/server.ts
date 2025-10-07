import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'api-aquafriend', now: new Date().toISOString() });
});

app.get('/api/especies', async (_req, res) => {
  const data = await prisma.especies.findMany({ orderBy: { id_especie: 'asc' }, take: 100 });
  res.json(data);
});

app.get('/api/peces', async (_req, res) => {
  const rows = await prisma.$queryRawUnsafe<any[]>('SELECT * FROM peces ORDER BY id ASC LIMIT 100');
  res.json(rows);
});

app.get('/api/programas', async (_req, res) => {
  const data = await prisma.programas_educativos.findMany({ orderBy: { id_plan: 'asc' } });
  res.json(data);
});

const PORT = Number(process.env.PORT || 3000);
app.listen(PORT, () => console.log(`API lista en http://localhost:${PORT}`));

process.on('SIGINT', async () => { await prisma.$disconnect(); process.exit(0); });
