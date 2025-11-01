# 🐠 AquaFriend - Guía de Configuración Completa

## 📋 Tabla de Contenidos
1. [Requisitos Previos](#requisitos-previos)
2. [Configuración de la Base de Datos](#configuración-de-la-base-de-datos)
3. [Configuración del Backend](#configuración-del-backend)
4. [Configuración del Frontend](#configuración-del-frontend)
5. [Probar la Integración](#probar-la-integración)
6. [Troubleshooting](#troubleshooting)

---

## 📋 Requisitos Previos

### Software necesario:

- ✅ **Node.js** (v16 o superior) → [Descargar](https://nodejs.org/)
- ✅ **XAMPP** o **WAMP** → [Descargar XAMPP](https://www.apachefriends.org/)
- ✅ **Git** (opcional) → [Descargar](https://git-scm.com/)
- ✅ **Visual Studio Code** (recomendado) → [Descargar](https://code.visualstudio.com/)

### Verificar instalación:

```bash
node --version    # Debe mostrar v16.x.x o superior
npm --version     # Debe mostrar 8.x.x o superior
```

---

## 🗄️ Configuración de la Base de Datos

### Paso 1: Iniciar XAMPP

1. Abre **XAMPP Control Panel**
2. Click en **Start** para:
   - ✅ Apache (opcional, solo si quieres usar phpMyAdmin)
   - ✅ MySQL (obligatorio)

### Paso 2: Crear la Base de Datos

1. Abre tu navegador y ve a: `http://localhost/phpmyadmin`
2. Click en "**Nueva**" en el panel izquierdo
3. Nombre de la base de datos: `aquafriends`
4. Collation: `utf8mb4_general_ci`
5. Click en **Crear**

### Paso 3: Ejecutar los Scripts SQL

#### Script 1: Estructura de tablas
1. Click en la base de datos `aquafriends`
2. Ve a la pestaña **SQL**
3. Pega todo el script que te compartí (el de CREATE TABLE)
4. Click en **Continuar**

#### Script 2: Datos iniciales
1. Ve a la pestaña **SQL** nuevamente
2. Pega el contenido de: `backend/sql/datos_iniciales.sql`
3. Click en **Continuar**

### Paso 4: Verificar

Deberías ver estas tablas creadas:
- ✅ roles
- ✅ usuarios
- ✅ escuelas
- ✅ profesor
- ✅ estudiantes
- ✅ programas_educativos
- ✅ reservas_estado
- ✅ reserva
- ✅ pagos
- ✅ especies
- ✅ y más...

---

## ⚙️ Configuración del Backend

### Paso 1: Navegar a la carpeta del backend

```bash
cd backend
```

### Paso 2: Instalar dependencias

```bash
npm install
```

Esto instalará:
- express
- mysql2
- cors
- dotenv
- body-parser

### Paso 3: Configurar variables de entorno

Edita el archivo `backend/.env`:

```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=          # ← Deja vacío si no tienes contraseña en MySQL
DB_NAME=aquafriends
DB_PORT=3306
```

### Paso 4: Iniciar el servidor

```bash
npm start
```

**✅ Deberías ver:**

```
✅ Conectado a MySQL - Base de datos: aquafriends
🚀 Servidor corriendo en http://localhost:3000
📊 API disponible en http://localhost:3000/api
🔗 Frontend esperado en http://localhost:4200
```

**❌ Si ves errores:**
- Verifica que MySQL esté corriendo en XAMPP
- Revisa que la base de datos `aquafriends` existe
- Confirma la contraseña en `.env`

### Paso 5: Probar el API

Abre el navegador y ve a: `http://localhost:3000/api/health`

Deberías ver:

```json
{
  "success": true,
  "message": "API de AquaFriend funcionando correctamente",
  "timestamp": "2025-01-11T..."
}
```

---

## 🎨 Configuración del Frontend

### Paso 1: Navegar a la carpeta de Angular

**Abre una NUEVA terminal** (no cierres la del backend):

```bash
cd Aquafriend
```

### Paso 2: Instalar dependencias

```bash
npm install
```

### Paso 3: Iniciar el servidor de desarrollo

```bash
ng serve
```

o

```bash
npm start
```

**✅ Deberías ver:**

```
** Angular Live Development Server is listening on localhost:4200 **
✔ Compiled successfully
```

### Paso 4: Abrir en el navegador

Ve a: `http://localhost:4200`

---

## 🧪 Probar la Integración

### Prueba 1: Formulario de Reservas (Usuario)

1. Ve a: `http://localhost:4200`
2. Scroll hasta la sección "**Reserva educativa**"
3. Llena el formulario:
   - Institución: `Colegio Prueba`
   - Correo: `test@ejemplo.cl`
   - Programa: Selecciona uno (ej: `Visita básica`)
   - Fecha: Selecciona una fecha futura
   - Personas: `25`
   - Comentarios: `Prueba de integración`
4. Click en **Enviar solicitud**

**✅ Resultado esperado:**
```
Reserva creada exitosamente ✅ Total a pagar: $196,350
```

### Prueba 2: Panel de Administración (Admin)

1. Ve a: `http://localhost:4200/admin/login`
2. Ingresa credenciales (cualquiera, es mock por ahora)
3. Serás redirigido a: `http://localhost:4200/dashboard/home`
4. En el menú lateral, click en **Reservas**
5. Deberías ver la reserva que creaste en la prueba 1

**✅ Deberías ver:**
- Tabla con todas las reservas
- ID, Escuela, Programa, Fecha, Estudiantes, Total, Estado
- Estadísticas: Total Reservas, Pendientes, Confirmadas, Total Estudiantes

---

## 🔧 Troubleshooting

### Problema: "No se pudieron cargar las reservas"

**Posibles causas:**
1. El backend no está corriendo
2. El backend está en puerto diferente a 3000
3. Hay error en la conexión a MySQL

**Solución:**
```bash
# Terminal 1 - Verifica que el backend esté corriendo
cd backend
npm start

# Terminal 2 - Verifica que Angular esté corriendo
cd Aquafriend
ng serve
```

### Problema: "ER_BAD_DB_ERROR: Unknown database"

**Solución:**
1. Abre phpMyAdmin
2. Verifica que la base de datos `aquafriends` exista
3. Si no existe, créala nuevamente

### Problema: "ECONNREFUSED"

**Solución:**
1. Abre XAMPP Control Panel
2. Asegúrate que MySQL esté en **Start** (verde)
3. Si no inicia, verifica que el puerto 3306 no esté ocupado

### Problema: "Port 3000 is already in use"

**Solución:**

**Windows:**
```bash
netstat -ano | findstr :3000
taskkill /PID <numero_pid> /F
```

**Mac/Linux:**
```bash
lsof -ti:3000 | xargs kill -9
```

O cambia el puerto en `backend/.env`:
```env
PORT=3001
```

### Problema: CORS Error en el navegador

**Solución:**
Verifica que en `backend/server.js` el CORS esté configurado para tu puerto de Angular:

```javascript
app.use(cors({
  origin: 'http://localhost:4200',  // ← Debe coincidir con tu puerto de Angular
  credentials: true
}));
```

---

## 📊 Estructura del Proyecto

```
AquaFriend/
│
├── Aquafriend/                # Frontend Angular
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/
│   │   │   │   └── main-body/        # Página principal con formulario
│   │   │   ├── admin/
│   │   │   │   └── features/
│   │   │   │       └── reservas/     # Vista de reservas en admin
│   │   │   └── services/
│   │   │       └── reserva.service.ts # Servicio para llamar API
│   │   └── ...
│   └── package.json
│
├── backend/                   # Backend Node.js + Express
│   ├── config/
│   │   └── database.js        # Conexión MySQL
│   ├── controllers/
│   │   └── reservaController.js # Lógica de negocio
│   ├── routes/
│   │   └── reservaRoutes.js   # Definición de endpoints
│   ├── sql/
│   │   └── datos_iniciales.sql # Datos de prueba
│   ├── .env                   # Variables de entorno
│   ├── server.js              # Servidor Express
│   └── package.json
│
└── INSTRUCCIONES_COMPLETAS.md # Este archivo
```

---

## 🚀 Comandos Rápidos

### Para iniciar todo (2 terminales):

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```

**Terminal 2 - Frontend:**
```bash
cd Aquafriend
ng serve
```

### Para detener todo:
- Press `Ctrl + C` en ambas terminales

---

## 📝 Notas Importantes

1. **Siempre inicia el backend ANTES que el frontend**
2. **Mantén ambos servidores corriendo** mientras trabajas
3. **MySQL debe estar activo** en XAMPP/WAMP
4. **No subas el archivo `.env`** a Git (contiene contraseñas)
5. **Los cambios en el backend** requieren reiniciar el servidor
6. **Los cambios en el frontend** se aplican automáticamente

---

## 🎯 Próximos Pasos

Una vez que todo funcione:

1. ✅ Agregar autenticación real con JWT
2. ✅ Implementar gestión de estados de reservas (confirmar, cancelar)
3. ✅ Crear endpoints para Peces, Animales, reptiles
4. ✅ Subir imágenes de la galería desde el admin
5. ✅ Deploy a producción (Railway, Render, etc.)

---

## 🆘 ¿Necesitas Ayuda?

Si después de seguir esta guía aún tienes problemas:

1. Revisa los logs en ambas consolas (backend y frontend)
2. Verifica que todas las dependencias se instalaron correctamente
3. Confirma que los puertos no estén ocupados
4. Asegúrate de seguir los pasos en orden

**Checklist rápido:**
- [ ] XAMPP/MySQL corriendo
- [ ] Base de datos `aquafriends` creada
- [ ] Tablas creadas correctamente
- [ ] Backend corriendo en puerto 3000
- [ ] Frontend corriendo en puerto 4200
- [ ] No hay errores en ninguna consola

---

¡Listo! Ahora tienes un sistema completo de reservas con frontend Angular + backend Node.js + MySQL 🎉
