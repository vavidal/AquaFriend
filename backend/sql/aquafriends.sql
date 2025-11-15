SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";
CREATE DATABASE IF NOT EXISTS `aquafriends` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `aquafriends`;

CREATE TABLE `categorias_especie` (
  `id_categoria` TINYINT(4) NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(60) NOT NULL,
  PRIMARY KEY (`id_categoria`),
  UNIQUE KEY `nombre` (`nombre`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `contactos` (
  `id_contacto` INT(11) NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(100) NOT NULL,
  `email` VARCHAR(150) NOT NULL,
  `telefono` VARCHAR(20) DEFAULT NULL,
  `mensaje` TEXT DEFAULT NULL,
  `fecha_contacto` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `leido` TINYINT(1) DEFAULT 0,
  PRIMARY KEY (`id_contacto`),
  KEY `idx_fecha` (`fecha_contacto`),
  KEY `idx_email` (`email`),
  KEY `idx_leido` (`leido`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `media` (
  `id_media` INT(11) NOT NULL AUTO_INCREMENT,
  `tipo` VARCHAR(30) NOT NULL,
  `url` VARCHAR(500) NOT NULL,
  `alt_text` VARCHAR(200) DEFAULT NULL,
  `creditos` VARCHAR(200) DEFAULT NULL,
  `licencia` VARCHAR(120) DEFAULT NULL,
  `ancho_px` INT(11) DEFAULT NULL,
  `alto_px` INT(11) DEFAULT NULL,
  `duracion_s` INT(11) DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_media`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `escenas_360` (
  `id_escena` INT(11) NOT NULL AUTO_INCREMENT,
  `titulo` VARCHAR(160) NOT NULL,
  `descripcion` VARCHAR(600) DEFAULT NULL,
  `panorama_media` INT(11) DEFAULT NULL,
  `thumbnail_media` INT(11) DEFAULT NULL,
  `orden` INT(11) DEFAULT 0,
  `publicado` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_escena`),
  KEY `panorama_media` (`panorama_media`),
  KEY `thumbnail_media` (`thumbnail_media`),
  CONSTRAINT `escenas_360_ibfk_1` FOREIGN KEY (`panorama_media`) REFERENCES `media` (`id_media`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `escenas_360_ibfk_2` FOREIGN KEY (`thumbnail_media`) REFERENCES `media` (`id_media`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `escuelas` (
  `id_escuela` INT(11) NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(200) NOT NULL,
  `tipo` VARCHAR(80) DEFAULT NULL,
  `comuna` VARCHAR(120) DEFAULT NULL,
  `region` VARCHAR(120) DEFAULT NULL,
  `email` VARCHAR(180) DEFAULT NULL,
  `telefono` VARCHAR(20) DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_escuela`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `habitats` (
  `id_habitat` INT(11) NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(120) NOT NULL,
  `descripcion` VARCHAR(500) DEFAULT NULL,
  PRIMARY KEY (`id_habitat`),
  UNIQUE KEY `nombre` (`nombre`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `roles` (
  `id_role` TINYINT(4) NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(40) NOT NULL,
  PRIMARY KEY (`id_role`),
  UNIQUE KEY `nombre` (`nombre`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `usuarios` (
  `id_usuario` INT(11) NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(150) NOT NULL,
  `apellido` VARCHAR(150) NOT NULL,
  `email` VARCHAR(180) NOT NULL,
  `pass_hash` VARCHAR(255) NOT NULL,
  `role_id` TINYINT(4) NOT NULL,
  `activo` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_usuario`),
  UNIQUE KEY `email` (`email`),
  KEY `role_id` (`role_id`),
  CONSTRAINT `usuarios_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id_role`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `fichas` (
  `id_ficha` INT(11) NOT NULL AUTO_INCREMENT,
  `nivel` VARCHAR(40) NOT NULL,
  `titulo` VARCHAR(200) NOT NULL,
  `resumen` VARCHAR(800) DEFAULT NULL,
  `contenido_html` MEDIUMTEXT DEFAULT NULL,
  `creado_por` INT(11) DEFAULT NULL,
  `publicado` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_ficha`),
  KEY `creado_por` (`creado_por`),
  CONSTRAINT `fichas_ibfk_2` FOREIGN KEY (`creado_por`) REFERENCES `usuarios` (`id_usuario`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `ficha_media` (
  `id_ficha` INT(11) NOT NULL,
  `id_media` INT(11) NOT NULL,
  `tipo_uso` VARCHAR(40) DEFAULT NULL,
  `orden` INT(11) DEFAULT 0,
  PRIMARY KEY (`id_ficha`,`id_media`),
  KEY `id_media` (`id_media`),
  CONSTRAINT `ficha_media_ibfk_1` FOREIGN KEY (`id_ficha`) REFERENCES `fichas` (`id_ficha`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `ficha_media_ibfk_2` FOREIGN KEY (`id_media`) REFERENCES `media` (`id_media`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `programas_educativos` (
  `id_plan` INT(11) NOT NULL AUTO_INCREMENT,
  `nombre_plan` VARCHAR(180) NOT NULL,
  `monto_por_persona` DECIMAL(10,2) NOT NULL,
  `iva_porcentaje` DECIMAL(5,2) NOT NULL DEFAULT 19.00,
  `min_estudiantes` INT(11) DEFAULT 1,
  `max_estudiantes` INT(11) DEFAULT 200,
  `tiempo_programa` VARCHAR(100) NOT NULL,
  `descripcion` VARCHAR(600) DEFAULT NULL,
  `visible` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_plan`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `reservas_estado` (
  `id_estado` TINYINT(4) NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(20) NOT NULL,
  PRIMARY KEY (`id_estado`),
  UNIQUE KEY `nombre` (`nombre`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `reserva` (
  `id_reserva` INT(11) NOT NULL AUTO_INCREMENT,
  `id_plan` INT(11) NOT NULL,
  `escuela_id` INT(11) DEFAULT NULL,
  `fecha_reserva` DATE NOT NULL,
  `hora_entrada` TIME NOT NULL,
  `hora_termino` TIME NOT NULL,
  `cantidad_estudiantes` INT(11) NOT NULL,
  `cantidad_docentes` INT(11) NOT NULL,
  `total_bruto` DECIMAL(12,2) NOT NULL,
  `total_iva` DECIMAL(12,2) NOT NULL,
  `total_pagar` DECIMAL(12,2) NOT NULL,
  `estado_id` TINYINT(4) NOT NULL,
  `observaciones` VARCHAR(500) DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_reserva`),
  KEY `idx_reserva_plan` (`id_plan`),
  KEY `idx_reserva_fecha` (`fecha_reserva`),
  KEY `idx_reserva_estado` (`estado_id`),
  KEY `escuela_id` (`escuela_id`),
  CONSTRAINT `reserva_ibfk_1` FOREIGN KEY (`id_plan`) REFERENCES `programas_educativos` (`id_plan`) ON UPDATE CASCADE,
  CONSTRAINT `reserva_ibfk_2` FOREIGN KEY (`escuela_id`) REFERENCES `escuelas` (`id_escuela`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `reserva_ibfk_4` FOREIGN KEY (`estado_id`) REFERENCES `reservas_estado` (`id_estado`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `pagos` (
  `id_pago` INT(11) NOT NULL AUTO_INCREMENT,
  `id_reserva` INT(11) NOT NULL,
  `metodo` VARCHAR(30) NOT NULL,
  `monto` DECIMAL(12,2) NOT NULL,
  `fecha_pago` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `estado` VARCHAR(20) NOT NULL,
  `comprobante_url` VARCHAR(300) DEFAULT NULL,
  PRIMARY KEY (`id_pago`),
  KEY `id_reserva` (`id_reserva`),
  CONSTRAINT `pagos_ibfk_1` FOREIGN KEY (`id_reserva`) REFERENCES `reserva` (`id_reserva`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `peces` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `especie` VARCHAR(150) DEFAULT NULL,
  `habitat` VARCHAR(120) DEFAULT NULL,
  `alimentacion` VARCHAR(200) DEFAULT NULL,
  `tamano_promedio` VARCHAR(50) DEFAULT NULL,
  `descripcion` VARCHAR(800) DEFAULT NULL,
  `imagen_referencial` MEDIUMTEXT DEFAULT NULL,
  `fecha_registro` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `animales` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `especie` VARCHAR(150) DEFAULT NULL,
  `habitat` VARCHAR(120) DEFAULT NULL,
  `alimentacion` VARCHAR(200) DEFAULT NULL,
  `tamano_promedio` VARCHAR(50) DEFAULT NULL,
  `descripcion` VARCHAR(800) DEFAULT NULL,
  `imagen_referencial` VARCHAR(300) DEFAULT NULL,
  `fecha_registro` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `reptiles` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `especie` VARCHAR(150) DEFAULT NULL,
  `habitat` VARCHAR(120) DEFAULT NULL,
  `alimentacion` VARCHAR(200) DEFAULT NULL,
  `tamano_promedio` VARCHAR(50) DEFAULT NULL,
  `descripcion` VARCHAR(800) DEFAULT NULL,
  `imagen_referencial` VARCHAR(300) DEFAULT NULL,
  `fecha_registro` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `categorias_especie` (`id_categoria`, `nombre`) VALUES
(2,'Anfibio'),(4,'Ave'),(6,'Invertebrado'),(3,'Mamífero'),(1,'Pez'),(5,'Reptil');

INSERT INTO `contactos` (`id_contacto`,`nombre`,`email`,`telefono`,`mensaje`,`fecha_contacto`,`leido`) VALUES
(1,'yasmin','ya.santana@duocuc.cl','+56945179119','HOLA','2025-10-13 23:19:27',0);

INSERT INTO `escuelas` (`id_escuela`,`nombre`,`tipo`,`comuna`,`region`,`email`,`telefono`,`created_at`) VALUES
(6,'INSTITUTO PROFESIONAL Duoc UC',NULL,NULL,NULL,'ya.santana@duocuc.cl',NULL,'2025-10-13 23:10:14');

INSERT INTO `habitats` (`id_habitat`,`nombre`,`descripcion`) VALUES
(1,'Agua dulce - Río','Hábitat de agua corriente con rocas y vegetación ribereña'),
(2,'Agua dulce - Lago','Cuerpos de agua tranquilos con profundidad variable'),
(3,'Granja educativa','Área terrestre para animales domésticos'),
(4,'Estanque exterior','Cuerpo de agua artificial para pesca recreativa');

INSERT INTO `programas_educativos` (`id_plan`,`nombre_plan`,`monto_por_persona`,`iva_porcentaje`,`min_estudiantes`,`max_estudiantes`,`tiempo_programa`,`descripcion`,`visible`,`created_at`,`updated_at`) VALUES
(1,'Visita básica',6500.00,19.00,1,35,'30-45 minutos','Recorrido por acuarios y granja con monitora',1,'2025-10-12 00:24:07','2025-10-12 00:24:07'),
(2,'Visita académica',9000.00,19.00,15,35,'60-90 minutos','Profundización biológica y química',1,'2025-10-12 00:24:07','2025-10-12 00:24:07'),
(3,'Taller aplicado',14000.00,19.00,15,35,'90-120 minutos','Habilidades blandas con trabajos prácticos',1,'2025-10-12 00:24:07','2025-10-12 00:24:07');

INSERT INTO `reservas_estado` (`id_estado`,`nombre`) VALUES
(3,'Cancelada'),(4,'Completada'),(2,'Confirmada'),(1,'Pendiente');

INSERT INTO `reserva` (`id_reserva`,`id_plan`,`escuela_id`,`fecha_reserva`,`hora_entrada`,`hora_termino`,`cantidad_estudiantes`,`cantidad_docentes`,`total_bruto`,`total_iva`,`total_pagar`,`estado_id`,`observaciones`,`created_at`,`updated_at`) VALUES
(7,1,6,'2025-10-13','09:00:00','17:00:00',20,0,110000.00,20900.00,130900.00,1,'Hola','2025-10-13 23:10:14','2025-10-13 23:10:14');

INSERT INTO `roles` (`id_role`,`nombre`) VALUES
(1,'Administrador'),(2,'Editor'),(3,'Visitante');

INSERT INTO `usuarios` (`id_usuario`,`nombre`,`apellido`,`email`,`pass_hash`,`role_id`,`activo`,`created_at`,`updated_at`) VALUES
(1,'Admin','AquaFriend','admin','$2b$12$gw7TiHS.yUNnEQsMQF..wul60dZJXGJjHJER8AtsOxphP7AQ9LdJi',1,1,'2025-10-12 00:41:36','2025-10-13 18:05:26');

COMMIT;
