SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

CREATE DATABASE IF NOT EXISTS `aquafriends`
  DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_general_ci;
USE `aquafriends`;

-- Limpiar tablas previas para evitar conflictos al importar nuevamente
DROP TABLE IF EXISTS `reserva`;
DROP TABLE IF EXISTS `reservas_estado`;
DROP TABLE IF EXISTS `programas_educativos`;
DROP TABLE IF EXISTS `profesor`;
DROP TABLE IF EXISTS `escuelas`;
DROP TABLE IF EXISTS `contactos`;
DROP TABLE IF EXISTS `usuarios`;
DROP TABLE IF EXISTS `roles`;
DROP TABLE IF EXISTS `especies`;

-- Roles y usuarios para autenticación
CREATE TABLE `roles` (
  `id_role` TINYINT(4) NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(40) NOT NULL,
  PRIMARY KEY (`id_role`),
  UNIQUE KEY `uniq_roles_nombre` (`nombre`)
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
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_usuario`),
  UNIQUE KEY `uniq_usuarios_email` (`email`),
  KEY `idx_usuarios_role` (`role_id`),
  CONSTRAINT `usuarios_role_fk`
    FOREIGN KEY (`role_id`)
    REFERENCES `roles` (`id_role`)
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Formulario de contacto público
CREATE TABLE `contactos` (
  `id_contacto` INT(11) NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(100) NOT NULL,
  `email` VARCHAR(150) NOT NULL,
  `telefono` VARCHAR(20) DEFAULT NULL,
  `mensaje` TEXT DEFAULT NULL,
  `fecha_contacto` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `leido` TINYINT(1) DEFAULT 0,
  PRIMARY KEY (`id_contacto`),
  KEY `idx_contactos_fecha` (`fecha_contacto`),
  KEY `idx_contactos_email` (`email`),
  KEY `idx_contactos_leido` (`leido`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Escuelas y profesores ligados a las reservas
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

CREATE TABLE `profesor` (
  `id_profesor` INT(11) NOT NULL AUTO_INCREMENT,
  `rut` VARCHAR(20) NOT NULL,
  `nombre` VARCHAR(120) DEFAULT NULL,
  `apellido` VARCHAR(120) DEFAULT NULL,
  `escuela_id` INT(11) DEFAULT NULL,
  `email` VARCHAR(180) DEFAULT NULL,
  `telefono` VARCHAR(30) DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_profesor`),
  UNIQUE KEY `uniq_profesor_rut` (`rut`),
  KEY `idx_profesor_escuela` (`escuela_id`),
  CONSTRAINT `profesor_escuela_fk`
    FOREIGN KEY (`escuela_id`)
    REFERENCES `escuelas` (`id_escuela`)
    ON DELETE SET NULL
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Programas y reservas pedagógicas
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
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_plan`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `reservas_estado` (
  `id_estado` TINYINT(4) NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(20) NOT NULL,
  PRIMARY KEY (`id_estado`),
  UNIQUE KEY `uniq_reservas_estado_nombre` (`nombre`)
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
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_reserva`),
  KEY `idx_reserva_plan` (`id_plan`),
  KEY `idx_reserva_fecha` (`fecha_reserva`),
  KEY `idx_reserva_estado` (`estado_id`),
  KEY `idx_reserva_escuela` (`escuela_id`),
  CONSTRAINT `reserva_programa_fk`
    FOREIGN KEY (`id_plan`)
    REFERENCES `programas_educativos` (`id_plan`)
    ON UPDATE CASCADE,
  CONSTRAINT `reserva_escuela_fk`
    FOREIGN KEY (`escuela_id`)
    REFERENCES `escuelas` (`id_escuela`)
    ON DELETE SET NULL
    ON UPDATE CASCADE,
  CONSTRAINT `reserva_estado_fk`
    FOREIGN KEY (`estado_id`)
    REFERENCES `reservas_estado` (`id_estado`)
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Catálogo de especies (peces) expuesto en el panel
CREATE TABLE `especies` (
  `id_especie` INT(11) NOT NULL AUTO_INCREMENT,
  `tipo` VARCHAR(20) NOT NULL DEFAULT 'pez',
  `nombre_comun` VARCHAR(150) NOT NULL,
  `nombre_cientifico` VARCHAR(150) DEFAULT NULL,
  `habitat` VARCHAR(120) DEFAULT NULL,
  `alimentacion` VARCHAR(200) DEFAULT NULL,
  `tamano_promedio` VARCHAR(50) DEFAULT NULL,
  `estado_conservacion` VARCHAR(120) DEFAULT NULL,
  `descripcion` VARCHAR(800) DEFAULT NULL,
  `imagen_principal` MEDIUMTEXT DEFAULT NULL,
  `fecha_registro` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_especie`),
  KEY `idx_especies_tipo` (`tipo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Datos iniciales
INSERT INTO `roles` (`id_role`, `nombre`) VALUES
(1, 'Administrador'), (2, 'Editor'), (3, 'Visitante');

INSERT INTO `usuarios`
(`id_usuario`,`nombre`,`apellido`,`email`,`pass_hash`,`role_id`,`activo`,`created_at`,`updated_at`) VALUES
(1,'Admin','AquaFriend','admin','$2b$12$gw7TiHS.yUNnEQsMQF..wul60dZJXGJjHJER8AtsOxphP7AQ9LdJi',1,1,'2025-10-12 00:41:36','2025-10-13 18:05:26');

INSERT INTO `contactos`
(`id_contacto`,`nombre`,`email`,`telefono`,`mensaje`,`fecha_contacto`,`leido`) VALUES
(1,'Yasmin','ya.santana@duocuc.cl','+56945179119','Hola','2025-10-13 23:19:27',0);

INSERT INTO `escuelas`
(`id_escuela`,`nombre`,`tipo`,`comuna`,`region`,`email`,`telefono`,`created_at`) VALUES
(6,'INSTITUTO PROFESIONAL Duoc UC',NULL,NULL,NULL,'ya.santana@duocuc.cl',NULL,'2025-10-13 23:10:14');

INSERT INTO `programas_educativos`
(`id_plan`,`nombre_plan`,`monto_por_persona`,`iva_porcentaje`,`min_estudiantes`,`max_estudiantes`,`tiempo_programa`,`descripcion`,`visible`,`created_at`,`updated_at`) VALUES
(1,'Visita basica',6500.00,19.00,1,35,'30-45 minutos','Recorrido por acuarios y granja con monitora',1,'2025-10-12 00:24:07','2025-10-12 00:24:07'),
(2,'Visita academica',9000.00,19.00,15,35,'60-90 minutos','Profundizacion biologica y quimica',1,'2025-10-12 00:24:07','2025-10-12 00:24:07'),
(3,'Taller aplicado',14000.00,19.00,15,35,'90-120 minutos','Habilidades blandas con trabajos practicos',1,'2025-10-12 00:24:07','2025-10-12 00:24:07');

INSERT INTO `reservas_estado` (`id_estado`,`nombre`) VALUES
(1,'Pendiente'),(2,'Confirmada'),(3,'Cancelada'),(4,'Completada');

INSERT INTO `reserva`
(`id_reserva`,`id_plan`,`escuela_id`,`fecha_reserva`,`hora_entrada`,`hora_termino`,
 `cantidad_estudiantes`,`cantidad_docentes`,`total_bruto`,`total_iva`,`total_pagar`,
 `estado_id`,`observaciones`,`created_at`,`updated_at`)
VALUES
(7,1,6,'2025-10-13','09:00:00','17:00:00',20,0,110000.00,20900.00,130900.00,1,'Hola','2025-10-13 23:10:14','2025-10-13 23:10:14');

INSERT INTO `especies`
(`id_especie`,`tipo`,`nombre_comun`,`nombre_cientifico`,`habitat`,`alimentacion`,`tamano_promedio`,`estado_conservacion`,`descripcion`,`imagen_principal`,`fecha_registro`) VALUES
(1,'pez','Salmon Coho','Salmo salar','Lago','Omnivoro','25 cm',NULL,'Salmon Coho de lago',NULL,'2025-10-11 16:16:49'),
(2,'pez','Trucha','Oncorhynchus mykiss','Lago','Omnivoro','25 cm',NULL,'Pez Trucha',NULL,'2025-10-11 16:13:24');



-- =========================================================
-- 🔥 20 NUEVAS ESPECIES (peces, mamíferos, aves, reptiles)
-- =========================================================

INSERT INTO `especies`
(`tipo`,`nombre_comun`,`nombre_cientifico`,`habitat`,`alimentacion`,`tamano_promedio`,`estado_conservacion`,`descripcion`)
VALUES
-- PECES
('pez','Puye','Galaxias maculatus','Río y lago','Insectívoro','10-15 cm','Preocupación menor','Pez nativo muy común en el sur de Chile.'),
('pez','Pejerrey chileno','Basilichthys australis','Lago y río','Omnívoro','15-20 cm','Preocupación menor','Presente en la cuenca del lago Puyehue.'),
('pez','Bagre de río','Trichomycterus areolatus','Fondos de ríos','Bentófago','12-18 cm','Preocupación menor','Habita fondos rocosos.'),
('pez','Perca trucha','Percichthys trucha','Lagos','Piscívoro','25-35 cm','Preocupación menor','Depredador de lagos sureños.'),
('pez','Carpa común','Cyprinus carpio','Lagos y estanques','Omnívoro','30-40 cm','Introducida','Especie introducida resistente.'),
('pez','Chorito de agua dulce','Diplodon chilensis','Ríos y lagos','Filtrador','4-6 cm','Vulnerable','Molusco filtrador de agua dulce.'),
('pez','Alevín arcoíris','Oncorhynchus mykiss juvenil','Ríos fríos','Insectívoro','5-7 cm','Introducida','Etapa juvenil de trucha arcoíris.'),
('pez','Carmelita de río','Trichomycterus chiltoni','Ríos','Insectívoro','8-10 cm','Preocupación menor','Especie nativa endémica de Chile.'),
('pez','Tollo de agua dulce','Diplomystes nahuelbutaensis','Ríos profundos','Carnívoro','20-25 cm','Vulnerable','Un bagre nativo poco común.'),
('pez','Chanchito','Australoheros facetus','Estanques','Omnívoro','12-15 cm','Introducida','Pez muy adaptable y territorial.'),

-- MAMÍFEROS
('mamifero','Oveja de campo','Ovis aries','Pradera','Herbívoro','60-80 cm','Doméstica','Usada en experiencias educativas.'),
('mamifero','Vaca lechera','Bos taurus','Prado','Herbívoro','1.2-1.5 m','Doméstica','Ejemplar para educación agrícola.'),
('mamifero','Cabra doméstica','Capra hircus','Pendiente y corral','Herbívoro','50-70 cm','Doméstica','Animal dócil para interacción.'),
('mamifero','Conejo de granja','Oryctolagus cuniculus','Corral','Herbívoro','25-35 cm','Doméstica','Conejo usado en actividades infantiles.'),
('mamifero','Cerdito','Sus scrofa domesticus','Granja','Omnívoro','40-70 cm','Doméstica','Muy usado en educación rural.'),

-- AVES
('ave','Gallina de campo','Gallus gallus domesticus','Gallinero','Omnívoro','30-40 cm','Doméstica','Aves para educación básica.'),
('ave','Pato doméstico','Anas platyrhynchos domesticus','Estanque','Omnívoro','40-50 cm','Doméstica','Pato común en granjas.'),
('ave','Ganso doméstico','Anser anser domesticus','Estanque y pradera','Herbívoro','60-90 cm','Doméstica','Ave grande de granja.'),

-- REPTILES
('reptil','Tortuga de orejas rojas','Trachemys scripta elegans','Estanque','Omnívoro','20-30 cm','Introducida','Reptil común en centros educativos.'),
('reptil','Iguana verde','Iguana iguana','Selva y terrarios','Herbívoro','1.0-1.5 m','CITES II','Ejemplar educativo sobre reptiles.');

COMMIT;
