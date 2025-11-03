const nodemailer = require('nodemailer');
require('dotenv').config();

// ================================================================
// CONFIGURACIÓN DEL TRANSPORTADOR DE EMAIL
// ================================================================
// Usa las credenciales del archivo .env
const transporter = nodemailer.createTransport({
  service: 'gmail', // Puedes cambiar a otro servicio (Outlook, SendGrid, etc.)
  auth: {
    user: process.env.EMAIL_USER, // Tu email
    pass: process.env.EMAIL_PASS  // Tu contraseña de aplicación
  }
});

// Verificar configuración al iniciar
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ Error en configuración de email:', error.message);
    console.log('⚠️  Los emails NO se enviarán. Verifica tu archivo .env');
  } else {
    console.log('✅ Servicio de email configurado correctamente');
  }
});

// ================================================================
// UTILIDADES
// ================================================================

function formatCLP(value) {
  const n = typeof value === 'number' ? value : parseFloat(String(value).replace(/[^0-9.-]/g, ''));
  if (isNaN(n)) return '$0';
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0,
  }).format(n);
}

// ================================================================
// FUNCIONES PARA ENVIAR EMAILS
// ================================================================

/**
 * Enviar email de nuevo contacto al administrador
 */
async function enviarEmailNuevoContactoAdmin(contacto) {
  const mailOptions = {
    from: `"AquaFriend - Notificaciones" <${process.env.EMAIL_USER}>`,
    to: `${process.env.EMAIL_USER}, ${process.env.EMAIL_ADMIN}`, // Tu email + email del acuario
    subject: `🔔 Nuevo contacto de ${contacto.nombre}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; }
          .container { background: white; border-radius: 8px; padding: 30px; max-width: 600px; margin: 0 auto; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #194377 0%, #1e3c72 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center; }
          .content { padding: 20px 0; }
          .field { margin: 15px 0; padding: 10px; background: #f8f9fa; border-left: 4px solid #194377; }
          .field strong { color: #194377; }
          .footer { margin-top: 30px; padding-top: 20px; border-top: 2px solid #eee; text-align: center; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0;">🔔 Nuevo Contacto</h1>
            <p style="margin: 10px 0 0 0;">Parque Acuario Puyehue</p>
          </div>
          <div class="content">
            <p>¡Hola! Tienes un nuevo mensaje de contacto desde la página web:</p>

            <div class="field">
              <strong>👤 Nombre:</strong><br>
              ${contacto.nombre}
            </div>

            <div class="field">
              <strong>📧 Email:</strong><br>
              <a href="mailto:${contacto.email}">${contacto.email}</a>
            </div>

            ${contacto.telefono ? `
            <div class="field">
              <strong>📱 Teléfono:</strong><br>
              <a href="tel:${contacto.telefono}">${contacto.telefono}</a>
            </div>
            ` : ''}

            ${contacto.mensaje ? `
            <div class="field">
              <strong>💬 Mensaje:</strong><br>
              ${contacto.mensaje}
            </div>
            ` : ''}

            <div class="field">
              <strong>🕐 Fecha:</strong><br>
              ${new Date().toLocaleString('es-CL')}
            </div>

            <p style="margin-top: 20px;">
              <strong>📊 Ver en el panel:</strong><br>
              <a href="http://localhost:4200/dashboard/contactos" style="color: #194377;">Ir al panel de contactos</a>
            </p>
          </div>
          <div class="footer">
            Sistema de Notificaciones - Parque Acuario Puyehue<br>
            Este es un email automático, no responder.
          </div>
        </div>
      </body>
      </html>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email enviado al admin:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error al enviar email al admin:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Enviar email de confirmación al usuario que contactó
 */
async function enviarEmailConfirmacionUsuario(contacto) {
  const mailOptions = {
    from: `"Parque Acuario Puyehue" <${process.env.EMAIL_USER}>`,
    to: contacto.email,
    subject: '¡Gracias por contactarnos! - Parque Acuario Puyehue',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; }
          .container { background: white; border-radius: 8px; padding: 30px; max-width: 600px; margin: 0 auto; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #194377 0%, #1e3c72 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center; }
          .content { padding: 20px 0; line-height: 1.6; }
          .highlight { background: #e8f4f8; padding: 15px; border-radius: 5px; margin: 20px 0; }
          .footer { margin-top: 30px; padding-top: 20px; border-top: 2px solid #eee; text-align: center; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0;">✅ ¡Mensaje Recibido!</h1>
            <p style="margin: 10px 0 0 0;">Parque Acuario Puyehue</p>
          </div>
          <div class="content">
            <p>Hola <strong>${contacto.nombre}</strong>,</p>

            <p>¡Gracias por contactarnos! Hemos recibido tu mensaje y te responderemos a la brevedad.</p>

            <div class="highlight">
              <strong>📧 Tu consulta:</strong><br>
              ${contacto.mensaje || 'Sin mensaje específico'}
            </div>

            <p><strong>Datos de contacto:</strong></p>
            <ul>
              <li>📞 Teléfono: +56 9 8634 4271</li>
              <li>📧 Email: acuariopuyehue@gmail.com</li>
              <li>📍 Ruta Interlagos T 981 U, km 3 Chiscaihue</li>
              <li>🕐 Horarios: Lunes a Viernes 09:00 - 18:00</li>
            </ul>

            <p style="margin-top: 20px;">
              Mientras tanto, te invitamos a conocer más sobre nuestras <strong>visitas educativas</strong> y <strong>programas</strong> en nuestra página web.
            </p>

            <p>¡Esperamos verte pronto! 🐠🌊</p>
          </div>
          <div class="footer">
            Parque Acuario Puyehue - Educación y Conservación<br>
            <a href="http://localhost:4200" style="color: #194377;">www.acuariopuyehue.cl</a>
          </div>
        </div>
      </body>
      </html>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email de confirmación enviado al usuario:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error al enviar email al usuario:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Enviar email de nueva reserva al administrador
 */
async function enviarEmailNuevaReservaAdmin(reserva) {
  const mailOptions = {
    from: `"AquaFriend - Notificaciones" <${process.env.EMAIL_USER}>`,
    to: `${process.env.EMAIL_USER}, ${process.env.EMAIL_ADMIN}`,
    subject: `🎓 Nueva Reserva Educativa - ${reserva.escuela}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; }
          .container { background: white; border-radius: 8px; padding: 30px; max-width: 600px; margin: 0 auto; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center; }
          .content { padding: 20px 0; }
          .field { margin: 15px 0; padding: 10px; background: #f8f9fa; border-left: 4px solid #4CAF50; }
          .field strong { color: #4CAF50; }
          .total { background: #4CAF50; color: white; padding: 20px; border-radius: 8px; text-align: center; font-size: 24px; font-weight: bold; margin: 20px 0; }
          .footer { margin-top: 30px; padding-top: 20px; border-top: 2px solid #eee; text-align: center; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0;">🎓 Nueva Reserva Educativa</h1>
            <p style="margin: 10px 0 0 0;">Parque Acuario Puyehue</p>
          </div>
          <div class="content">
            <p>¡Excelente! Tienes una nueva reserva educativa:</p>

            <div class="field">
              <strong>🏫 Institución:</strong><br>
              ${reserva.escuela}
            </div>

            <div class="field">
              <strong>📧 Email:</strong><br>
              <a href="mailto:${reserva.email}">${reserva.email}</a>
            </div>

            <div class="field">
              <strong>📚 Programa:</strong><br>
              ${reserva.programa}
            </div>

            <div class="field">
              <strong>📅 Fecha:</strong><br>
              ${new Date(reserva.fecha).toLocaleDateString('es-CL')}
            </div>

            <div class="field">
              <strong>👥 Cantidad:</strong><br>
              ${reserva.cantidad} estudiantes
            </div>

            ${reserva.comentarios ? `
            <div class="field">
              <strong>📝 Comentarios:</strong><br>
              ${reserva.comentarios}
            </div>
            ` : ''}

            <div class="total">
              💰 Total estimado: ${formatCLP(reserva.total)}
            </div>

            <p style="margin-top: 20px;">
              <strong>📊 Ver en el panel:</strong><br>
              <a href="http://localhost:4200/dashboard/reservas" style="color: #4CAF50;">Ir al panel de reservas</a>
            </p>
          </div>
          <div class="footer">
            Sistema de Notificaciones - Parque Acuario Puyehue<br>
            Este es un email automático, no responder.
          </div>
        </div>
      </body>
      </html>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email de reserva enviado al admin:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error al enviar email de reserva al admin:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Enviar email de confirmación de reserva a la institución
 */
async function enviarEmailConfirmacionReserva(reserva) {
  const mailOptions = {
    from: `"Parque Acuario Puyehue" <${process.env.EMAIL_USER}>`,
    to: reserva.email,
    subject: `📩 Solicitud de reserva recibida - ${reserva.programa}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; }
          .container { background: white; border-radius: 8px; padding: 30px; max-width: 600px; margin: 0 auto; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center; }
          .content { padding: 20px 0; line-height: 1.6; }
          .details { background: #e8f5e9; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .total { background: #4CAF50; color: white; padding: 15px; border-radius: 8px; text-align: center; font-size: 20px; font-weight: bold; margin: 20px 0; }
          .footer { margin-top: 30px; padding-top: 20px; border-top: 2px solid #eee; text-align: center; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header" style="background: linear-gradient(135deg, #1e88e5 0%, #1565c0 100%);">
            <h1 style="margin: 0;">📩 Solicitud de reserva recibida</h1>
            <p style="margin: 10px 0 0 0;">Parque Acuario Puyehue</p>
          </div>
          <div class="content">
            <p>Estimados de <strong>${reserva.escuela}</strong>,</p>

            <p>Hemos recibido su solicitud de reserva educativa y está siendo procesada.</p>

            <div class="details">
              <h3 style="margin-top: 0; color: #4CAF50;">📋 Detalles de su Reserva:</h3>
              <p><strong>Programa:</strong> ${reserva.programa}</p>
              <p><strong>Fecha:</strong> ${new Date(reserva.fecha).toLocaleDateString('es-CL')}</p>
              <p><strong>Cantidad de estudiantes:</strong> ${reserva.cantidad}</p>
              ${reserva.comentarios ? `<p><strong>Observaciones:</strong> ${reserva.comentarios}</p>` : ''}
            </div>

            <div class="total" style="background:#1e88e5;">
              💰 Total estimado a pagar: ${formatCLP(reserva.total)}
            </div>

            <p style="margin: 12px 0 0 0;">
              Para confirmar su visita, por favor contacte directamente con el dueño del acuario
              al <strong>+56 9 8634 4271</strong> o escriba a
              <a href="mailto:acuariopuyehue@gmail.com">acuariopuyehue@gmail.com</a>.
              La fecha y disponibilidad serán coordinadas por ese medio.
            </p>

            <p><strong>📞 Próximos pasos:</strong></p>
            <ul>
              <li>Confirmaremos disponibilidad y detalles finales</li>
              <li>Se informarán instrucciones de pago directamente con el dueño</li>
            </ul>

            <p><strong>📧 Información de contacto:</strong></p>
            <ul>
              <li>Teléfono: +56 9 8634 4271</li>
              <li>Email: acuariopuyehue@gmail.com</li>
              <li>Horario: Lunes a Viernes 09:00 - 18:00</li>
            </ul>

            <p style="margin-top: 20px; padding: 15px; background: #fff3cd; border-left: 4px solid #ffc107; border-radius: 4px;">
              <strong>⚠️ Importante:</strong> Las reservas deben realizarse con mínimo 15 días de anticipación. Los traslados y seguros son responsabilidad de la institución.
            </p>

            <p>¡Gracias por elegirnos para la educación de sus estudiantes! 🐠📚</p>
          </div>
          <div class="footer">
            Parque Acuario Puyehue - Educación y Conservación<br>
            Ruta Interlagos T 981 U, km 3 Chiscaihue, Río Bueno
          </div>
        </div>
      </body>
      </html>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email de confirmación enviado a la institución:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error al enviar email a la institución:', error);
    return { success: false, error: error.message };
  }
}

// Exportar todas las funciones
module.exports = {
  enviarEmailNuevoContactoAdmin,
  enviarEmailConfirmacionUsuario,
  enviarEmailNuevaReservaAdmin,
  enviarEmailConfirmacionReserva
};
