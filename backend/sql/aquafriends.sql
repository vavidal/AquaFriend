-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 13-10-2025 a las 17:33:55
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `aquafriends`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `categorias_especie`
--

CREATE TABLE `categorias_especie` (
  `id_categoria` tinyint(4) NOT NULL,
  `nombre` varchar(60) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `categorias_especie`
--

INSERT INTO `categorias_especie` (`id_categoria`, `nombre`) VALUES
(2, 'Anfibio'),
(4, 'Ave'),
(6, 'Invertebrado'),
(3, 'Mamífero'),
(1, 'Pez'),
(5, 'Reptil');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `contactos`
--

CREATE TABLE `contactos` (
  `id_contacto` int(11) NOT NULL COMMENT 'ID único del contacto',
  `nombre` varchar(100) NOT NULL COMMENT 'Nombre completo del contacto',
  `email` varchar(150) NOT NULL COMMENT 'Correo electrónico',
  `telefono` varchar(20) DEFAULT NULL COMMENT 'Número de teléfono (opcional)',
  `mensaje` text DEFAULT NULL COMMENT 'Mensaje enviado por el usuario',
  `fecha_contacto` timestamp NOT NULL DEFAULT current_timestamp() COMMENT 'Fecha y hora del contacto',
  `leido` tinyint(1) DEFAULT 0 COMMENT 'Indica si fue revisado por el admin'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Almacena las consultas del formulario de contacto';

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `escenas_360`
--

CREATE TABLE `escenas_360` (
  `id_escena` int(11) NOT NULL,
  `titulo` varchar(160) NOT NULL,
  `descripcion` varchar(600) DEFAULT NULL,
  `panorama_media` int(11) DEFAULT NULL,
  `thumbnail_media` int(11) DEFAULT NULL,
  `orden` int(11) DEFAULT 0,
  `publicado` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() COMMENT 'ON UPDATE CURRENT_TIMESTAMP'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `escuelas`
--

CREATE TABLE `escuelas` (
  `id_escuela` int(11) NOT NULL,
  `nombre` varchar(200) NOT NULL,
  `tipo` varchar(80) DEFAULT NULL,
  `comuna` varchar(120) DEFAULT NULL,
  `region` varchar(120) DEFAULT NULL,
  `email` varchar(180) DEFAULT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `escuelas`
--

INSERT INTO `escuelas` (`id_escuela`, `nombre`, `tipo`, `comuna`, `region`, `email`, `telefono`, `created_at`) VALUES
(1, 'COLEGIO TÉCNICO NACIONES UNIDAS', NULL, NULL, NULL, 'nacionesunidas@gmail.com', NULL, '2025-10-12 00:17:02'),
(2, 'Colegio San José', 'Particular subvencionado', 'Río Bueno', 'Los Ríos', 'contacto@sanjose.cl', '+56912345678', '2025-10-13 15:28:47'),

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `especies`
--

CREATE TABLE `especies` (
  `id_especie` int(11) NOT NULL,
  `nombre_comun` varchar(150) NOT NULL,
  `nombre_cientifico` varchar(180) DEFAULT NULL,
  `id_categoria` tinyint(4) NOT NULL,
  `id_habitat` int(11) DEFAULT NULL,
  `alimentacion` varchar(200) DEFAULT NULL,
  `tamano_promedio` varchar(50) DEFAULT NULL,
  `estado_conservacion` varchar(80) DEFAULT NULL,
  `descripcion` varchar(800) DEFAULT NULL,
  `imagen_principal` varchar(300) DEFAULT NULL,
  `fecha_registro` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `estudiantes`
--

CREATE TABLE `estudiantes` (
  `id_estudiante` int(11) NOT NULL,
  `rut` varchar(15) DEFAULT NULL,
  `nombre` varchar(150) NOT NULL,
  `apellido` varchar(150) NOT NULL,
  `curso` varchar(100) DEFAULT NULL,
  `escuela_id` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `fichas`
--

CREATE TABLE `fichas` (
  `id_ficha` int(11) NOT NULL,
  `id_especie` int(11) NOT NULL,
  `nivel` varchar(40) NOT NULL,
  `titulo` varchar(200) NOT NULL,
  `resumen` varchar(800) DEFAULT NULL,
  `contenido_html` mediumtext DEFAULT NULL,
  `creado_por` int(11) DEFAULT NULL,
  `publicado` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() COMMENT 'ON UPDATE CURRENT_TIMESTAMP'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ficha_media`
--

CREATE TABLE `ficha_media` (
  `id_ficha` int(11) NOT NULL,
  `id_media` int(11) NOT NULL,
  `tipo_uso` varchar(40) DEFAULT NULL,
  `orden` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `habitats`
--

CREATE TABLE `habitats` (
  `id_habitat` int(11) NOT NULL,
  `nombre` varchar(120) NOT NULL,
  `descripcion` varchar(500) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `habitats`
--

INSERT INTO `habitats` (`id_habitat`, `nombre`, `descripcion`) VALUES
(1, 'Agua dulce - Río', 'Hábitat de agua corriente con rocas y vegetación ribereña'),
(2, 'Agua dulce - Lago', 'Cuerpos de agua tranquilos con profundidad variable'),
(3, 'Granja educativa', 'Área terrestre para animales domésticos'),
(4, 'Estanque exterior', 'Cuerpo de agua artificial para pesca recreativa');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `media`
--

CREATE TABLE `media` (
  `id_media` int(11) NOT NULL,
  `tipo` varchar(30) NOT NULL,
  `url` varchar(500) NOT NULL,
  `alt_text` varchar(200) DEFAULT NULL,
  `creditos` varchar(200) DEFAULT NULL,
  `licencia` varchar(120) DEFAULT NULL,
  `ancho_px` int(11) DEFAULT NULL,
  `alto_px` int(11) DEFAULT NULL,
  `duracion_s` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pagos`
--

CREATE TABLE `pagos` (
  `id_pago` int(11) NOT NULL,
  `id_reserva` int(11) NOT NULL,
  `metodo` varchar(30) NOT NULL,
  `monto` decimal(12,2) NOT NULL,
  `fecha_pago` datetime NOT NULL DEFAULT current_timestamp(),
  `estado` varchar(20) NOT NULL,
  `comprobante_url` varchar(300) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `peces`
--

CREATE TABLE `peces` (
  `id` int(11) DEFAULT NULL,
  `especie` varchar(150) DEFAULT NULL,
  `habitat` varchar(120) DEFAULT NULL,
  `alimentacion` varchar(200) DEFAULT NULL,
  `tamano_promedio` varchar(50) DEFAULT NULL,
  `descripcion` varchar(800) DEFAULT NULL,
  `imagen_referencial` varchar(300) DEFAULT NULL,
  `fecha_registro` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='VIEW: especies + habitats, filtrada por categorias_especie.nombre = ''pez''';

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `profesor`
--

CREATE TABLE `profesor` (
  `id_profesor` int(11) NOT NULL,
  `rut` varchar(15) NOT NULL,
  `nombre` varchar(150) NOT NULL,
  `apellido` varchar(150) NOT NULL,
  `asignatura` varchar(120) DEFAULT NULL,
  `escuela_id` int(11) DEFAULT NULL,
  `email` varchar(180) DEFAULT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `programas_educativos`
--

CREATE TABLE `programas_educativos` (
  `id_plan` int(11) NOT NULL,
  `nombre_plan` varchar(180) NOT NULL,
  `monto_por_persona` decimal(10,2) NOT NULL,
  `iva_porcentaje` decimal(5,2) NOT NULL DEFAULT 19.00,
  `min_estudiantes` int(11) DEFAULT 1,
  `max_estudiantes` int(11) DEFAULT 200,
  `tiempo_programa` varchar(100) NOT NULL,
  `descripcion` varchar(600) DEFAULT NULL,
  `visible` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() COMMENT 'ON UPDATE CURRENT_TIMESTAMP'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `programas_educativos`
--

INSERT INTO `programas_educativos` (`id_plan`, `nombre_plan`, `monto_por_persona`, `iva_porcentaje`, `min_estudiantes`, `max_estudiantes`, `tiempo_programa`, `descripcion`, `visible`, `created_at`, `updated_at`) VALUES
(1, 'Visita básica', 5500.00, 19.00, 1, 35, '30-45 minutos', 'Recorrido por acuarios y granja con monitora', 1, '2025-10-12 00:24:07', '2025-10-12 00:24:07'),
(2, 'Visita académica', 7500.00, 19.00, 15, 35, '60-90 minutos', 'Profundización biológica y química', 1, '2025-10-12 00:24:07', '2025-10-12 00:24:07'),
(3, 'Taller aplicado', 9500.00, 19.00, 15, 35, '90-120 minutos', 'Habilidades blandas con trabajos prácticos', 1, '2025-10-12 00:24:07', '2025-10-12 00:24:07');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `reserva`
--

CREATE TABLE `reserva` (
  `id_reserva` int(11) NOT NULL,
  `id_plan` int(11) NOT NULL,
  `escuela_id` int(11) DEFAULT NULL,
  `profesor_id` int(11) DEFAULT NULL,
  `fecha_reserva` date NOT NULL,
  `hora_entrada` time NOT NULL,
  `hora_termino` time NOT NULL,
  `cantidad_estudiantes` int(11) NOT NULL,
  `cantidad_docentes` int(11) NOT NULL,
  `total_bruto` decimal(12,2) NOT NULL,
  `total_iva` decimal(12,2) NOT NULL,
  `total_pagar` decimal(12,2) NOT NULL,
  `estado_id` tinyint(4) NOT NULL,
  `observaciones` varchar(500) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() COMMENT 'ON UPDATE CURRENT_TIMESTAMP'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `reserva`
--

INSERT INTO `reserva` (`id_reserva`, `id_plan`, `escuela_id`, `profesor_id`, `fecha_reserva`, `hora_entrada`, `hora_termino`, `cantidad_estudiantes`, `cantidad_docentes`, `total_bruto`, `total_iva`, `total_pagar`, `estado_id`, `observaciones`, `created_at`, `updated_at`) VALUES
(1, 2, 1, NULL, '2025-10-13', '09:00:00', '17:00:00', 30, 0, 225000.00, 42750.00, 267750.00, 1, 'Hola queremos visitar el acuario!', '2025-10-12 00:24:32', '2025-10-12 00:24:32'),
(2, 1, 1, NULL, '2025-11-20', '09:00:00', '12:00:00', 30, 2, 165000.00, 31350.00, 196350.00, 1, 'Grupo de 5° básico - Primera visita', '2025-10-13 15:28:47', '2025-10-13 15:28:47'),
(3, 1, 1, NULL, '2025-11-20', '09:00:00', '12:00:00', 30, 2, 165000.00, 31350.00, 196350.00, 1, 'Grupo de 5° básico - Primera visita', '2025-10-13 15:29:33', '2025-10-13 15:29:33'),
(4, 1, 1, NULL, '2025-11-20', '09:00:00', '12:00:00', 30, 2, 165000.00, 31350.00, 196350.00, 1, 'Grupo de 5° básico - Primera visita', '2025-10-13 15:30:11', '2025-10-13 15:30:11');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `reservas_estado`
--

CREATE TABLE `reservas_estado` (
  `id_estado` tinyint(4) NOT NULL,
  `nombre` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `reservas_estado`
--

INSERT INTO `reservas_estado` (`id_estado`, `nombre`) VALUES
(3, 'Cancelada'),
(4, 'Completada'),
(2, 'Confirmada'),
(1, 'Pendiente');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `reserva_estudiante`
--

CREATE TABLE `reserva_estudiante` (
  `id_reserva_est` int(11) NOT NULL,
  `id_reserva` int(11) NOT NULL,
  `id_estudiante` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `roles`
--

CREATE TABLE `roles` (
  `id_role` tinyint(4) NOT NULL,
  `nombre` varchar(40) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `roles`
--

INSERT INTO `roles` (`id_role`, `nombre`) VALUES
(1, 'Administrador'),
(2, 'Editor'),
(3, 'Visitante');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id_usuario` int(11) NOT NULL,
  `nombre` varchar(150) NOT NULL,
  `apellido` varchar(150) NOT NULL,
  `email` varchar(180) NOT NULL,
  `pass_hash` varchar(255) NOT NULL,
  `role_id` tinyint(4) NOT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() COMMENT 'ON UPDATE CURRENT_TIMESTAMP'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id_usuario`, `nombre`, `apellido`, `email`, `pass_hash`, `role_id`, `activo`, `created_at`, `updated_at`) VALUES
(1, 'Admin', 'AquaFriend', 'admin', 'administrator@2025', 1, 1, '2025-10-12 00:41:36', '2025-10-12 00:41:36');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `categorias_especie`
--
ALTER TABLE `categorias_especie`
  ADD PRIMARY KEY (`id_categoria`),
  ADD UNIQUE KEY `nombre` (`nombre`);

--
-- Indices de la tabla `contactos`
--
ALTER TABLE `contactos`
  ADD PRIMARY KEY (`id_contacto`),
  ADD KEY `idx_fecha` (`fecha_contacto`),
  ADD KEY `idx_email` (`email`),
  ADD KEY `idx_leido` (`leido`);

--
-- Indices de la tabla `escenas_360`
--
ALTER TABLE `escenas_360`
  ADD PRIMARY KEY (`id_escena`),
  ADD KEY `panorama_media` (`panorama_media`),
  ADD KEY `thumbnail_media` (`thumbnail_media`);

--
-- Indices de la tabla `escuelas`
--
ALTER TABLE `escuelas`
  ADD PRIMARY KEY (`id_escuela`);

--
-- Indices de la tabla `especies`
--
ALTER TABLE `especies`
  ADD PRIMARY KEY (`id_especie`),
  ADD KEY `idx_especie_categoria` (`id_categoria`),
  ADD KEY `idx_especie_habitat` (`id_habitat`);

--
-- Indices de la tabla `estudiantes`
--
ALTER TABLE `estudiantes`
  ADD PRIMARY KEY (`id_estudiante`),
  ADD KEY `idx_estudiante_escuela` (`escuela_id`);

--
-- Indices de la tabla `fichas`
--
ALTER TABLE `fichas`
  ADD PRIMARY KEY (`id_ficha`),
  ADD KEY `idx_ficha_especie` (`id_especie`),
  ADD KEY `creado_por` (`creado_por`);

--
-- Indices de la tabla `ficha_media`
--
ALTER TABLE `ficha_media`
  ADD PRIMARY KEY (`id_ficha`,`id_media`),
  ADD KEY `id_media` (`id_media`);

--
-- Indices de la tabla `habitats`
--
ALTER TABLE `habitats`
  ADD PRIMARY KEY (`id_habitat`),
  ADD UNIQUE KEY `nombre` (`nombre`);

--
-- Indices de la tabla `media`
--
ALTER TABLE `media`
  ADD PRIMARY KEY (`id_media`);

--
-- Indices de la tabla `pagos`
--
ALTER TABLE `pagos`
  ADD PRIMARY KEY (`id_pago`),
  ADD KEY `id_reserva` (`id_reserva`);

--
-- Indices de la tabla `profesor`
--
ALTER TABLE `profesor`
  ADD PRIMARY KEY (`id_profesor`),
  ADD UNIQUE KEY `rut` (`rut`),
  ADD KEY `idx_profesor_escuela` (`escuela_id`);

--
-- Indices de la tabla `programas_educativos`
--
ALTER TABLE `programas_educativos`
  ADD PRIMARY KEY (`id_plan`);

--
-- Indices de la tabla `reserva`
--
ALTER TABLE `reserva`
  ADD PRIMARY KEY (`id_reserva`),
  ADD KEY `idx_reserva_plan` (`id_plan`),
  ADD KEY `idx_reserva_fecha` (`fecha_reserva`),
  ADD KEY `idx_reserva_estado` (`estado_id`),
  ADD KEY `escuela_id` (`escuela_id`),
  ADD KEY `profesor_id` (`profesor_id`);

--
-- Indices de la tabla `reservas_estado`
--
ALTER TABLE `reservas_estado`
  ADD PRIMARY KEY (`id_estado`),
  ADD UNIQUE KEY `nombre` (`nombre`);

--
-- Indices de la tabla `reserva_estudiante`
--
ALTER TABLE `reserva_estudiante`
  ADD PRIMARY KEY (`id_reserva_est`),
  ADD UNIQUE KEY `uq_reserva_estudiante` (`id_reserva`,`id_estudiante`),
  ADD KEY `id_estudiante` (`id_estudiante`);

--
-- Indices de la tabla `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id_role`),
  ADD UNIQUE KEY `nombre` (`nombre`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id_usuario`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `role_id` (`role_id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `categorias_especie`
--
ALTER TABLE `categorias_especie`
  MODIFY `id_categoria` tinyint(4) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT de la tabla `contactos`
--
ALTER TABLE `contactos`
  MODIFY `id_contacto` int(11) NOT NULL AUTO_INCREMENT COMMENT 'ID único del contacto';

--
-- AUTO_INCREMENT de la tabla `escenas_360`
--
ALTER TABLE `escenas_360`
  MODIFY `id_escena` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `escuelas`
--
ALTER TABLE `escuelas`
  MODIFY `id_escuela` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `especies`
--
ALTER TABLE `especies`
  MODIFY `id_especie` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `estudiantes`
--
ALTER TABLE `estudiantes`
  MODIFY `id_estudiante` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `fichas`
--
ALTER TABLE `fichas`
  MODIFY `id_ficha` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `habitats`
--
ALTER TABLE `habitats`
  MODIFY `id_habitat` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT de la tabla `media`
--
ALTER TABLE `media`
  MODIFY `id_media` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `pagos`
--
ALTER TABLE `pagos`
  MODIFY `id_pago` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `profesor`
--
ALTER TABLE `profesor`
  MODIFY `id_profesor` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `programas_educativos`
--
ALTER TABLE `programas_educativos`
  MODIFY `id_plan` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT de la tabla `reserva`
--
ALTER TABLE `reserva`
  MODIFY `id_reserva` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `reserva_estudiante`
--
ALTER TABLE `reserva_estudiante`
  MODIFY `id_reserva_est` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `roles`
--
ALTER TABLE `roles`
  MODIFY `id_role` tinyint(4) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id_usuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `escenas_360`
--
ALTER TABLE `escenas_360`
  ADD CONSTRAINT `escenas_360_ibfk_1` FOREIGN KEY (`panorama_media`) REFERENCES `media` (`id_media`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `escenas_360_ibfk_2` FOREIGN KEY (`thumbnail_media`) REFERENCES `media` (`id_media`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Filtros para la tabla `especies`
--
ALTER TABLE `especies`
  ADD CONSTRAINT `especies_ibfk_1` FOREIGN KEY (`id_categoria`) REFERENCES `categorias_especie` (`id_categoria`) ON UPDATE CASCADE,
  ADD CONSTRAINT `especies_ibfk_2` FOREIGN KEY (`id_habitat`) REFERENCES `habitats` (`id_habitat`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Filtros para la tabla `estudiantes`
--
ALTER TABLE `estudiantes`
  ADD CONSTRAINT `estudiantes_ibfk_1` FOREIGN KEY (`escuela_id`) REFERENCES `escuelas` (`id_escuela`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Filtros para la tabla `fichas`
--
ALTER TABLE `fichas`
  ADD CONSTRAINT `fichas_ibfk_1` FOREIGN KEY (`id_especie`) REFERENCES `especies` (`id_especie`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fichas_ibfk_2` FOREIGN KEY (`creado_por`) REFERENCES `usuarios` (`id_usuario`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Filtros para la tabla `ficha_media`
--
ALTER TABLE `ficha_media`
  ADD CONSTRAINT `ficha_media_ibfk_1` FOREIGN KEY (`id_ficha`) REFERENCES `fichas` (`id_ficha`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `ficha_media_ibfk_2` FOREIGN KEY (`id_media`) REFERENCES `media` (`id_media`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `pagos`
--
ALTER TABLE `pagos`
  ADD CONSTRAINT `pagos_ibfk_1` FOREIGN KEY (`id_reserva`) REFERENCES `reserva` (`id_reserva`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `profesor`
--
ALTER TABLE `profesor`
  ADD CONSTRAINT `profesor_ibfk_1` FOREIGN KEY (`escuela_id`) REFERENCES `escuelas` (`id_escuela`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Filtros para la tabla `reserva`
--
ALTER TABLE `reserva`
  ADD CONSTRAINT `reserva_ibfk_1` FOREIGN KEY (`id_plan`) REFERENCES `programas_educativos` (`id_plan`) ON UPDATE CASCADE,
  ADD CONSTRAINT `reserva_ibfk_2` FOREIGN KEY (`escuela_id`) REFERENCES `escuelas` (`id_escuela`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `reserva_ibfk_3` FOREIGN KEY (`profesor_id`) REFERENCES `profesor` (`id_profesor`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `reserva_ibfk_4` FOREIGN KEY (`estado_id`) REFERENCES `reservas_estado` (`id_estado`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `reserva_estudiante`
--
ALTER TABLE `reserva_estudiante`
  ADD CONSTRAINT `reserva_estudiante_ibfk_1` FOREIGN KEY (`id_reserva`) REFERENCES `reserva` (`id_reserva`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `reserva_estudiante_ibfk_2` FOREIGN KEY (`id_estudiante`) REFERENCES `estudiantes` (`id_estudiante`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD CONSTRAINT `usuarios_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id_role`) ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
