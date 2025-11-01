# Backend AquaFriend - API REST con Node.js + Express

(?) PARA INICIAR LOS SERVIDORES DEL BACKEND DEBEN HACER EL SIGUIENTE COMANDO EN LA TERMINAL:
-- cd backend && node server.js

# Pasos para iniciar el servidor Node.js (recuerda usar otra terminal no en la que inicias tu proyecto):
1. Abrir una nueva terminal
En VSCode: Terminal → Nueva Terminal (o Ctrl + Shift + ñ) o usar tu terminal de sistema (CMD, PowerShell, Git Bash)

2. Navegar a la carpeta backend

cd backend

3. Verificar que tienes las dependencias instaladas

npm install (Esto instalará Express, CORS, body-parser, dotenv, etc.)

4. Iniciar el servidor
node server.js o si tienes un script en el package.json:
npm start

5. Verificar que está corriendo
Deberías ver en la terminal algo como:
🚀 Servidor corriendo en http://localhost:3000
📊 API disponible en http://localhost:3000/api
🔗 Frontend esperado en http://localhost:4200

6. Probar la API
Abre en tu navegador: http://localhost:3000/api/health Deberías ver:
{
  "success": true,
  "message": "API de AquaFriend funcionando correctamente",
  "timestamp": "2025-10-12T..."
}

## 📋 Requisitos Previos para usar node.js + express + mysql

1. **Node.js** (v16 o superior) - [Descargar aquí](https://nodejs.org/)
2. **XAMPP** o **WAMP** con MySQL corriendo
3. **phpMyAdmin** para gestionar la base de datos

## 🚀 Instalación

### 1. Crear la Base de Datos

1. Abre **phpMyAdmin** en tu navegador: `http://localhost/phpmyadmin` (recuerda tener xampp)
2. Crea una nueva base de datos llamada: `aquafriends`
3. Ejecuta el script SQL principal (el que compartiste)
4. Ejecuta el script de datos iniciales: `backend/sql/datos_iniciales.sql`

### 2. Configurar Variables de Entorno

Edita el archivo `.env` en la carpeta `backend/`:

```env
# Configuración del servidor
PORT=3000

# Configuración de la base de datos MySQL
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=          # ← Pon tu contraseña de MySQL aquí (si tienes una)
DB_NAME=aquafriends
DB_PORT=3306
```

### 3. Instalar Dependencias

```bash
cd backend
npm install
```

### 4. Iniciar el Servidor

```bash
npm start
```

Deberías ver algo como:

```
✅ Conectado a MySQL - Base de datos: aquafriends
🚀 Servidor corriendo en http://localhost:3000
📊 API disponible en http://localhost:3000/api
🔗 Frontend esperado en http://localhost:4200
```

## 📡 Endpoints de la API

### Reservas

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/health` | Verificar que la API está funcionando |
| POST | `/api/reservas` | Crear una nueva reserva educativa |
| GET | `/api/reservas` | Obtener todas las reservas (admin) |
| GET | `/api/reservas/programas` | Obtener programas educativos disponibles |

### Ejemplo de Petición POST

```json
{
  "institucion": "Colegio San José",
  "correo": "contacto@sanjosse.cl",
  "programa": "Visita básica",
  "fecha": "2025-11-15",
  "personas": 30,
  "comentarios": "Grupo de 5° básico"
}
```

### Ejemplo de Respuesta

```json
{
  "success": true,
  "message": "Reserva creada exitosamente",
  "data": {
    "id_reserva": 1,
    "total_pagar": "196350.00"
  }
}
```

## 🧪 Probar la API

### Usando el navegador (GET requests):

```
http://localhost:3000/api/health
http://localhost:3000/api/reservas
http://localhost:3000/api/reservas/programas
```

### Usando Postman o Thunder Client:

1. Crea una request POST a: `http://localhost:3000/api/reservas`
2. Headers: `Content-Type: application/json`
3. Body: (ver ejemplo arriba)

## 📂 Estructura del Proyecto

```
backend/
├── config/
│   └── database.js         # Configuración de MySQL
├── controllers/
│   └── reservaController.js # Lógica de negocio para reservas
├── routes/
│   └── reservaRoutes.js     # Definición de rutas
├── sql/
│   └── datos_iniciales.sql  # Datos de prueba
├── .env                     # Variables de entorno (NO subir a Git)
├── server.js                # Punto de entrada de la aplicación
└── package.json             # Dependencias del proyecto
```

## 🔧 Solución de Problemas

### Error: "ER_BAD_DB_ERROR: Unknown database 'aquafriends'"
- **Solución**: Asegúrate de haber creado la base de datos en phpMyAdmin

### Error: "ECONNREFUSED 127.0.0.1:3306"
- **Solución**: Verifica que MySQL esté corriendo en XAMPP/WAMP

### Error: "Access denied for user 'root'@'localhost'"
- **Solución**: Verifica tu contraseña en el archivo `.env`

### La API no responde
- **Solución**: Verifica que el servidor esté corriendo en el puerto 3000
- Revisa la consola para ver errores

## 🔐 Seguridad

**IMPORTANTE para producción:**

1. Nunca subas el archivo `.env` a Git (ya está en `.gitignore`)
2. Usa contraseñas seguras
3. Implementa autenticación JWT
4. Valida y sanitiza todas las entradas
5. Usa HTTPS en producción

## 📝 Notas

- El servidor debe estar corriendo mientras usas el frontend
- Los cambios en el código requieren reiniciar el servidor
- Para desarrollo, considera usar `nodemon` para auto-reload

## 🆘 Soporte

Si tienes problemas:
1. Revisa los logs en la consola
2. Verifica que MySQL esté corriendo
3. Asegúrate de que el puerto 3000 esté libre
4. Comprueba que las tablas existan en la base de datos
