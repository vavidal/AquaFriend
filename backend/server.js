const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors({
  origin: 'http://localhost:4200', // URL de tu frontend Angular
  credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Importar rutas
const reservaRoutes = require('./routes/reservaRoutes');
const authRoutes = require('./routes/authRoutes');
const contactoRoutes = require('./routes/contactoRoutes');
const usuarioRoutes = require('./routes/usuarioRoutes');

// Ruta de prueba (debe ir ANTES de las rutas modulares)
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'API de AquaFriend funcionando correctamente',
    timestamp: new Date()
  });
});

// Usar rutas (DESPUÉS de rutas específicas, ANTES del handler 404)
app.use('/api/reservas', reservaRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/contactos', contactoRoutes);
app.use('/api/usuarios', usuarioRoutes);

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada'
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`\n🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📊 API disponible en http://localhost:${PORT}/api`);
  console.log(`🔗 Frontend esperado en http://localhost:4200\n`);
});
