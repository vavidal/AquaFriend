const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// ===============================
// Middlewares
// ===============================
app.use(cors({
  origin: 'http://localhost:4200', // URL del frontend Angular
  credentials: true
}));
// Nota: algunos parsers de rutas no aceptan '*' como path.
// Si necesitas preflight específico, habilita por prefijo:
// app.options('/api/*', cors());
// Aceptar payloads con imágenes base64 (hasta 5MB)
app.use(bodyParser.json({ limit: '5mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '5mb' }));

// ===============================
// Importar rutas
// ===============================
const reservaRoutes = require('./routes/reservaRoutes');
const authRoutes = require('./routes/authRoutes');
const contactoRoutes = require('./routes/contactoRoutes');
const usuarioRoutes = require('./routes/usuarioRoutes');
const pecesRoutes = require('./routes/pecesRoutes'); // ruta peces
const animalesRoutes = require('./routes/animalesRoutes');
const reptilesRoutes = require('./routes/reptilesRoutes');
const especiesRoutes = require('./routes/especiesRoutes');

// ===============================
//  Ruta de prueba (debe ir antes de las rutas modulares)
// ===============================
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'API de AquaFriend funcionando correctamente',
    timestamp: new Date()
  });
});

// ===============================
// Usar rutas (orden lógico)
// ===============================
app.use('/api/reservas', reservaRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/contactos', contactoRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/peces', pecesRoutes);
app.use('/api/animales', animalesRoutes);
app.use('/api/reptiles', reptilesRoutes);
app.use('/api/especies', especiesRoutes);

// ===============================
// Manejo de rutas no encontradas
// ===============================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada'
  });
});

// ===============================
// Iniciar servidor
// ===============================
app.listen(PORT, () => {
  console.log(`\n🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📊 API disponible en http://localhost:${PORT}/api`);
  console.log(`🔗 Frontend esperado en http://localhost:4200`);
  console.log(`🐠 Endpoint peces: http://localhost:${PORT}/api/peces\n`);
});

