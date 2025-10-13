# 📬 Implementación del Formulario de Contacto

## ✅ Completado

El formulario de contacto del footer ahora está completamente funcional y guarda los datos en la base de datos MySQL.

---

## 🚀 Cómo probar

### 1. Configurar la base de datos

Ejecuta el script SQL en **phpMyAdmin** o tu cliente MySQL:

```sql
-- Ejecutar en este orden:
SOURCE backend/sql/01_crear_tabla_contactos.sql;
```

Esto creará la tabla `contactos` en tu base de datos.

### 2. Reiniciar el servidor backend

Si ya tienes el backend corriendo, **detén el servidor** (Ctrl+C) y vuelve a iniciarlo para que cargue las nuevas rutas:

```bash
cd backend
node server.js
```

Deberías ver en la consola:
```
✅ Conectado a MySQL - Base de datos: aquafriend
🚀 Servidor corriendo en http://localhost:3000
```

### 3. Probar el formulario

1. Abre tu aplicación Angular: `http://localhost:4200`
2. Baja al **footer** (parte inferior de la página)
3. Completa el formulario de "Contáctanos":
   - Nombre (obligatorio)
   - Email (obligatorio)
   - Teléfono (opcional)
   - Mensaje (opcional)
4. Haz clic en **"Enviar"**

---

## 🎯 Qué debe pasar

### ✅ Si todo funciona bien:

1. El botón cambiará a "Enviando..."
2. Aparecerá un mensaje verde: **"¡Gracias por contactarnos! Te responderemos pronto."**
3. El formulario se limpiará automáticamente
4. Los datos se guardarán en la tabla `contactos` de MySQL

### ❌ Si hay un error:

- **"Error de conexión. Verifica que el servidor esté corriendo."**
  - Solución: Asegúrate de que el backend esté corriendo en el puerto 3000

- **"Por favor completa todos los campos obligatorios"**
  - Solución: Completa al menos Nombre y Email

- **Otros errores:** Revisa la consola del navegador (F12) y los logs del servidor

---

## 📊 Ver los datos guardados

### En phpMyAdmin:

```sql
SELECT * FROM contactos ORDER BY fecha_contacto DESC;
```

### Ver solo los no leídos:

```sql
SELECT * FROM contactos WHERE leido = FALSE;
```

---

## 🔧 Endpoints de la API

El backend ahora tiene estos nuevos endpoints:

### POST `/api/contactos`
Crear un nuevo contacto

**Body:**
```json
{
  "nombre": "Juan Pérez",
  "email": "juan@example.com",
  "telefono": "+56912345678",
  "mensaje": "Hola, quisiera más información"
}
```

**Respuesta exitosa:**
```json
{
  "success": true,
  "message": "¡Gracias por contactarnos! Te responderemos pronto.",
  "data": {
    "id_contacto": 1
  }
}
```

### GET `/api/contactos`
Obtener todos los contactos (para panel admin)

### GET `/api/contactos/no-leidos`
Obtener contactos no leídos

### PATCH `/api/contactos/:id/leido`
Marcar un contacto como leído

---

## 📁 Archivos modificados/creados

### Backend:
- ✅ `backend/sql/01_crear_tabla_contactos.sql` (nuevo)
- ✅ `backend/sql/02_datos_iniciales.sql` (renombrado)
- ✅ `backend/sql/03_crear_admin.sql` (renombrado)
- ✅ `backend/sql/README_SQL.md` (nuevo - guía completa)
- ✅ `backend/controllers/contactoController.js` (nuevo)
- ✅ `backend/routes/contactoRoutes.js` (nuevo)
- ✅ `backend/server.js` (actualizado)

### Frontend:
- ✅ `Aquafriend/src/app/services/contact.service.ts` (actualizado)
- ✅ `Aquafriend/src/app/components/footer/footer.ts` (actualizado)
- ✅ `Aquafriend/src/app/components/footer/footer.html` (actualizado)

---

## 🎨 Funcionalidades implementadas

✅ Formulario con validaciones en tiempo real
✅ Mensajes de éxito y error visuales
✅ Botón deshabilitado mientras envía
✅ Limpieza automática del formulario tras envío exitoso
✅ Guardado en base de datos MySQL
✅ Endpoints REST completos para admin
✅ Código bien documentado y comentado
✅ Compatible con el formulario existente de main-body

---

## 🔮 Próximas mejoras (opcional)

- [ ] Panel de administración para ver los contactos
- [ ] Notificaciones en tiempo real cuando llega un nuevo contacto
- [ ] Envío de email automático al admin
- [ ] Respuesta automática al usuario
- [ ] Marcado de spam/no spam
- [ ] Exportar contactos a CSV/Excel

---

## 🆘 Troubleshooting

### El formulario no envía nada

1. Abre la consola del navegador (F12)
2. Ve a la pestaña "Network"
3. Intenta enviar el formulario
4. Busca la petición a `/api/contactos`
5. Si está en rojo, revisa el error
6. Si no aparece, verifica que el backend esté corriendo

### Error 404 en la petición

El backend no tiene la ruta configurada. Verifica que:
- Reiniciaste el servidor después de los cambios
- El archivo `contactoRoutes.js` existe
- El `server.js` tiene la línea: `app.use('/api/contactos', contactoRoutes);`

### Error CORS

Verifica en `backend/server.js` línea 10-13 que el CORS esté configurado para `http://localhost:4200`

---

**¡Listo para probar! 🎉**

Si tienes algún problema, revisa los logs del servidor backend en la terminal.
