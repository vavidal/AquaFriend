# CRUD de Usuarios - AquaFriend

Sistema completo de gestión de usuarios para el panel de administración.

## Características Implementadas

### Backend (Node.js/Express)

#### Rutas API (`/api/usuarios`)
- **GET /** - Obtener todos los usuarios
- **GET /:id** - Obtener un usuario por ID
- **POST /** - Crear nuevo usuario
- **PUT /:id** - Actualizar usuario existente
- **DELETE /:id** - Eliminar (desactivar) usuario
- **GET /roles/listar** - Obtener todos los roles disponibles

#### Controlador (`usuarioController.js`)
Funciones implementadas:
- `obtenerTodos()` - Lista todos los usuarios con su rol
- `obtenerPorId()` - Obtiene un usuario específico
- `crear()` - Crea un nuevo usuario con validaciones
- `actualizar()` - Actualiza datos del usuario (nombre, apellido, email, rol, estado)
- `eliminar()` - Desactiva el usuario (soft delete)
- `obtenerRoles()` - Lista roles disponibles del sistema

#### Validaciones del Backend
- Email único (no puede haber duplicados)
- Campos requeridos al crear: nombre, apellido, email, password, role_id
- Verificación de existencia antes de actualizar/eliminar
- Contraseña opcional al actualizar (solo se actualiza si se proporciona)

### Frontend (Angular)

#### Componentes

**1. UsersListComponent** (`users-list.component.ts`)
- Listado completo de usuarios en tabla
- Búsqueda en tiempo real (nombre, apellido, email, rol)
- Botón para crear nuevo usuario
- Acciones: Editar y Eliminar por usuario
- Modal de edición integrado
- Estados visuales: Activo/Inactivo

**2. CreateAccountComponent** (`create-user.component.ts`)
- Formulario de creación de usuarios
- Carga dinámica de roles desde el backend
- Validaciones del formulario:
  - Nombre y apellido requeridos
  - Email válido y requerido
  - Contraseña mínimo 6 caracteres
  - Rol requerido
- Preview de avatar (opcional)
- Estados de carga durante la creación

#### Servicio (`usuario.service.ts`)
Métodos implementados:
- `obtenerTodos()` - Lista usuarios
- `obtenerPorId(id)` - Obtiene un usuario
- `crear(usuario)` - Crea usuario
- `actualizar(id, usuario)` - Actualiza usuario
- `eliminar(id)` - Elimina usuario
- `obtenerRoles()` - Lista roles

#### Rutas
- `/dashboard/user` - Redirige a la lista
- `/dashboard/user/lista` - Listado de usuarios
- `/dashboard/user/crear` - Crear nuevo usuario

## Estructura de Base de Datos

### Tabla `usuarios`
```sql
- id_usuario (INT, AUTO_INCREMENT, PRIMARY KEY)
- nombre (VARCHAR(150))
- apellido (VARCHAR(150))
- email (VARCHAR(180), UNIQUE)
- pass_hash (VARCHAR(255))
- role_id (TINYINT, FK -> roles.id_role)
- activo (TINYINT, DEFAULT 1)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

### Tabla `roles`
```sql
- id_role (TINYINT, PRIMARY KEY)
- nombre (VARCHAR(40))
```

Roles por defecto:
1. Administrador
2. Editor
3. Visitante

## Cómo Usar

### 1. Iniciar el Backend
```bash
cd backend
node server.js
```
El servidor estará en: http://localhost:3000

### 2. Iniciar el Frontend
```bash
cd Aquafriend
ng serve
```
La aplicación estará en: http://localhost:4200

### 3. Acceder al Panel de Usuarios
1. Ir a http://localhost:4200/dashboard/user
2. Verás la lista de usuarios existentes
3. Usa el botón "+ Nuevo Usuario" para crear
4. Usa los botones de editar (✏️) o eliminar (🗑️) en cada fila

## Funcionalidades Detalladas

### Crear Usuario
1. Click en "+ Nuevo Usuario"
2. Llenar el formulario:
   - Nombre y Apellido
   - Email
   - Contraseña (mínimo 6 caracteres)
   - Seleccionar Rol
   - Avatar (opcional)
3. Click en "Crear usuario"
4. El sistema valida y crea el usuario
5. Redirecciona automáticamente a la lista

### Editar Usuario
1. Click en el botón de editar (✏️) en la fila del usuario
2. Se abre un modal con los datos actuales
3. Modificar los campos deseados:
   - Nombre
   - Apellido
   - Email
   - Estado (Activo/Inactivo)
4. Click en "Guardar Cambios"
5. La tabla se actualiza automáticamente

### Eliminar Usuario
1. Click en el botón de eliminar (🗑️) en la fila del usuario
2. Confirmar la acción en el diálogo
3. El usuario se desactiva (no se elimina físicamente)
4. La tabla se actualiza automáticamente

### Búsqueda
- Escribe en el campo de búsqueda
- La tabla se filtra en tiempo real
- Busca en: nombre, apellido, email y rol

## Notas de Seguridad

⚠️ **IMPORTANTE**: El sistema actualmente almacena contraseñas en texto plano.

Para producción se recomienda:
1. Instalar bcrypt: `npm install bcrypt`
2. Encriptar contraseñas antes de guardar
3. Usar bcrypt.compare() para validar login
4. Implementar tokens JWT para autenticación
5. Agregar middleware de autorización

## Próximas Mejoras Sugeridas

- [ ] Encriptación de contraseñas con bcrypt
- [ ] Sistema de permisos por rol
- [ ] Paginación en la lista de usuarios
- [ ] Exportar lista de usuarios a Excel/CSV
- [ ] Historial de cambios de usuarios
- [ ] Recuperación de contraseña por email
- [ ] Validación de fuerza de contraseña
- [ ] Upload real de avatar a servidor
- [ ] Filtros avanzados (por rol, estado, fecha)
- [ ] Ordenamiento por columnas

## Testing

### Probar con Postman/Thunder Client

**Obtener todos los usuarios:**
```
GET http://localhost:3000/api/usuarios
```

**Crear usuario:**
```
POST http://localhost:3000/api/usuarios
Content-Type: application/json

{
  "nombre": "Juan",
  "apellido": "Pérez",
  "email": "juan.perez@example.com",
  "password": "123456",
  "role_id": 1
}
```

**Actualizar usuario:**
```
PUT http://localhost:3000/api/usuarios/2
Content-Type: application/json

{
  "nombre": "Juan Carlos",
  "email": "juanc.perez@example.com",
  "activo": 1
}
```

**Eliminar usuario:**
```
DELETE http://localhost:3000/api/usuarios/2
```

**Obtener roles:**
```
GET http://localhost:3000/api/usuarios/roles/listar
```

## Archivos Creados/Modificados

### Backend
- ✅ `backend/routes/usuarioRoutes.js` (nuevo)
- ✅ `backend/controllers/usuarioController.js` (nuevo)
- ✅ `backend/server.js` (modificado - agregada ruta de usuarios)

### Frontend
- ✅ `Aquafriend/src/app/admin/features/users/usuario.service.ts` (nuevo)
- ✅ `Aquafriend/src/app/admin/features/users/users-list.component.ts` (nuevo)
- ✅ `Aquafriend/src/app/admin/features/users/users-list.component.html` (nuevo)
- ✅ `Aquafriend/src/app/admin/features/users/users-list.component.scss` (nuevo)
- ✅ `Aquafriend/src/app/admin/features/users/create-user.component.ts` (modificado)
- ✅ `Aquafriend/src/app/admin/features/users/create-user.component.html` (modificado)
- ✅ `Aquafriend/src/app/admin/features/users/user.routes.ts` (modificado)

## Soporte

Si encuentras algún problema:
1. Verifica que el backend esté corriendo en el puerto 3000
2. Verifica que el frontend esté corriendo en el puerto 4200
3. Revisa la consola del navegador para errores de CORS o red
4. Revisa los logs del servidor Node.js para errores del backend
5. Verifica que la base de datos tenga las tablas `usuarios` y `roles` con datos

---

**Desarrollo completado el:** 13 de octubre de 2025
**Sistema:** AquaFriend - Panel de Administración
