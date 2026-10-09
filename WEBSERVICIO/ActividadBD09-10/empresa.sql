-- base de datos empresa de la página 39 del libro
-- tabla Usuarios(Código, Nombre, Clave, Rol)
-- los nombres van en minúscula y sin tilde, como matematicas.php

CREATE DATABASE IF NOT EXISTS empresa CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE empresa;

CREATE TABLE IF NOT EXISTS usuarios (
    codigo INT AUTO_INCREMENT PRIMARY KEY,  -- clave primaria, autonumérico
    nombre VARCHAR(50) NOT NULL UNIQUE,     -- nombre de usuario, no se puede repetir
    clave VARCHAR(50) NOT NULL,             -- clave de acceso al sistema
    rol INT NOT NULL                        -- número que dice el rol del usuario
);

-- usuarios de prueba, los mismos de Actividad09-10
INSERT INTO usuarios (nombre, clave, rol) VALUES
    ('Riquelme', '1234', 1),
    ('Robben', 'abcd', 0),
    ('Vegetti', '9876', 0);
