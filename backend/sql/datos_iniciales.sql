-- Datos iniciales para AquaFriends
-- Ejecutar este script en phpMyAdmin después de crear las tablas

-- 1. Insertar estados de reserva
INSERT INTO `reservas_estado` (`id_estado`, `nombre`) VALUES
(1, 'Pendiente'),
(2, 'Confirmada'),
(3, 'Cancelada'),
(4, 'Completada');

-- 2. Insertar programas educativos (según tu HTML)
INSERT INTO `programas_educativos`
(`nombre_plan`, `monto_por_persona`, `iva_porcentaje`, `min_estudiantes`, `max_estudiantes`, `tiempo_programa`, `descripcion`, `visible`)
VALUES
('Visita básica', 5500.00, 19.00, 1, 35, '30-45 minutos', 'Recorrido por acuarios y granja con monitora. Juego didáctico e introducción al sistema de cuencas.', 1),
('Visita académica', 7500.00, 19.00, 15, 35, '60-90 minutos', 'Profundización biológica, química y/o ingeniería. Diálogo con el equipo (biólogos, veterinaria). Orientado a 6° básico a 4° medio.', 1),
('Taller aplicado', 9500.00, 19.00, 15, 35, '90-120 minutos', 'Habilidades blandas con trabajos prácticos. Aprendizaje basado en proyectos. Orientado a 6° básico a 4° medio.', 1);

-- 3. Insertar categorías de especies
INSERT INTO `categorias_especie` (`nombre`) VALUES
('Pez'),
('Anfibio'),
('Mamífero'),
('Ave'),
('Reptil'),
('Invertebrado');

-- 4. Insertar algunos hábitats
INSERT INTO `habitats` (`nombre`, `descripcion`) VALUES
('Agua dulce - Río', 'Hábitat de agua corriente con rocas y vegetación ribereña'),
('Agua dulce - Lago', 'Cuerpos de agua tranquilos con profundidad variable'),
('Granja educativa', 'Área terrestre para animales domésticos'),
('Estanque exterior', 'Cuerpo de agua artificial para pesca recreativa');

-- 5. Insertar roles de usuario
INSERT INTO `roles` (`nombre`) VALUES
('Administrador'),
('Editor'),
('Visitante');

-- 6. Crear usuario admin por defecto (contraseña: admin123)
-- Nota: En producción debes usar bcrypt para hashear la contraseña
INSERT INTO `usuarios` (`nombre`, `apellido`, `email`, `pass_hash`, `role_id`, `activo`) VALUES
('Admin', 'AquaFriend', 'admin@aquafriend.cl', '$2b$10$XYZ...', 1, 1);

-- Nota: El hash de arriba es solo un ejemplo, debes generar uno real con bcrypt
