# 📊 Scripts SQL - AquaFriend

Guía completa para configurar la base de datos del proyecto AquaFriend.

## 📋 Orden de Ejecución

Ejecuta los scripts en el siguiente orden en **phpMyAdmin** o tu cliente MySQL preferido:

### 1️⃣ `01_crear_tabla_contactos.sql`
**Descripción:** Crea la tabla para almacenar los mensajes del formulario de contacto del footer.

**Tabla creada:**
- `contactos` - Almacena nombre, email, teléfono, mensaje y fecha

**Cuándo ejecutar:** Una sola vez al configurar el proyecto por primera vez.

---

### 2️⃣ `02_datos_iniciales.sql`
**Descripción:** Inserta datos iniciales obligatorios para el funcionamiento del sistema.

**Datos insertados:**
- Estados de reserva (Pendiente, Confirmada, Cancelada, Completada)
- Programas educativos (Visita básica, Visita académica, Taller aplicado)
- Categorías de especies (Pez, Anfibio, Mamífero, etc.)
- Hábitats predefinidos
- Roles de usuario (Administrador, Editor, Visitante)
- Datos de prueba opcionales (comentados)

**Cuándo ejecutar:** Una sola vez después del script 01.

---

### 3️⃣ `03_crear_admin.sql`
**Descripción:** Crea el usuario administrador por defecto.

**Usuario creado:**
- Email: `admin@aquafriend.cl`
- Password: `admin123`

**⚠️ IMPORTANTE:** Cambia la contraseña después del primer login en producción.

**Cuándo ejecutar:** Una sola vez después del script 02.

---

## 🚀 Inicio Rápido

### Opción A: Ejecutar todos los scripts de una vez

```sql
-- En phpMyAdmin, pega y ejecuta en este orden:

-- 1. Tabla de contactos
SOURCE 01_crear_tabla_contactos.sql;

-- 2. Datos iniciales
SOURCE 02_datos_iniciales.sql;

-- 3. Usuario admin
SOURCE 03_crear_admin.sql;
```

### Opción B: Ejecutar uno por uno

1. Abre **phpMyAdmin**
2. Selecciona tu base de datos
3. Ve a la pestaña **SQL**
4. Copia y pega el contenido de cada archivo en orden
5. Haz clic en **Continuar** o **Go**

---

## 🗂️ Estructura de Tablas

### Tabla: `contactos`
Almacena las consultas del formulario de contacto.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id_contacto` | INT (PK) | ID único autoincrementable |
| `nombre` | VARCHAR(100) | Nombre completo del contacto |
| `email` | VARCHAR(150) | Correo electrónico |
| `telefono` | VARCHAR(20) | Teléfono (opcional) |
| `mensaje` | TEXT | Mensaje del usuario |
| `fecha_contacto` | TIMESTAMP | Fecha y hora del contacto |
| `leido` | BOOLEAN | Si fue revisado por admin |

### Otras tablas del sistema:
- `reservas_estado` - Estados de las reservas educativas
- `programas_educativos` - Programas disponibles
- `escuelas` - Instituciones educativas
- `reserva` - Reservas de visitas educativas
- `usuarios` - Usuarios del sistema
- `roles` - Roles de usuario
- `categorias_especie` - Categorías de animales
- `habitats` - Hábitats disponibles

---

## 🔧 Comandos Útiles

### Ver todas las consultas de contacto
```sql
SELECT * FROM contactos ORDER BY fecha_contacto DESC;
```

### Ver contactos no leídos
```sql
SELECT * FROM contactos WHERE leido = FALSE ORDER BY fecha_contacto DESC;
```

### Marcar un contacto como leído
```sql
UPDATE contactos SET leido = TRUE WHERE id_contacto = 1;
```

### Eliminar todos los contactos (⚠️ cuidado en producción)
```sql
DELETE FROM contactos;
```

### Resetear datos iniciales
```sql
-- Ejecutar nuevamente el archivo 02_datos_iniciales.sql
SOURCE 02_datos_iniciales.sql;
```

---

## 🐛 Troubleshooting

### Error: "Table already exists"
**Solución:** Los scripts usan `CREATE TABLE IF NOT EXISTS`, así que esto no debería ocurrir. Si lo hace, verifica que no haya errores de sintaxis.

### Error: "Duplicate entry"
**Solución:** Algunos scripts usan `ON DUPLICATE KEY UPDATE` para evitar duplicados. Si ves este error, revisa que no estés insertando datos manualmente que ya existen.

### Error: "Unknown database"
**Solución:** Asegúrate de haber seleccionado la base de datos correcta antes de ejecutar los scripts:
```sql
USE nombre_de_tu_base_datos;
```

### No puedo iniciar sesión con el admin
**Solución:**
1. Verifica que ejecutaste el script `03_crear_admin.sql`
2. Revisa que el backend esté corriendo: `cd backend && node server.js`
3. Verifica las credenciales en el archivo `.env` del backend

---

## 📝 Notas Importantes

1. **Backup:** Siempre haz un backup de tu base de datos antes de ejecutar scripts SQL.

2. **Contraseñas:** El script `03_crear_admin.sql` usa contraseñas hasheadas con bcrypt. NO guardes contraseñas en texto plano.

3. **Producción:** En un entorno de producción:
   - Cambia todas las contraseñas por defecto
   - Elimina los datos de prueba
   - Configura backups automáticos
   - Usa conexiones SSL para la base de datos

4. **Desarrollo:** Los scripts están optimizados para desarrollo local. Puedes ejecutarlos múltiples veces sin problemas.

---

## 🆘 ¿Necesitas ayuda?

Si tienes problemas con los scripts SQL:
1. Revisa los logs del servidor Node.js
2. Verifica la configuración del archivo `.env`
3. Asegúrate de que MySQL está corriendo
4. Contacta al equipo de desarrollo

---

**Última actualización:** 2025-10-12
**Versión:** 1.0.0
