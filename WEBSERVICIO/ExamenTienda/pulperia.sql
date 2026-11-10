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
    ('Yerbas', 'Con palo, sin palo, compuestas y orgánicas, de Misiones, Corrientes, Córdoba, Paraguay y Uruguay. Suaves para empezar e intensas para el que ceba hace años.'),
    ('Mates y bombillas', 'Mates de calabaza forrados en cuero y de madera de algarrobo, con virola de alpaca. Bombillas pico de loro, de alpaca cincelada, de acero y de caña.'),
    ('Termos y materas', 'Termos de acero y de vidrio con pico cebador, la pava que no hierve el agua y materas para llevar el equipo a la plaza, a la facultad o a la ruta.'),
    ('Alfajores y dulce de leche', 'Del Havanna de Mar del Plata al Guaymallén de kiosco, simples y triples, y dulce de leche para untar, para rellenar o para comer a cucharadas.'),
    ('Almacén criollo', 'Lo que no puede faltar en la alacena: chimichurri y ají para el asado, galletitas y bizcochitos para el mate, polenta, membrillo y Mantecol.'),
    ('Kits y regalos', 'Combos armados para empezar a tomar mate, para regalar o para extrañar un poco menos: del kit de iniciación al equipo matero completo.');

-- 16 yerbas y 8 productos en el resto de las categorías (56 en total).
-- Todas las imágenes son .jpg en img/productos/ (faltan 3, que muestran "Imagen en preparación").
-- Cada categoría tiene su plantilla de descripción, como las yerbas. Los materiales y medidas
-- de mates, bombillas y termos siguen el catálogo de Nuestra Pacha Regionales (Córdoba),
-- una tienda real del rubro (ver sección 13 de analisis_y_pendientes.txt)
INSERT INTO productos (nombre, descripcion, peso, precio, stock, imagen, categoria) VALUES
    -- 1. Yerbas
    -- misma plantilla en todas: tipo, origen, quién la elabora, sabor y un dato propio.
    -- precios en euros sacados de tiendas europeas (ver sección 10 de analisis_y_pendientes.txt)
    ('Playadito Suave 1kg', 'Yerba con palo de Colonia Liebig, Corrientes (Argentina). La elabora la Cooperativa Agrícola de la Colonia Liebig. Sabor suave. La más vendida del país.', 1000, 7.90, 25, 'img/productos/playadito.jpg', 1),
    ('Taragüí Con Palo 1kg', 'Yerba con palo de Gobernador Virasoro, Corrientes (Argentina). La elabora Establecimiento Las Marías. Sabor intenso. Un clásico desde 1924.', 1000, 8.10, 20, 'img/productos/taragui.jpg', 1),
    ('Rosamonte 1kg', 'Yerba con palo de Apóstoles, Misiones (Argentina). La elabora Hreñuk S.A. Sabor intenso. De las más fuertes del mercado.', 1000, 8.50, 15, 'img/productos/rosamonte.jpg', 1),
    ('Amanda Tradicional 1kg', 'Yerba con palo de Apóstoles, Misiones (Argentina). La elabora La Cachuera. Sabor medio. Debe su nombre a la actriz Amanda Ledesma.', 1000, 8.30, 18, 'img/productos/amanda.jpg', 1),
    ('Unión Suave 1kg', 'Yerba con palo de Gobernador Virasoro, Corrientes (Argentina). La elabora Establecimiento Las Marías. Sabor suave. Molienda con poco polvo.', 1000, 8.50, 12, 'img/productos/union.jpg', 1),
    ('Canarias 1kg', 'Yerba sin palo de Uruguay, elaborada con yerba brasileña. La elabora Canarias S.A. Sabor intenso. Molienda fina, al estilo uruguayo.', 1000, 10.90, 10, 'img/productos/canarias.jpg', 1),
    ('CBSé Hierbas Serranas 1kg', 'Yerba compuesta de Córdoba (Argentina). La elabora CBSé. Sabor suave. Lleva hierbas serranas mezcladas con la yerba.', 1000, 9.90, 14, 'img/productos/cbse.jpg', 1),
    ('La Merced Campo Sur 1kg', 'Yerba de origen de Gobernador Virasoro, Corrientes (Argentina). La elabora Establecimiento Las Marías. Sabor medio. Línea premium de yerbas de una sola zona.', 1000, 12.90, 8, 'img/productos/la-merced.jpg', 1),
    ('Cruz de Malta 1kg', 'Yerba con palo de Argentina. La elabora Molinos Río de la Plata. Sabor medio. Marca histórica, apta para celíacos (sin TACC).', 1000, 8.90, 16, 'img/productos/cruzmalta.jpg', 1),
    ('Nobleza Gaucha 1kg', 'Yerba con palo de Argentina. La elabora Molinos Río de la Plata. Sabor medio. Rendidora y de precio accesible.', 1000, 7.90, 18, 'img/productos/nobleza-gaucha.jpg', 1),
    ('Piporé 1kg', 'Yerba con palo de Santo Pipó, Misiones (Argentina). La elabora la cooperativa de productores de Santo Pipó. Sabor suave. Cooperativa fundada en 1933 y de las que más exportan.', 1000, 8.80, 12, 'img/productos/pipore.jpg', 1),
    ('Verdeflor Hierbas Serranas 1kg', 'Yerba compuesta de Córdoba (Argentina). La elabora Grupo Cordeiro. Sabor suave. Lleva menta, cedrón, poleo y tomillo.', 1000, 8.20, 10, 'img/productos/verdeflor.jpg', 1),
    ('Pajarito Tradicional 1kg', 'Yerba con palo de Itapúa (Paraguay). La elabora Lauro Raatz S.A. Sabor intenso. Molienda fina, al estilo paraguayo.', 1000, 8.20, 12, 'img/productos/pajarito.jpg', 1),
    ('Kurupí Menta y Boldo 500g', 'Yerba compuesta de San Juan Bautista, Misiones (Paraguay). La elabora Santa Margarita S.A. Sabor medio. Lleva menta y boldo, la yerba digestiva del Paraguay.', 500, 5.90, 10, 'img/productos/kurupi.jpg', 1),
    ('Kraus Orgánica 500g', 'Yerba orgánica de San Ignacio, Misiones (Argentina). La elabora la familia Kraus. Sabor suave. Certificada orgánica y secada sin humo.', 500, 7.70, 8, 'img/productos/kraus.jpg', 1),
    ('Andresito Tradicional 1kg', 'Yerba con palo de Comandante Andresito, Misiones (Argentina). La elabora la Cooperativa Yerbatera Andresito. Sabor medio. Cooperativa de productores fundada en 1983.', 1000, 8.50, 14, 'img/productos/andresito.jpg', 1),

    -- 2. Mates y bombillas
    -- plantilla: de qué está hecho, cómo está terminado, para quién o cómo se usa, y un cuidado o dato propio
    ('Mate imperial de calabaza', 'Calabaza forrada en cuero, con faja y virola de alpaca cincelada y base con patas. El mate de los que ceban todos los días. Viene sin curar: antes de usarlo se llena con yerba y agua tibia y se deja reposar un día.', 350, 45.00, 6, 'img/productos/mate-imperial.jpg', 2),
    ('Mate camionero de calabaza', 'Calabaza grande y de boca ancha, forrada en cuero claro, con virola de alpaca con guarda griega. Entra más yerba y el mate dura más: es el de los viajes largos en la ruta. Se cura igual que el imperial.', 300, 22.00, 10, 'img/productos/mate-camionero.jpg', 2),
    ('Mate torpedo de calabaza', 'Calabaza alargada con forma de torpedo, forrada en cuero negro y con virola de alpaca con guarda griega. Más angosto que el imperial: entra menos yerba y salen mates cortos y amargos. Se cura antes del primer uso.', 250, 28.00, 7, 'img/productos/mate-torpedo.jpg', 2),
    ('Mate de algarrobo', 'Madera de algarrobo torneada a mano, del monte chaqueño, en el norte de Argentina. Más liviano que la calabaza y sin forrar. La madera le da a la yerba un gusto propio. Se cura con yerba usada y agua durante un par de días.', 200, 12.00, 15, 'img/productos/mate-algarrobo.jpg', 2),
    ('Bombilla pico de loro de alpaca', 'Bombilla de alpaca de 18 cm con la punta curva, boquilla dorada y filtro de cuchara. La curva del pico apoya cómoda en la boca y no se golpea contra los dientes. La clásica para el mate de calabaza.', 40, 18.00, 12, 'img/productos/bombilla-pico-loro.jpg', 2),
    ('Bombilla curva de acero inoxidable', 'Bombilla curva de acero inoxidable de 16 cm, con filtro de cuchara. No se oxida, no toma gusto y se lava fácil. La más práctica para el día a día y la que va en el kit de iniciación.', 30, 7.00, 30, 'img/productos/bombilla-acero.jpg', 2),
    ('Bombilla de alpaca cincelada', 'Bombilla recta de alpaca con el caño cincelado a mano por orfebres, y filtro de resorte que se desarma para limpiarla. La alpaca es una aleación de cobre, níquel y zinc: brilla como la plata y es más resistente.', 45, 25.00, 0, 'img/productos/bombilla-cincelada.jpg', 2),  -- stock 0 para probar "sin stock"
    ('Bombilla de caña', 'Bombilla de caña tacuara, liviana y natural. Es la más antigua: los guaraníes ya tomaban la yerba con una caña. No deja gusto metálico. Después de usarla se enjuaga con agua caliente y se deja secar.', 15, 5.00, 20, 'img/productos/bombilla-cana.jpg', 2),

    -- 3. Termos y materas
    -- plantilla: material y capacidad, qué tiene para cebar, cuánto aguanta o qué lleva, y un dato propio
    ('Termo Stanley Classic 1L', 'Termo de acero inoxidable de doble pared al vacío, de 1 litro, con tapón cebador. Mantiene el agua caliente hasta 24 horas y aguanta golpes. Es el verde de siempre y tiene garantía de por vida.', 1200, 49.00, 8, 'img/productos/termo-stanley.jpg', 3),
    ('Termo Lumilagro 1L', 'Termo con ampolla de vidrio y cuerpo de plástico, de 1 litro, con manija y pico cebador. El termo argentino de toda la vida. Si la ampolla se rompe, se cambia por un repuesto y el termo sigue andando.', 900, 22.00, 10, 'img/productos/termo-lumilagro.jpg', 3),
    ('Termo Lumilagro Luminox 1L', 'Termo de acero inoxidable de 1 litro, con tapón cebador que deja salir el agua de a poco. Es de Lumilagro, la misma marca que el de vidrio, pero no se rompe si se cae. Más liviano que el Stanley.', 1000, 32.00, 9, 'img/productos/termo-luminox.jpg', 3),
    ('Termo de acero 1L con pico cebador', 'Termo de acero inoxidable de 1 litro, con manija y pico cebador. Simple, resistente y barato: para la oficina o para tener uno de repuesto en la matera.', 950, 29.00, 12, 'img/productos/termo-acero.jpg', 3),
    ('Pava eléctrica con control de temperatura', 'Pava eléctrica Electrolux de acero, con pantalla para elegir la temperatura. Para el mate se pone entre 80 y 85 °C: con el agua hervida la yerba se quema y el mate sale amargo de más.', 1100, 39.00, 6, 'img/productos/pava-electrica.jpg', 3),
    ('Matera Broksol con tapa', 'Matera rígida de Broksol, con tapa y hebilla, que se cuelga del hombro. Lleva el termo de 1 litro, el mate, la bombilla y la yerbera, y no se vuelca. Para tomar mate en la plaza, en la facultad o en la ruta.', 800, 35.00, 5, 'img/productos/matera-broksol.jpg', 3),
    ('Matera de lona', 'Matera de lona con correa regulable y bolsillo delantero. Lleva el termo, el mate y la yerbera, y en el bolsillo entran las galletitas. Liviana y fácil de lavar.', 400, 18.00, 10, 'img/productos/matera-lona.jpg', 3),
    ('Lata yerbera Broksol', 'Lata de chapa con tapa, de Broksol, con una planta de yerba dibujada. Guarda la yerba lejos de la luz y de la humedad, que le sacan el sabor. Se pasa la yerba del paquete y queda a mano en la mesada.', 300, 12.00, 14, 'img/productos/lata-yerbera.jpg', 3),

    -- 4. Alfajores y dulce de leche
    -- plantilla: cómo es (tapas, relleno, baño), quién lo hace, cómo viene y un dato propio
    ('Alfajores Havanna Mixtos x12', 'Caja de 12 alfajores Havanna, de chocolate y de merengue, rellenos de dulce de leche. Havanna nació en Mar del Plata en 1947, y su caja amarilla es el regalo de los que vuelven de la costa.', 600, 22.00, 10, 'img/productos/havanna-mixtos.jpg', 4),
    ('Alfajores Cachafaz x6', 'Seis alfajores bañados en chocolate negro y rellenos de dulce de leche. Más grandes que los de kiosco. La marca se llama como El Cachafaz, un bailarín de tango famoso de principios del siglo XX.', 420, 12.00, 12, 'img/productos/cachafaz.jpg', 4),
    ('Alfajores Guaymallén x10', 'El alfajor simple de kiosco: dos tapas y dulce de leche en el medio. De los más baratos del país, el de los recreos del colegio. Viene en bolsa de 10.', 380, 6.50, 20, 'img/productos/guaymallen.jpg', 4),
    ('Alfajores Jorgito x6', 'Alfajor bañado en chocolate y relleno de dulce de leche, el de la merienda. Un poco más grande que el Guaymallén y con más chocolate. Viene en paquete de 6.', 330, 5.50, 18, 'img/productos/jorgito.jpg', 4),
    ('Alfajores Fantoche Triple x6', 'Alfajor triple: tres tapas y dos capas de dulce de leche, bañado en chocolate. El más grande de los de kiosco, para el que con uno simple no le alcanza. Viene en caja de 6.', 510, 6.90, 15, 'img/productos/fantoche.jpg', 4),
    ('Dulce de leche La Serenísima 400g', 'Dulce de leche clásico en pote de 400 g, de La Serenísima (General Rodríguez, Buenos Aires). Sin TACC. El de untar en la tostada del desayuno, o para comer a cucharadas del pote.', 400, 5.50, 20, 'img/productos/ddl-serenisima.jpg', 4),
    ('Dulce de leche San Ignacio 450g', 'Dulce de leche en frasco de vidrio de 450 g, cremoso y espeso. San Ignacio es de las marcas más elegidas para rellenar panqueques, tortas y alfajores caseros.', 450, 6.90, 14, 'img/productos/ddl-san-ignacio.jpg', 4),
    ('Dulce de leche Havanna 450g', 'El dulce de leche con el que Havanna rellena sus alfajores, en frasco de vidrio de 450 g. No se vende en el supermercado: en Argentina solo se consigue en las cafeterías Havanna.', 450, 9.50, 8, 'img/productos/ddl-havanna.jpg', 4),

    -- 5. Almacén criollo
    -- plantilla: qué es, de qué marca, cómo se usa y un dato propio
    ('Chimichurri artesanal 250ml', 'Chimichurri listo para usar: ajo, perejil, orégano y ají en aceite y vinagre. Va arriba del asado, del choripán o de la provoleta. Una vez abierto, se guarda en la heladera.', 280, 6.50, 15, 'img/productos/chimichurri.jpg', 5),
    ('Mantecol 241g', 'Turrón de maní, el clásico de las fiestas de fin de año. Lo inventó la familia Georgalos en los años 40 y hoy lo hace Mondelez. Se come en trocitos, con el café o de postre.', 241, 6.90, 12, 'img/productos/mantecol.jpg', 5),
    ('Galletitas Criollitas 300g', 'Galletitas de agua de Bagley, las del mate de la tarde. Se comen solas, con manteca y dulce de leche, o con queso y dulce.', 300, 4.50, 20, 'img/productos/criollitas.jpg', 5),
    ('Galletitas Terrabusi Variedad 400g', 'Surtido de galletitas dulces de Terrabusi: rellenas, bañadas en chocolate y de vainilla, en un mismo paquete. La bolsa que se abre cuando vienen visitas.', 400, 6.50, 15, 'img/productos/terrabusi-variedad.jpg', 5),
    ('Bizcochitos de grasa Don Satur 200g', 'Bizcochitos de grasa salados, hojaldrados y crocantes. El compañero del mate en todo el país: se compran en la panadería o, como estos, en paquete.', 200, 3.50, 25, 'img/productos/don-satur.jpg', 5),
    ('Polenta Presto Pronta 500g', 'Harina de maíz precocida: la polenta queda lista en un minuto. Se sirve blanda con salsa y queso, o se deja enfriar, se corta y se dora a la plancha.', 500, 3.90, 18, 'img/productos/presto-pronta.jpg', 5),
    ('Ají molido Dos Anclas 50g', 'Ají molido de Dos Anclas: pimiento rojo secado y molido, apenas picante. Es la base del chimichurri y de las empanadas del norte. Viene en bolsa con cierre para que no se humedezca.', 50, 2.90, 22, 'img/productos/aji-molido.jpg', 5),
    ('Dulce de membrillo Esnaola 500g', 'Dulce de membrillo de Esnaola, en barra de 500 g. Con una feta de queso es el «vigilante», el postre de bodegón. También es el relleno de la pastafrola.', 500, 4.50, 10, 'img/productos/membrillo.jpg', 5),

    -- 6. Kits y regalos
    -- plantilla: qué trae y para quién es
    ('Kit iniciación al mate', 'Mate de algarrobo, bombilla curva de acero y yerba Playadito Suave 500 g. Para el que nunca tomó mate: el mate de madera no hay que forrarlo y Playadito es la más suave para empezar.', 750, 29.00, 10, 'img/productos/kit-iniciacion.jpg', 6),
    ('Kit matero completo', 'Matera Broksol, termo Lumilagro 1 L, mate imperial, bombilla pico de loro y yerba Taragüí 1 kg. Todo lo que hace falta para cebar en cualquier lado. El regalo para el que se va a vivir afuera.', 3100, 99.00, 4, 'img/productos/kit-matero.jpg', 6),
    ('Kit viajero', 'Mate camionero, termo de acero de 1 L con pico cebador y matera de lona. Para la ruta, el camping o la oficina: todo entra en la matera y se lleva colgado.', 1650, 59.00, 6, 'img/productos/kit-viajero.jpg', 6),
    ('Kit dulce', 'Alfajores Havanna Mixtos x12 y dulce de leche Havanna 450 g. Lo que se trae de Mar del Plata, en una sola caja. Para regalar o para no compartir.', 1050, 29.00, 8, 'img/productos/kit-dulce.jpg', 6),
    ('Kit asado criollo', 'Chimichurri, ají molido, pimentón y sal parrillera Dos Anclas. Con esto y la carne, el asado está. La sal parrillera es gruesa: se pone en la carne justo antes de la parrilla.', 700, 19.00, 9, 'img/productos/kit-asado.jpg', 6),
    ('Kit degustación de yerbas', 'Playadito, Taragüí, Rosamonte y Unión, de 500 g cada una. Para probar desde la más suave (Playadito) hasta una de las más fuertes (Rosamonte) y encontrar la tuya.', 2000, 32.00, 7, 'img/productos/kit-degustacion.jpg', 6),
    ('Kit desayuno argentino', 'Dulce de leche La Serenísima, galletitas Criollitas y bizcochitos Don Satur. El desayuno o la merienda de cualquier casa argentina: solo falta el mate.', 900, 15.00, 10, 'img/productos/kit-desayuno.jpg', 6),
    ('Kit mate y alfajores', 'Mate camionero, bombilla pico de loro y alfajores Cachafaz x6. Para regalar algo de Argentina sin pensarlo mucho: un mate para todos los días y algo dulce para acompañar.', 800, 35.00, 6, 'img/productos/kit-mate-alfajores.jpg', 6);
