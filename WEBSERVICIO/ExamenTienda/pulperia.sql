-- base de datos de La Pulpería, la tienda argentina del examen
-- sale del capítulo 4 del libro (apartado 4.3.1, diseño lógico), adaptada:
--   Restaurantes -> usuarios (clientes y administradores)
--   Categorias, Productos, Pedidos y PedidosProductos igual que el libro, más el precio
-- los nombres van en minúscula y sin tilde, como en empresa.sql

CREATE DATABASE IF NOT EXISTS pulperia CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE pulperia;

-- si ya existían las borro, así el script se puede volver a importar
-- van en este orden porque las de abajo dependen de las de arriba (claves ajenas)
DROP TABLE IF EXISTS pedidos_productos;
DROP TABLE IF EXISTS pedidos;
DROP TABLE IF EXISTS productos;
DROP TABLE IF EXISTS categorias;
DROP TABLE IF EXISTS usuarios;

CREATE TABLE usuarios (
    codigo INT AUTO_INCREMENT PRIMARY KEY,
    correo VARCHAR(100) NOT NULL UNIQUE,    -- es el nombre de usuario para entrar, no se repite
    clave VARCHAR(255) NOT NULL,            -- hash de password_hash(), nunca la clave en texto
    nombre VARCHAR(100) NOT NULL,
    direccion VARCHAR(200) NOT NULL,
    ciudad VARCHAR(50) NOT NULL,
    cp VARCHAR(10) NOT NULL,
    pais VARCHAR(50) NOT NULL,
    rol INT NOT NULL DEFAULT 0,             -- 1 = administrador, 0 = cliente
    fecha_alta DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE categorias (
    codigo INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE,     -- como en el libro, el nombre no se repite
    descripcion VARCHAR(200) NOT NULL
);

CREATE TABLE productos (
    codigo INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion VARCHAR(300) NOT NULL,
    peso INT NOT NULL,                      -- en gramos
    precio DECIMAL(8,2) NOT NULL,           -- en euros; el precio en pesos se calcula en PHP
    stock INT NOT NULL,
    imagen VARCHAR(150) NOT NULL,           -- ruta de la foto o render, el archivo no va en la BD
    categoria INT NOT NULL,
    FOREIGN KEY (categoria) REFERENCES categorias(codigo)
);

CREATE TABLE pedidos (
    codigo INT AUTO_INCREMENT PRIMARY KEY,
    fecha DATETIME NOT NULL,
    enviado INT NOT NULL DEFAULT 0,         -- 0 = pendiente, 1 = enviado (como en el libro)
    usuario INT NOT NULL,
    FOREIGN KEY (usuario) REFERENCES usuarios(codigo)
);

-- la relación N:M entre pedidos y productos (un pedido tiene varios productos
-- y un producto aparece en varios pedidos), igual que PedidosProductos del libro
CREATE TABLE pedidos_productos (
    codigo INT AUTO_INCREMENT PRIMARY KEY,
    pedido INT NOT NULL,
    producto INT NOT NULL,
    unidades INT NOT NULL,
    precio DECIMAL(8,2) NOT NULL,           -- precio de cada unidad EL DÍA de la compra:
                                            -- si después cambia el precio, el pedido viejo no cambia
    FOREIGN KEY (pedido) REFERENCES pedidos(codigo),
    FOREIGN KEY (producto) REFERENCES productos(codigo)
);

-- usuarios de prueba (las claves de verdad están en el comentario de cada uno)
INSERT INTO usuarios (correo, clave, nombre, direccion, ciudad, cp, pais, rol) VALUES
    ('admin@lapulperia.es', '$2y$10$FJGlDyn8HQ1AAzhr6x9eDOT7Yp/wSjeCnRpjJTKA2NgrJYE0HNT/.', 'Administrador', 'Calle Mayor 1', 'Madrid', '28013', 'España', 1),     -- admin1234
    ('riquelme@correo.com', '$2y$10$nLsFHkbwZmfjZoLSCVxlMOr6dJoJvSX8t28vHHLZbSJTcbp5mGU32', 'Juan Román Riquelme', 'Calle Brandsen 805', 'Barcelona', '08001', 'España', 0),   -- 1234
    ('messi@correo.com', '$2y$10$cGgCo95dlvBnFzzeQfnAF.ttV8lHmwbsdJ01FVBD8Wvr8Omc8KAae', 'Lionel Messi', 'Avinguda Diagonal 10', 'Barcelona', '08019', 'España', 0);           -- lio10

-- las 6 categorías salen de mirar 7 tiendas argentinas de Europa (ver analisis_y_pendientes.txt)
INSERT INTO categorias (nombre, descripcion) VALUES
    ('Yerbas', 'Yerba mate argentina y uruguaya, con palo, sin palo y con hierbas'),
    ('Mates y bombillas', 'Mates de calabaza y de madera, y bombillas de alpaca, acero y caña'),
    ('Termos y materas', 'Termos, pavas, materas y todo lo que hace falta para llevar el mate'),
    ('Alfajores y dulce de leche', 'Los alfajores de siempre y el dulce de leche para untar o para repostería'),
    ('Almacén criollo', 'Lo que no puede faltar en la alacena: chimichurri, galletitas, polenta y más'),
    ('Kits y regalos', 'Combos armados para empezar a tomar mate o para regalar');

-- 16 yerbas y 8 productos en el resto de las categorías (56 en total).
-- Todas las imágenes son .jpg en img/productos/; las de las yerbas ya están,
-- el resto de las rutas son para los renders que todavía no están
INSERT INTO productos (nombre, descripcion, peso, precio, stock, imagen, categoria) VALUES
    -- 1. Yerbas
    ('Playadito Suave 1kg', 'Yerba mate con palo, suave y de sabor parejo. La más pedida', 1000, 9.50, 25, 'img/productos/playadito.jpg', 1),
    ('Taragüí 4 Flex 1kg', 'Yerba mate con palo, sabor intenso y tradicional', 1000, 8.90, 20, 'img/productos/taragui.jpg', 1),
    ('Rosamonte 1kg', 'Yerba mate con palo, fuerte y de molienda gruesa', 1000, 9.20, 15, 'img/productos/rosamonte.jpg', 1),
    ('Amanda Tradicional 1kg', 'Yerba mate con palo, equilibrada y rendidora', 1000, 8.50, 18, 'img/productos/amanda.jpg', 1),
    ('Unión Suave 1kg', 'Yerba mate con palo, suave y con poco polvo', 1000, 9.40, 12, 'img/productos/union.jpg', 1),
    ('Canarias 500g', 'Yerba uruguaya sin palo, molienda fina y sabor fuerte', 500, 6.90, 10, 'img/productos/canarias.jpg', 1),
    ('CBSé Hierbas Serranas 1kg', 'Yerba mate compuesta con hierbas serranas', 1000, 9.80, 14, 'img/productos/cbse.jpg', 1),
    ('La Merced De Campo 500g', 'Yerba mate de origen, cosecha de campo, sabor suave', 500, 7.50, 8, 'img/productos/la-merced.jpg', 1),
    ('Cruz de Malta 1kg', 'Yerba mate con palo, de sabor tradicional', 1000, 8.90, 16, 'img/productos/cruzmalta.jpg', 1),
    ('Nobleza Gaucha 1kg', 'Yerba mate con palo, sabor fuerte y rendidora', 1000, 8.20, 18, 'img/productos/nobleza-gaucha.jpg', 1),
    ('Piporé 1kg', 'Yerba mate con palo, sabor suave y equilibrado', 1000, 8.80, 12, 'img/productos/pipore.jpg', 1),
    ('Verdeflor 1kg', 'Yerba mate de sabor intenso', 1000, 9.90, 10, 'img/productos/verdeflor.jpg', 1),
    ('Pajarito 500g', 'Yerba paraguaya de sabor fuerte', 500, 6.50, 12, 'img/productos/pajarito.jpg', 1),
    ('Kurupí 500g', 'Yerba paraguaya compuesta con hierbas', 500, 6.90, 10, 'img/productos/kurupi.jpg', 1),
    ('Kraus Orgánica 500g', 'Yerba mate orgánica, sin agroquímicos', 500, 8.90, 8, 'img/productos/kraus.jpg', 1),
    ('Andresito 1kg', 'Yerba mate de cooperativa, sabor suave', 1000, 8.40, 14, 'img/productos/andresito.jpg', 1),

    -- 2. Mates y bombillas
    ('Mate imperial de calabaza', 'Calabaza forrada en cuero con virola de alpaca cincelada', 350, 45.00, 6, 'img/productos/mate-imperial.jpg', 2),
    ('Mate camionero de calabaza', 'Calabaza grande con virola de acero, para mates largos', 300, 22.00, 10, 'img/productos/mate-camionero.jpg', 2),
    ('Mate torpedo de calabaza', 'Calabaza con forma de torpedo forrada en cuero', 250, 28.00, 7, 'img/productos/mate-torpedo.jpg', 2),
    ('Mate de algarrobo', 'Mate de madera de algarrobo torneado a mano', 200, 12.00, 15, 'img/productos/mate-algarrobo.jpg', 2),
    ('Bombilla pico de loro de alpaca', 'Bombilla de alpaca con la punta curva, la clásica', 40, 18.00, 12, 'img/productos/bombilla-pico-loro.jpg', 2),
    ('Bombilla de acero inoxidable', 'Bombilla de acero con filtro de resorte desmontable', 30, 7.00, 30, 'img/productos/bombilla-acero.jpg', 2),
    ('Bombilla de alpaca cincelada', 'Bombilla de alpaca trabajada a mano por orfebres', 45, 25.00, 0, 'img/productos/bombilla-cincelada.jpg', 2),  -- stock 0 para probar "sin stock"
    ('Bombilla de caña', 'Bombilla de caña tacuara, liviana y natural', 15, 5.00, 20, 'img/productos/bombilla-cana.jpg', 2),

    -- 3. Termos y materas
    ('Termo Stanley Classic 1L', 'Termo de acero con pico cebador, mantiene el agua caliente todo el día', 1200, 49.00, 8, 'img/productos/termo-stanley.jpg', 3),
    ('Termo Lumilagro 1L', 'El termo de vidrio de toda la vida', 900, 22.00, 10, 'img/productos/termo-lumilagro.jpg', 3),
    ('Termo Lumilagro Luminox 1L', 'Termo de acero inoxidable con tapón cebador', 1000, 32.00, 9, 'img/productos/termo-luminox.jpg', 3),
    ('Termo de acero 1L con pico cebador', 'Termo de acero genérico, simple y resistente', 950, 29.00, 12, 'img/productos/termo-acero.jpg', 3),
    ('Pava eléctrica con corte a 80°C', 'Corta antes de hervir para no quemar la yerba', 1100, 39.00, 6, 'img/productos/pava-electrica.jpg', 3),
    ('Matera de cuero', 'Matera de cuero con lugar para termo, mate y yerbera', 800, 35.00, 5, 'img/productos/matera-cuero.jpg', 3),
    ('Matera de lona', 'Matera de lona resistente para llevar a todos lados', 400, 18.00, 10, 'img/productos/matera-lona.jpg', 3),
    ('Yerbera y azucarera de lata', 'Set de dos latas para tener la yerba y el azúcar a mano', 300, 12.00, 14, 'img/productos/yerbera-azucarera.jpg', 3),

    -- 4. Alfajores y dulce de leche
    ('Alfajores Havanna Mixtos x12', 'Caja de 12 alfajores de chocolate y de merengue', 600, 22.00, 10, 'img/productos/havanna-mixtos.jpg', 4),
    ('Alfajores Cachafaz x6', 'Alfajores de chocolate rellenos de dulce de leche', 420, 12.00, 12, 'img/productos/cachafaz.jpg', 4),
    ('Alfajores Guaymallén x10', 'El alfajor de kiosco más clásico, de dulce de leche', 380, 6.50, 20, 'img/productos/guaymallen.jpg', 4),
    ('Alfajores Jorgito x6', 'Alfajores de chocolate con dulce de leche', 330, 5.50, 18, 'img/productos/jorgito.jpg', 4),
    ('Alfajores Fantoche Triple x6', 'Alfajor triple bañado en chocolate', 510, 6.90, 15, 'img/productos/fantoche.jpg', 4),
    ('Dulce de leche La Serenísima 400g', 'Dulce de leche clásico para untar', 400, 5.50, 20, 'img/productos/ddl-serenisima.jpg', 4),
    ('Dulce de leche San Ignacio 450g', 'Dulce de leche familiar, cremoso y espeso', 450, 6.90, 14, 'img/productos/ddl-san-ignacio.jpg', 4),
    ('Dulce de leche Havanna 450g', 'El dulce de leche de los alfajores Havanna', 450, 9.50, 8, 'img/productos/ddl-havanna.jpg', 4),

    -- 5. Almacén criollo
    ('Chimichurri artesanal 250ml', 'Chimichurri listo para el asado, con ajo, perejil y orégano', 280, 6.50, 15, 'img/productos/chimichurri.jpg', 5),
    ('Mantecol 241g', 'Turrón de maní, el clásico de las fiestas', 241, 6.90, 12, 'img/productos/mantecol.jpg', 5),
    ('Galletitas Criollitas 300g', 'Galletitas de agua para el mate', 300, 4.50, 20, 'img/productos/criollitas.jpg', 5),
    ('Galletitas Terrabusi Variedad 400g', 'Surtido de galletitas dulces', 400, 6.50, 15, 'img/productos/terrabusi-variedad.jpg', 5),
    ('Bizcochitos de grasa Don Satur 200g', 'Bizcochitos salados, los compañeros del mate', 200, 3.50, 25, 'img/productos/don-satur.jpg', 5),
    ('Polenta Presto Pronta 500g', 'Harina de maíz de cocción rápida', 500, 3.90, 18, 'img/productos/presto-pronta.jpg', 5),
    ('Ají molido 50g', 'Ají molido para el chimichurri y las empanadas', 50, 2.90, 22, 'img/productos/aji-molido.jpg', 5),
    ('Dulce de membrillo 500g', 'Dulce de membrillo para el vigilante con queso', 500, 4.50, 10, 'img/productos/membrillo.jpg', 5),

    -- 6. Kits y regalos
    ('Kit iniciación al mate', 'Mate de algarrobo, bombilla de acero y yerba Playadito 500g', 750, 29.00, 10, 'img/productos/kit-iniciacion.jpg', 6),
    ('Kit matero completo', 'Matera de cuero, termo Lumilagro, mate imperial, bombilla de alpaca y yerba 1kg', 3100, 99.00, 4, 'img/productos/kit-matero.jpg', 6),
    ('Kit viajero', 'Mate camionero, termo de acero 1L y matera de lona', 1650, 59.00, 6, 'img/productos/kit-viajero.jpg', 6),
    ('Kit dulce', 'Alfajores Havanna Mixtos x12 y dulce de leche Havanna 450g', 1050, 29.00, 8, 'img/productos/kit-dulce.jpg', 6),
    ('Kit asado criollo', 'Chimichurri, ají molido, pimentón y sal parrillera', 700, 19.00, 9, 'img/productos/kit-asado.jpg', 6),
    ('Kit degustación de yerbas', 'Cuatro yerbas de 500g para encontrar tu favorita', 2000, 32.00, 7, 'img/productos/kit-degustacion.jpg', 6),
    ('Kit desayuno argentino', 'Dulce de leche, Criollitas y bizcochitos Don Satur', 900, 15.00, 10, 'img/productos/kit-desayuno.jpg', 6),
    ('Kit mate y alfajores', 'Mate de calabaza, bombilla pico de loro y alfajores Cachafaz x6', 800, 35.00, 6, 'img/productos/kit-mate-alfajores.jpg', 6);
