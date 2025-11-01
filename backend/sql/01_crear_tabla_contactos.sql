-- ================================================================
-- TABLA DE CONTACTOS - AQUAFRIEND
-- ================================================================
-- Descripción: Almacena las consultas enviadas desde el formulario
--              de contacto del footer de la página web
-- Fecha creación: 2025-10-12
-- ================================================================

-- Eliminar tabla si existe (solo para desarrollo)
-- DROP TABLE IF EXISTS contactos;

-- Crear tabla de contactos
CREATE TABLE IF NOT EXISTS contactos (
  id_contacto INT AUTO_INCREMENT PRIMARY KEY COMMENT 'ID único del contacto',
  nombre VARCHAR(100) NOT NULL COMMENT 'Nombre completo del contacto',
  email VARCHAR(150) NOT NULL COMMENT 'Correo electrónico',
  telefono VARCHAR(20) COMMENT 'Número de teléfono (opcional)',
  mensaje TEXT COMMENT 'Mensaje enviado por el usuario',
  fecha_contacto TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha y hora del contacto',
  leido BOOLEAN DEFAULT FALSE COMMENT 'Indica si fue revisado por el admin',

  -- Índices para mejorar el rendimiento
  INDEX idx_fecha (fecha_contacto),
  INDEX idx_email (email),
  INDEX idx_leido (leido)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Almacena las consultas del formulario de contacto';

-- ================================================================
-- VERIFICACIÓN
-- ================================================================
-- Ejecuta esta consulta para verificar que la tabla se creó correctamente:
-- SELECT * FROM contactos LIMIT 10;
