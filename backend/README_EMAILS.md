# 📧 Sistema de Notificaciones por Email - AquaFriend

## ✅ Progreso Actual

### Completado:
- ✅ Nodemailer instalado
- ✅ Servicio de emails creado con 4 templates HTML profesionales
- ✅ Integrado en controlador de contactos
- ⏳ Falta integrar en controlador de reservas
- ⏳ Falta crear panel de contactos en admin
- ⏳ Falta configurar credenciales en `.env`

---

## 🔧 Configuración Requerida

### Paso 1: Configurar el archivo `.env`

Abre o crea el archivo `backend/.env` y agrega estas variables:

```env
# Configuración de Base de Datos (ya existentes)
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_contraseña
DB_NAME=aquafriend
DB_PORT=3306

# Configuración de Servidor (ya existente)
PORT=3000

# ========================================
# CONFIGURACIÓN DE EMAIL (NUEVO)
# ========================================

# Tu email de Gmail
EMAIL_USER=tu_email@gmail.com

# Contraseña de aplicación de Gmail (NO tu contraseña normal)
EMAIL_PASS=tu_contraseña_de_aplicacion

# Email del administrador del acuario
EMAIL_ADMIN=acuariopuyehue@gmail.com
```

---

## 📱 Cómo obtener la contraseña de aplicación de Gmail

### Opción 1: Usar Gmail (Recomendado)

1. **Activar verificación en 2 pasos:**
   - Ve a: https://myaccount.google.com/security
   - Activa "Verificación en 2 pasos"

2. **Generar contraseña de aplicación:**
   - Ve a: https://myaccount.google.com/apppasswords
   - Selecciona "Correo" y "Otro (nombre personalizado)"
   - Escribe "AquaFriend Backend"
   - Copia la contraseña de 16 caracteres
   - Pégala en `EMAIL_PASS` (sin espacios)

### Opción 2: Usar otro servicio

Si no quieres usar Gmail, puedes usar:
- **Outlook/Hotmail**
- **SendGrid** (gratis hasta 100 emails/día)
- **Mailgun**
- **Amazon SES**

---

## 🎨 Emails que se envían

### 1. Cuando alguien contacta desde el footer:

#### A) Email al Admin:
- **Para:** Tu email + email del acuario
- **Asunto:** 🔔 Nuevo contacto de [Nombre]
- **Contenido:**
  - Nombre de quien contacta
  - Email y teléfono
  - Mensaje
  - Fecha y hora
  - Link al panel de contactos

#### B) Email al Usuario:
- **Para:** Email del usuario que contactó
- **Asunto:** ¡Gracias por contactarnos! - Parque Acuario Puyehue
- **Contenido:**
  - Confirmación de recepción
  - Datos de contacto del acuario
  - Horarios de atención
  - Link a la página web

### 2. Cuando se hace una reserva educativa:

#### A) Email al Admin:
- **Para:** Tu email + email del acuario
- **Asunto:** 🎓 Nueva Reserva Educativa - [Escuela]
- **Contenido:**
  - Nombre de la institución
  - Programa seleccionado
  - Fecha y cantidad de estudiantes
  - Total a pagar destacado
  - Link al panel de reservas

#### B) Email a la Institución:
- **Para:** Email de la institución
- **Asunto:** ✅ Reserva Confirmada - [Programa]
- **Contenido:**
  - Confirmación de reserva
  - Detalles completos (fecha, cantidad, programa)
  - Total a pagar
  - Próximos pasos
  - Información de contacto
  - Recordatorios importantes

---

## 🧪 Cómo probar

### 1. Configurar el `.env`:
```bash
cd backend
nano .env  # o abre con tu editor
```

### 2. Reiniciar el servidor:
```bash
# Si está corriendo, detener con Ctrl+C
node server.js
```

Deberías ver:
```
✅ Servicio de email configurado correctamente
```

Si ves un error:
```
❌ Error en configuración de email
⚠️  Los emails NO se enviarán
```
Revisa tus credenciales en el `.env`

### 3. Probar el formulario de contacto:
- Ve a http://localhost:4200
- Baja al footer
- Completa y envía el formulario
- Revisa tu bandeja de entrada

### 4. Probar una reserva:
- Ve a http://localhost:4200
- Completa el formulario de reserva educativa
- Envía la reserva
- Revisa tu bandeja de entrada

---

## 📊 Archivos modificados/creados

```
backend/
├── services/
│   └── emailService.js (NUEVO)
├── controllers/
│   ├── contactoController.js (ACTUALIZADO - emails integrados)
│   └── reservaController.js (PENDIENTE - falta integrar emails)
├── package.json (nodemailer agregado)
└── .env (DEBES CONFIGURARLO)
```

---

## 🚨 Troubleshooting

### "Error: Invalid login"
**Causa:** Contraseña incorrecta o no es contraseña de aplicación
**Solución:** Genera una nueva contraseña de aplicación de Gmail

### "Error: Connection timeout"
**Causa:** Firewall o antivirus bloqueando el puerto 465/587
**Solución:** Permite conexiones SMTP en tu firewall

### Los emails no llegan
**Causa:** Pueden estar en spam
**Solución:**
- Revisa la carpeta de spam
- Marca como "No es spam"
- Agrega el remitente a contactos

### "Error: self signed certificate"
**Causa:** Problemas con SSL
**Solución:** Agrega esto en emailService.js línea 9:
```javascript
auth: {
  user: process.env.EMAIL_USER,
  pass: process.env.EMAIL_PASS
},
tls: {
  rejectUnauthorized: false  // Solo para desarrollo
}
```

---

## 🔮 Próximos pasos

1. ⏳ **Configurar `.env`** con tus credenciales
2. ⏳ **Probar emails** de contacto
3. ⏳ **Integrar emails** en reservaController
4. ⏳ **Crear panel** de contactos en admin
5. ⏳ **Agregar contador** de contactos pendientes

---

## 💡 Mejoras futuras (opcional)

- [ ] Usar templates más avanzados (Handlebars, Pug)
- [ ] Agregar adjuntos (PDF con detalles de reserva)
- [ ] Programar envío de recordatorios
- [ ] Estadísticas de emails enviados
- [ ] Integración con WhatsApp Business API
- [ ] Sistema de tickets/seguimiento

---

## 📞 ¿Necesitas ayuda?

Si tienes problemas configurando los emails:
1. Revisa los logs del servidor backend
2. Verifica que el `.env` esté bien configurado
3. Prueba enviar un email de prueba manualmente

**¡Los emails están casi listos! Solo falta configurar las credenciales.** 📧✨
