-- Script auxiliar para limpiar la base antes de importar aquafriends.sql
-- Ejecutar en phpMyAdmin (o cliente MySQL) conectado a la base `aquafriends`.

SET @old_fk_checks = @@FOREIGN_KEY_CHECKS;
SET FOREIGN_KEY_CHECKS = 0;

-- Tablas antiguas que ya no se usan
DROP TABLE IF EXISTS `ficha_media`;
DROP TABLE IF EXISTS `fichas`;
DROP TABLE IF EXISTS `escenas_360`;
DROP TABLE IF EXISTS `media`;
DROP TABLE IF EXISTS `pagos`;
DROP TABLE IF EXISTS `reserva_estudiante`;
DROP TABLE IF EXISTS `reserva_docente`;
DROP TABLE IF EXISTS `estudiantes`;
DROP TABLE IF EXISTS `peces`;
DROP TABLE IF EXISTS `animales`;
DROP TABLE IF EXISTS `reptiles`;
DROP TABLE IF EXISTS `especies`;
DROP TABLE IF EXISTS `categorias_especie`;
DROP TABLE IF EXISTS `habitats`;

-- Tablas activas que vamos a recrear con aquafriends.sql
DROP TABLE IF EXISTS `reserva`;
DROP TABLE IF EXISTS `reservas_estado`;
DROP TABLE IF EXISTS `programas_educativos`;
DROP TABLE IF EXISTS `profesor`;
DROP TABLE IF EXISTS `escuelas`;
DROP TABLE IF EXISTS `contactos`;
DROP TABLE IF EXISTS `usuarios`;
DROP TABLE IF EXISTS `roles`;

SET FOREIGN_KEY_CHECKS = @old_fk_checks;

-- Tras ejecutar este archivo, importar backend/sql/aquafriends.sql
-- Si necesitas ajustar una base existente sin recrear todo el esquema,
-- puedes ejecutar estas sentencias para añadir la columna `tipo` a `especies`
-- (así se maneja peces/animales/reptiles en la misma tabla) y rellenar datos antiguos.
--ALTER TABLE `especies`
--  ADD COLUMN `tipo` VARCHAR(20) NOT NULL DEFAULT 'pez',
--  ADD KEY `idx_especies_tipo` (`tipo`);
--UPDATE `especies`
--  SET `tipo` = 'pez'
--  WHERE `tipo` = '' OR `tipo` IS NULL;
