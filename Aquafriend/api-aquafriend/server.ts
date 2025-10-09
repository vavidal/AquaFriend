import 'dotenv/config'
import express, { Request, Response, NextFunction } from 'express'
import cors from 'cors'
import { PrismaClient, Prisma } from '@prisma/client'
import AdminJS from 'adminjs'
import * as AdminJSExpress from '@adminjs/express'
import { Database, Resource } from '@adminjs/prisma'
import formidableMiddleware from 'express-formidable'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const app = express()
const prisma = new PrismaClient()
const PORT = Number(process.env.PORT || 3000)
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me'

app.use(cors({ origin: ['http://localhost:4200'], credentials: true }))
app.use(express.json())

const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) =>
  (req: Request, res: Response, next: NextFunction) =>
    fn(req, res, next).catch(next)

app.get('/', (_req, res) => {
  res.send('Aquafriend API ✅')
})

app.get(
  '/api/health',
  asyncHandler(async (_req, res) => {
    await prisma.$queryRaw`SELECT 1`
    res.json({ ok: true, service: 'api-aquafriend', now: new Date().toISOString() })
  })
)

app.get(
  '/api/especies',
  asyncHandler(async (_req, res) => {
    const data = await prisma.especies.findMany({ orderBy: { id_especie: 'asc' }, take: 100 })
    res.json(data)
  })
)

app.get(
  '/api/peces',
  asyncHandler(async (req, res) => {
    const limit = Math.min(Number(req.query.limit) || 100, 500)
    const offset = Number(req.query.offset) || 0
    const rows = await prisma.$queryRaw<any[]>`
      SELECT * FROM peces ORDER BY id ASC LIMIT ${limit} OFFSET ${offset}
    `
    res.json(rows)
  })
)

app.get(
  '/api/programas',
  asyncHandler(async (_req, res) => {
    const data = await prisma.programas_educativos.findMany({ orderBy: { id_plan: 'asc' } })
    res.json(data)
  })
) 

app.post(
  '/api/auth/register',
  asyncHandler(async (req, res) => {
    const { nombre, apellido, email, telefono, rol, password, avatarUrl } = req.body
    if (!nombre || !apellido || !email || !telefono || !rol || !password) {
      return res.status(400).json({ error: 'Faltan campos requeridos' })
    }
    const exists = await prisma.usuarios.findUnique({ where: { email } })
    if (exists) return res.status(409).json({ error: 'El email ya está registrado' })
    const hash = await bcrypt.hash(password, 10)
    const roleRow =
      (await prisma.roles.findFirst({ where: { nombre: rol } })) ??
      (await prisma.roles.create({ data: { nombre: rol } }))
    const user = await prisma.usuarios.create({
      data: {
        nombre,
        apellido,
        email,
        pass_hash: hash,
        role_id: roleRow.id_role,
        activo: 1
      },
      select: { id_usuario: true, nombre: true, apellido: true, email: true, role_id: true }
    })
    res.status(201).json(user)
  })
)

app.post(
  '/api/auth/login',
  asyncHandler(async (req, res) => {
    const { email, password } = req.body
    const user = await prisma.usuarios.findUnique({ where: { email } })
    if (!user) return res.status(401).json({ error: 'Credenciales inválidas' })
    const ok = await bcrypt.compare(password, user.pass_hash)
    if (!ok) return res.status(401).json({ error: 'Credenciales inválidas' })
    const role = await prisma.roles.findUnique({ where: { id_role: user.role_id } })
    const token = jwt.sign({ sub: user.id_usuario, email: user.email, rol: role?.nombre }, JWT_SECRET, { expiresIn: '8h' })
    res.json({
      token,
      user: {
        id: user.id_usuario,
        nombre: user.nombre,
        apellido: user.apellido,
        email: user.email,
        rol: role?.nombre ?? ''
      }
    })
  })
)

AdminJS.registerAdapter({ Database, Resource })
;(async () => {
  try {
    const admin = new AdminJS({
      rootPath: '/admin',
      databases: [prisma],
      branding: { companyName: 'Aquafriend Admin' }
    })
    const adminRouter = AdminJSExpress.buildRouter(admin)
    app.use(admin.options.rootPath, formidableMiddleware(), adminRouter)
  } catch (e) {
    console.error('AdminJS error:', e)
  }
})()

app.use((_req, res) => {
  res.status(404).json({ error: 'Not Found' })
})

app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    return res.status(400).json({ error: err.code, message: err.message })
  }
  console.error(err)
  res.status(500).json({ error: 'Internal Server Error' })
})

const server = app.listen(PORT, () => {
  console.log(`API lista en http://localhost:${PORT}`)
})

const shutdown = async () => {
  await prisma.$disconnect()
  server.close(() => process.exit(0))
}
process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)
