-- base de datos empresa de la página 39 del libro
-- tabla Usuarios(Código, Nombre, Clave, Rol)
-- los nombres van en minúscula y sin tilde, como matematicas.php

CREATE DATABASE IF NOT EXISTS empresa CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE empresa;

-- si ya existía la borro, así el script se puede volver a importar
DROP TABLE IF EXISTS usuarios;

CREATE TABLE usuarios (
    codigo INT AUTO_INCREMENT PRIMARY KEY,  -- clave primaria, autonumérico
    nombre VARCHAR(50) NOT NULL UNIQUE,     -- nombre de usuario, no se puede repetir
    clave VARCHAR(50) NOT NULL,             -- clave de acceso al sistema
    rol INT NOT NULL                        -- número que dice el rol del usuario
);

-- 10 usuarios de prueba (rol 1 = administrador, rol 0 = usuario normal)
-- el codigo no lo pongo porque es autonumérico, MySQL le da 1, 2, 3...
INSERT INTO usuarios (nombre, clave, rol) VALUES
    ('Riquelme', '1234', 1),
    ('Robben', 'abcd', 0),
    ('Vegetti', '9876', 0),
    ('Zidane', 'zizou5', 1),
    ('Messi', 'lio10', 0),
    ('Palacio', 'trenza8', 0),
    ('Denis', 'tanque9', 0),
    ('Gutierrez', 'teo29', 0),
    ('Balotelli', 'super45', 0),
    ('Pratto', 'oso27', 0);
