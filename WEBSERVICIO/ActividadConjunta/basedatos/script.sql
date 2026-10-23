-- Base de datos propia para la actividad conjunta (microservicios + tokens)
CREATE DATABASE IF NOT EXISTS microservicios;
USE microservicios;

CREATE TABLE usuarios_token (
    usuario  VARCHAR(50) PRIMARY KEY,
    password VARCHAR(64) NOT NULL,  -- SHA-256 siempre ocupa 64 caracteres en hexadecimal
    token    VARCHAR(64),
    tiempo   DATETIME
);

-- Tabla del microservicio "historial": una fila por cada operacion hecha
CREATE TABLE historial (
    id         INT AUTO_INCREMENT PRIMARY KEY,
    usuario    VARCHAR(50) NOT NULL,
    operacion  VARCHAR(20) NOT NULL,  -- sumar, restar, multiplicar, dividir...
    operacion1 DOUBLE NOT NULL,
    operacion2 DOUBLE NOT NULL,
    resultado  DOUBLE NOT NULL,
    fecha      DATETIME NOT NULL
);
