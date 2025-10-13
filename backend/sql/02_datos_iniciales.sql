-- ================================================================
-- SCRIPT DE DATOS INICIALES PARA AQUAFRIENDS
-- Ejecutar este script en phpMyAdmin ANTES de iniciar el backend
-- RECORDAR QUE EN ÉSTA PARTE ES SOLO PARA INSERTAR DATOS 
-- SI O SI DEBE HACERLO CON LOS QUE SON OBLIGATORIOS
-- DE TODAS FORMAS EL SCRIPT aquafriends.sql contiene toda la información
-- ================================================================

-- Para INICIAR LOS SERVIDORES DEL BACKEND DEBEN HACER EL SIGUIENTE COMANDO EN LA TERMINAL
-- cd backend && node server.js



-- ================================================================
-- 1. Estados de reserva (OBLIGATORIO)
INSERT INTO `reservas_estado` (`id_estado`, `nombre`) VALUES
(1, 'Pendiente'),
(2, 'Confirmada'),
(3, 'Cancelada'),
(4, 'Completada')
ON DUPLICATE KEY UPDATE nombre=VALUES(nombre);

-- 2. Programas educativos (según tu página web)
INSERT INTO `programas_educativos`
(`nombre_plan`, `monto_por_persona`, `iva_porcentaje`, `min_estudiantes`, `max_estudiantes`, `tiempo_programa`, `descripcion`, `visible`)
VALUES
('Visita básica', 5500.00, 19.00, 1, 35, '30-45 minutos', 'Recorrido por acuarios y granja con monitora. Juego didáctico e introducción al sistema de cuencas.', 1),
('Visita académica', 7500.00, 19.00, 15, 35, '60-90 minutos', 'Profundización biológica, química y/o ingeniería. Diálogo con el equipo (biólogos, veterinaria). Orientado a 6° básico a 4° medio.', 1),
('Taller aplicado', 9500.00, 19.00, 15, 35, '90-120 minutos', 'Habilidades blandas con trabajos prácticos. Aprendizaje basado en proyectos. Orientado a 6° básico a 4° medio.', 1)
ON DUPLICATE KEY UPDATE
    monto_por_persona=VALUES(monto_por_persona),
    descripcion=VALUES(descripcion);

-- 3. Categorías de especies
INSERT INTO `categorias_especie` (`nombre`) VALUES
('Pez'),
('Anfibio'),
('Mamífero'),
('Ave'),
('Reptil'),
('Invertebrado')
ON DUPLICATE KEY UPDATE nombre=VALUES(nombre);

-- 4. Hábitats
INSERT INTO `habitats` (`nombre`, `descripcion`) VALUES
('Agua dulce - Río', 'Hábitat de agua corriente con rocas y vegetación ribereña'),
('Agua dulce - Lago', 'Cuerpos de agua tranquilos con profundidad variable'),
('Granja educativa', 'Área terrestre para animales domésticos'),
('Estanque exterior', 'Cuerpo de agua artificial para pesca recreativa')
ON DUPLICATE KEY UPDATE descripcion=VALUES(descripcion);

-- 5. Roles de usuario
INSERT INTO `roles` (`nombre`) VALUES
('Administrador'),
('Editor'),
('Visitante')
ON DUPLICATE KEY UPDATE nombre=VALUES(nombre);

-- ================================================================
-- DATOS DE PRUEBA (OPCIONAL - Puedes comentar si no los necesitas)
-- ================================================================

-- Escuela de prueba
INSERT INTO `escuelas` (`nombre`, `tipo`, `comuna`, `region`, `email`, `telefono`) VALUES
('Colegio San José', 'Particular subvencionado', 'Río Bueno', 'Los Ríos', 'contacto@sanjose.cl', '+56912345678');

-- Reserva de prueba
INSERT INTO `reserva`
(`id_plan`, `escuela_id`, `fecha_reserva`, `hora_entrada`, `hora_termino`,
 `cantidad_estudiantes`, `cantidad_docentes`, `total_bruto`, `total_iva`,
 `total_pagar`, `estado_id`, `observaciones`)
VALUES
(1, 1, '2025-11-20', '09:00:00', '12:00:00',
 30, 2, 165000.00, 31350.00, 196350.00, 1, 'Grupo de 5° básico - Primera visita');

 -- 1. ESTADOS DE RESERVA (OBLIGATORIO)
DELETE FROM reservas_estado;
INSERT INTO reservas_estado (id_estado, nombre) VALUES
(1, 'Pendiente'),
(2, 'Confirmada'),
(3, 'Cancelada'),
(4, 'Completada');

-- 2. PROGRAMAS EDUCATIVOS (OBLIGATORIO)
DELETE FROM programas_educativos;
INSERT INTO programas_educativos
(nombre_plan, monto_por_persona, iva_porcentaje, min_estudiantes, max_estudiantes, tiempo_programa, descripcion, visible)
VALUES
('Visita básica', 5500.00, 19.00, 1, 35, '30-45 minutos', 'Recorrido por acuarios y granja con monitora', 1),
('Visita académica', 7500.00, 19.00, 15, 35, '60-90 minutos', 'Profundización biológica y química', 1),
('Taller aplicado', 9500.00, 19.00, 15, 35, '90-120 minutos', 'Habilidades blandas con trabajos prácticos', 1);
