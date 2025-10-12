-- ================================================================
-- CREAR USUARIO ADMINISTRADOR
-- Usuario: admin
-- Contraseña: administrator@2025
-- ================================================================

-- 1. Asegurarse que los roles existan
INSERT INTO `roles` (`nombre`) VALUES
('Administrador'),
('Editor'),
('Visitante')
ON DUPLICATE KEY UPDATE nombre=VALUES(nombre);

-- 2. Crear usuario administrador
-- Por ahora guardamos la contraseña en texto plano (SOLO PARA DESARROLLO)
INSERT INTO `usuarios`
(`nombre`, `apellido`, `email`, `pass_hash`, `role_id`, `activo`)
VALUES
('Admin', 'AquaFriend', 'admin', 'administrator@2025', 1, 1)
ON DUPLICATE KEY UPDATE
    pass_hash = 'administrator@2025',
    role_id = 1,
    activo = 1;

-- 3. Verificar que se creó
SELECT * FROM usuarios WHERE email = 'admin';
