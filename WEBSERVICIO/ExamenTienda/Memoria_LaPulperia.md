# La Pulpería

**Tienda online de productos argentinos**

Memoria del proyecto · Desarrollo Web en Entorno Servidor · 2.º DAW · ILERNA

| | |
| --- | --- |
| **Alumno** | Martín Villagra Tejerina |
| **Profesor** | Fran Soltero |
| **Entrega de la memoria** | 12 de noviembre de 2026 |

## Índice

- [1. Definición del proyecto](#1-definición-del-proyecto)
  - [1.1. Qué es La Pulpería](#11-qué-es-la-pulpería)
  - [1.2. Por qué este proyecto](#12-por-qué-este-proyecto)
  - [1.3. Alcance y método de trabajo](#13-alcance-y-método-de-trabajo)
  - [1.4. Tecnologías](#14-tecnologías)
  - [1.5. Catálogo](#15-catálogo)
- [2. Especificación de requisitos (ERS)](#2-especificación-de-requisitos-ers)
  - [2.1. Propósito](#21-propósito)
  - [2.2. Usuarios del sistema](#22-usuarios-del-sistema)
  - [2.3. Requisitos funcionales](#23-requisitos-funcionales)
  - [2.4. Requisitos no funcionales](#24-requisitos-no-funcionales)
  - [2.5. Cookie y variables de sesión](#25-cookie-y-variables-de-sesión)
  - [2.6. Modelo de datos](#26-modelo-de-datos)
  - [2.7. Clases](#27-clases)
  - [2.8. Ficheros de la aplicación](#28-ficheros-de-la-aplicación)
- [3. Prototipo de pantallas](#3-prototipo-de-pantallas)
  - [3.1. Identidad visual](#31-identidad-visual)
  - [3.2. Flujo de pantallas](#32-flujo-de-pantallas)
  - [3.3. Pantallas](#33-pantallas)
- [4. Limitaciones](#4-limitaciones)
- [5. Líneas futuras](#5-líneas-futuras)

## 1. Definición del proyecto

### 1.1. Qué es La Pulpería

La Pulpería es una tienda online de productos argentinos pensada para quienes viven en Europa: yerba mate, mates y bombillas, termos, alfajores, dulce de leche y productos de almacén.

El nombre viene de las pulperías, los almacenes de campo de la época gaucha donde se compraba la yerba, el azúcar y el tabaco, y donde se juntaba la gente del pago.

El cliente entra con su correo y su clave, recorre el catálogo por categorías, arma un carrito y hace el pedido. El pedido queda guardado en la base de datos con el precio del día de la compra.

### 1.2. Por qué este proyecto

Antes de elegir el tema se revisaron siete tiendas que venden productos argentinos en Europa: Pampa Drugstore (Barcelona), Mate-Tee (Alemania), MateMundo (Reino Unido), Casa Argentina (Londres), Patagonia Online (Reino Unido), UruShop (Reino Unido) y La Reinita (Ámsterdam).

De esa revisión salen tres conclusiones:

- Todas venden yerba mate, y la mayoría también accesorios de mate, alfajores, dulce de leche y kits de regalo. Con eso se definieron las seis categorías de la tienda (apartado 1.5).
- Las webs del rubro, también las de Argentina y Uruguay, tienen en general un diseño anticuado. Hay lugar para una tienda con una imagen cuidada.
- La misma yerba cuesta en Europa entre 2,5 y 3 veces más que en Argentina. Los precios de la tienda se fijaron con esa referencia (apartado 4, Precios).

Ninguna de las tiendas revisadas usa el nombre «La Pulpería».

### 1.3. Alcance y método de trabajo

El proyecto se divide en tres partes, que se entregan por separado:

| **Fecha** | **Entrega** |
| --- | --- |
| 12/11/2026 | Memoria: definición, requisitos (ERS), prototipo de pantallas y limitaciones. |
| 19/11/2026 | Parte 1 (gestor de productos) y parte 2 (control del usuario). |
| 02/12/2026 | Parte 3 (carrito y pedidos) y entrega final. |

Se sigue un modelo en espiral, como el que propone el libro de la asignatura: en cada parte se repasan los requisitos, se diseña, se programa y se prueba antes de pasar a la siguiente. Si un requisito cambia, se actualiza también esta memoria, para que memoria y código digan siempre lo mismo.

### 1.4. Tecnologías

| **Tecnología** | **Uso** |
| --- | --- |
| PHP 8.2 | Lógica del servidor, con programación orientada a objetos. |
| MariaDB 10.4 (MySQL) | Base de datos relacional «pulperia», con codificación utf8mb4. |
| PDO | Conexión de PHP con la base de datos, con consultas preparadas. |
| HTML, CSS y JavaScript | Páginas, estilos y efectos visuales. JavaScript solo se usa para animaciones y comodidades (ver la clave, reiniciar el gif, mostrar en el celular la opción elegida del filtro); la lógica de la tienda corre en el servidor. |
| XAMPP | Servidor local (Apache + MariaDB) para desarrollar y probar. |
| GSAP, Google Fonts y Phosphor Icons | Animaciones de entrada, tipografías (Anton, Bricolage Grotesque y Permanent Marker) e iconos, cargados desde CDN. |
| Figma | Prototipo de las pantallas. |

### 1.5. Catálogo

La tienda tiene 6 categorías y 70 productos, por encima del mínimo pedido (3 categorías y 8 productos):

| **Categoría** | **Productos** | **Tipos (filtro, RF-18)** | **Ejemplos** |
| --- | --- | --- | --- |
| Yerbas | 30 | Con palo, sin palo, compuesta, orgánica, barbacuá, saborizada, chimarrão | Playadito, Taragüí, Canarias, Baldo, Sara, La Merced Barbacuá, Kraus Orgánica |
| Mates y bombillas | 8 | Mates, bombillas | Mate imperial, mate camionero, bombilla pico de loro |
| Termos y materas | 8 | Termos, materas, pavas, yerberas | Termo Stanley, termo Lumilagro, pava con control de temperatura, matera Broksol |
| Alfajores y dulce de leche | 8 | Alfajores, dulce de leche | Havanna, Cachafaz, Guaymallén, dulce de leche La Serenísima |
| Almacén criollo | 8 | Para el mate, para el asado, dulces, para cocinar | Chimichurri, Mantecol, Criollitas, dulce de membrillo Esnaola |
| Kits y regalos | 8 | Para el mate, para comer | Kit de iniciación, kit matero, kit viajero |

Cada categoría tiene su propia plantilla de descripción, para que todos los productos de una categoría den la misma información:

| **Categoría** | **Qué dice la descripción** |
| --- | --- |
| Yerbas | Tipo de yerba y lugar de origen, empresa que la elabora, intensidad del sabor y un dato propio de la marca. |
| Mates y bombillas | De qué está hecho, cómo está terminado (forro, virola, filtro, largo), para quién es y un cuidado o dato propio. |
| Termos y materas | Material y capacidad, qué tiene para cebar, cuánto mantiene el agua o qué lleva, y un dato propio. |
| Alfajores y dulce de leche | Cómo es (tapas, relleno, baño), quién lo hace, cómo viene y un dato propio. |
| Almacén criollo | Qué es, de qué marca, cómo se usa y un dato propio. |
| Kits y regalos | Qué trae y para quién es. |

Los materiales y las medidas de los mates, bombillas y termos siguen el catálogo de Nuestra Pacha Regionales (Córdoba, Argentina), una tienda real del rubro: calabaza forrada en cuero, faja y virola de alpaca, bombillas de 16 a 18 cm con filtro de cuchara o de resorte.

## 2. Especificación de requisitos (ERS)

### 2.1. Propósito

Este apartado describe qué hace la aplicación. Cada requisito lleva un código (RF para los funcionales, RNF para los no funcionales) para poder localizarlo en el código fuente. Lo que no se implementa no aparece como requisito: va en Limitaciones (apartado 4) o en Líneas futuras (apartado 5).

### 2.2. Usuarios del sistema

| **Usuario** | **Rol** | **Qué puede hacer** |
| --- | --- | --- |
| Cliente | 0 | Ver el catálogo, usar el carrito, hacer pedidos y ver su perfil. |
| Administrador | 1 | Lo mismo que el cliente y, además, gestionar los productos (RF-04). |

Sin iniciar sesión solo se puede ver la pantalla de login.

Usuarios de prueba (la clave se guarda en la base de datos con password_hash):

| **Correo** | **Clave** | **Rol** |
| --- | --- | --- |
| admin@lapulperia.es | admin1234 | 1 (administrador) |
| riquelme@correo.com | 1234 | 0 (cliente) |
| messi@correo.com | lio10 | 0 (cliente) |

El producto «Bombilla de alpaca cincelada» tiene stock 0 a propósito, para probar RF-03.

### 2.3. Requisitos funcionales

Los códigos no se renumeran: un requisito que se suma después recibe el siguiente número libre (RF-18), aunque se liste en su parte. Así los códigos siguen coincidiendo con los comentarios del código fuente.

**Parte 1. Gestor de productos**

| **Código** | **Requisito** |
| --- | --- |
| RF-01 | Mostrar las categorías leídas de la base de datos, con su nombre y su descripción. |
| RF-02 | Al elegir una categoría, mostrar sus productos con imagen, nombre, descripción, peso y precio en euros, con su equivalente en pesos argentinos. |
| RF-03 | Un producto con stock 0 aparece como «Sin stock» y no se puede añadir al carrito. |
| RF-04 | El administrador puede dar de alta, modificar y dar de baja productos desde el gestor de productos. Solo los usuarios con rol de administrador ven el enlace al gestor y pueden entrar en él; si un cliente lo intenta, vuelve a las categorías. Un producto que ya aparece en algún pedido no se puede dar de baja, para no romper los pedidos antiguos. |
| RF-18 | En la página de una categoría, filtrar sus productos por tipo (por ejemplo, en Yerbas: con palo, sin palo, compuesta, orgánica o barbacuá). Los tipos y la cantidad de productos de cada uno se leen de la base de datos, y el filtro se aplica en la consulta. Solo aparece si la categoría tiene más de un tipo. |

**Parte 2. Control del usuario**

| **Código** | **Requisito** |
| --- | --- |
| RF-05 | Iniciar sesión con correo y clave. La clave se comprueba contra el hash guardado en la base de datos. |
| RF-06 | Si el correo o la clave no son correctos, se muestra un error sin indicar cuál de los dos falló. |
| RF-07 | Casilla «Recordar mi correo»: si se marca, el correo se guarda en una cookie y aparece escrito la próxima vez que se abre el login. |
| RF-08 | Todas las páginas, salvo el login y el cierre de sesión, exigen sesión iniciada. Sin sesión, redirigen al login. |
| RF-09 | La sesión caduca tras 10 minutos sin actividad. Al volver, el usuario ve un aviso de sesión caducada y tiene que entrar de nuevo. |
| RF-10 | Página de perfil con los datos del usuario (nombre, correo, dirección, ciudad, código postal, país y fecha de alta) y la lista de sus pedidos. |
| RF-11 | Cerrar sesión desde cualquier página. |

**Parte 3. Carrito y pedidos**

| **Código** | **Requisito** |
| --- | --- |
| RF-12 | Añadir unidades de un producto al carrito. No se pueden añadir más unidades que el stock disponible. |
| RF-13 | Ver el carrito: producto, unidades, precio unitario, subtotal y total, en euros y en pesos. |
| RF-14 | Quitar unidades o un producto entero del carrito. |
| RF-15 | Confirmar el pedido: se guardan el pedido y una línea por producto con sus unidades y el precio del día, y se descuenta el stock. Todo va en una transacción: si algo falla, no se guarda nada. |
| RF-16 | Antes de guardar el pedido se vuelve a comprobar el stock en la base de datos. Si otro cliente compró las últimas unidades, el pedido no se hace y se avisa al usuario. Durante la comprobación, las filas de esos productos quedan bloqueadas hasta el final de la transacción (SELECT … FOR UPDATE): si dos clientes confirman a la vez, el segundo espera y ve el stock ya descontado, así que nunca se venden más unidades de las que hay. |
| RF-17 | Tras confirmar, se muestra el número de pedido y el carrito queda vacío. |

### 2.4. Requisitos no funcionales

| **Código** | **Requisito** |
| --- | --- |
| RNF-01 | Programación orientada a objetos: la lógica está en las clases del apartado 2.7. |
| RNF-02 | Base de datos relacional. El acceso se hace con PDO y consultas preparadas (prepare y execute); nunca se pegan datos del usuario dentro de una consulta. |
| RNF-03 | Las claves se guardan con password_hash y se comprueban con password_verify. Nunca se guardan en una cookie ni en la sesión. |
| RNF-04 | La aplicación usa una cookie propia y variables de sesión, descritas en el apartado 2.5. |
| RNF-05 | Los precios se guardan en euros. El equivalente en pesos es el precio en euros × 1.700, con la cotización definida en un único lugar del código. |
| RNF-06 | Todo en UTF-8 (base de datos y páginas), para que se vean bien las tildes, la ñ y la diéresis (Taragüí). |
| RNF-07 | Los datos que se muestran en las páginas se escapan con htmlspecialchars, para evitar que se inyecte HTML. |
| RNF-08 | Funciona en local con XAMPP. Las tipografías, los iconos y GSAP se cargan desde internet; sin conexión la tienda funciona igual, con la letra del sistema y sin animaciones. |
| RNF-09 | Lo que se mueve solo (la cinta de arriba, las animaciones de entrada y el cambio de página) respeta la opción «reducir movimiento» del sistema. El gif al pasar el mouse sí se muestra, porque lo pide la persona. |

### 2.5. Cookie y variables de sesión

| **Nombre** | **Tipo** | **Qué guarda** | **Vida** |
| --- | --- | --- | --- |
| recordar_correo | Cookie propia | El correo del usuario. Nunca la clave. | Se crea al entrar con la casilla marcada y dura 30 días. Se borra al entrar con la casilla desmarcada. |
| PHPSESSID | Cookie de sesión de PHP | El identificador de la sesión. La crea PHP solo, con HttpOnly (JavaScript no la puede leer) y SameSite=Lax (no viaja en formularios de otras webs, así nadie puede hacer un pedido en nombre del usuario). | Hasta cerrar el navegador o cerrar sesión. |
| $_SESSION['usuario'] | Variable de sesión | Código, correo, nombre y rol del usuario. | Se crea al iniciar sesión. Se borra al cerrar sesión o al caducar. |
| $_SESSION['carrito'] | Variable de sesión | Array código de producto → unidades, como en el libro. Solo los códigos y las unidades: el nombre, el precio y el stock se leen de la base de datos cada vez, así están siempre al día. | Se crea al añadir el primer producto. Se vacía al confirmar el pedido. |
| $_SESSION['ultima_actividad'] | Variable de sesión | La hora (time()) de la última página visitada. | Se actualiza en cada página. Si pasan más de 10 minutos, la sesión se destruye (RF-09). |

### 2.6. Modelo de datos

La base de datos «pulperia» tiene cinco tablas. Las relaciones son:

- Una categoría tiene muchos productos (1:N).
- Un usuario hace muchos pedidos (1:N).
- Un pedido tiene muchos productos y un producto aparece en muchos pedidos (N:M). La relación se resuelve con la tabla pedidos_productos, que guarda también las unidades y el precio del día de la compra. Así, un pedido antiguo no cambia si después sube el precio.

![Diagrama E-R de la base de datos «pulperia»](diagrama_er.png)

*Figura 1. Diagrama E-R de la base de datos «pulperia».*

**usuarios**

| **Campo** | **Tipo** | **Descripción** |
| --- | --- | --- |
| codigo | INT, PK | Identificador, autoincremental. |
| correo | VARCHAR(100), único | Correo con el que se inicia sesión. |
| clave | VARCHAR(255) | Hash de la clave (password_hash). |
| nombre, direccion, ciudad, cp, pais | VARCHAR | Datos personales y de envío. |
| rol | INT | 0 = cliente, 1 = administrador. |
| fecha_alta | DATETIME | Fecha de alta del usuario. |

**categorias**

| **Campo** | **Tipo** | **Descripción** |
| --- | --- | --- |
| codigo | INT, PK | Identificador, autoincremental. |
| nombre | VARCHAR(50), único | Nombre de la categoría. |
| descripcion | VARCHAR(200) | Texto que se muestra en el listado de categorías. |
| imagen | VARCHAR(150) | Ruta de la imagen del afiche de la categoría (img/categorias/…webp). |

**productos**

| **Campo** | **Tipo** | **Descripción** |
| --- | --- | --- |
| codigo | INT, PK | Identificador, autoincremental. |
| nombre | VARCHAR(100) | Nombre del producto. |
| descripcion | VARCHAR(300) | Descripción. |
| peso | INT | Peso en gramos. |
| precio | DECIMAL(8,2) | Precio en euros. |
| stock | INT | Unidades disponibles. |
| imagen | VARCHAR(150) | Ruta de la imagen (img/productos/…jpg). |
| tipo | VARCHAR(30) | Tipo dentro de su categoría (con palo, bombillas…), para el filtro (RF-18). |
| categoria | INT, FK | Categoría a la que pertenece. |

**pedidos**

| **Campo** | **Tipo** | **Descripción** |
| --- | --- | --- |
| codigo | INT, PK | Número de pedido, autoincremental. |
| fecha | DATETIME | Fecha y hora del pedido. |
| enviado | INT | 0 = no enviado, 1 = enviado. |
| usuario | INT, FK | Usuario que hizo el pedido. |

**pedidos_productos**

| **Campo** | **Tipo** | **Descripción** |
| --- | --- | --- |
| codigo | INT, PK | Identificador, autoincremental. |
| pedido | INT, FK | Pedido al que pertenece la línea. |
| producto | INT, FK | Producto pedido. |
| unidades | INT | Unidades pedidas. |
| precio | DECIMAL(8,2) | Precio unitario en euros el día de la compra. |

### 2.7. Clases

| **Clase** | **Responsabilidad** |
| --- | --- |
| BaseDatos | Abre la conexión PDO una sola vez y la comparte con el resto de clases. |
| Categoria | Lee las categorías de la base de datos, con su cantidad de productos y el precio de su producto más barato, y los tipos de producto de cada una para el filtro. |
| Producto | Lee los productos de una categoría (todos o los de un tipo), un producto por su código o varios por sus códigos (los del carrito, en una sola consulta), y consulta el stock. Para el gestor, da de alta, modifica y da de baja productos. |
| Usuario | Inicia sesión comprobando el hash, comprueba que la sesión siga activa y devuelve los datos del perfil. |
| Carrito | Maneja $_SESSION['carrito']: añadir sin pasar del stock, quitar, vaciar, contar las unidades y calcular los subtotales y el total. |
| Pedido | Guarda el pedido en una transacción y lista los pedidos de un usuario. |

### 2.8. Ficheros de la aplicación

Como en el diseño del libro (apartado 4.3.6), cada página es un fichero y los datos pasan de uno a otro por la URL (GET) o por formularios (POST). Todas las páginas, salvo el login y el cierre de sesión, empiezan con Usuario::comprobarSesion(), que lleva a login.php?redirigido=1 si no hay sesión y a login.php?caducada=1 si caducó.

| **Fichero** | **Qué hace** | **Recibe** | **Redirige a** |
| --- | --- | --- | --- |
| config.php | Datos de la base de datos, cotización, minutos de inactividad, carga de las clases e inicio de la sesión. Lo incluyen todas las páginas. | | |
| inc/cabecera.php, inc/pie.php | Cabecera común (logo, menú, carrito con su número de unidades, cerrar sesión) y pie. | | |
| index.php | Entrada a la tienda. | | categorias.php |
| login.php | Formulario de login y su comprobación (RF-05 a RF-07). | POST correo, clave, recordar · GET redirigido, caducada | categorias.php si entra |
| logout.php | Cierra la sesión (RF-11). | | login.php |
| categorias.php | Categorías y lista de precios (RF-01). | | |
| productos.php | Productos de una categoría, filtro por tipo y formulario para añadir al carrito (RF-02, RF-03, RF-12, RF-18). | GET categoria, tipo, anadido, tope | |
| anadir.php | Añade unidades al carrito sin pasar del stock (RF-12). No muestra nada. | POST cod, unidades, tipo, volver | productos.php, a la tarjeta del producto, o carrito.php |
| eliminar.php | Quita unidades del carrito (RF-14). No muestra nada. | POST cod, unidades | carrito.php |
| carrito.php | Muestra el carrito (RF-13, RF-14). | GET tope | |
| procesar_pedido.php | Guarda el pedido y muestra el número o el error (RF-15 a RF-17). | POST del botón «Confirmar pedido» | carrito.php si se abre sin POST o con el carrito vacío |
| perfil.php | Datos del usuario y sus pedidos (RF-10). | | |
| clases/ | Las clases del apartado 2.7, una por fichero. | | |

Los ficheros del gestor de productos (RF-04) se suman a esta tabla con la entrega del 19/11.

## 3. Prototipo de pantallas

El prototipo está hecho en Figma: [figma.com/design/VB6f1rX09R3Qyy5VzsDVG9/LA-PULPERIA](https://www.figma.com/design/VB6f1rX09R3Qyy5VzsDVG9/LA-PULPERIA).

Tiene dos páginas: «Identidad», con el origen de la estética, la paleta, las letras y las piezas, y «Pantallas», con las ocho pantallas de la tienda ordenadas según el flujo del apartado 3.2 y numeradas de 01 a 08. Las pantallas se importaron a Figma desde la propia web con el plugin html.to.design, así que son capas editables y no capturas. La identidad y el gestor de productos, que todavía no está programado, se armaron como páginas estáticas en la carpeta prototipo/ (identidad.html y gestor.html) y se importaron igual.

### 3.1. Identidad visual

La tienda no se parece a las webs del rubro, que suelen ser blancas y de catálogo: se parece a la calle. Su estética sale de tres fuentes:

- **Los afiches de la calle.** Los que se pegan en las paredes y en las persianas de Buenos Aires y de Córdoba para anunciar recitales, bailes y obras. De ahí salen la letra de los títulos, las tintas flúor, los títulos torcidos como tiras de papel y la cinta que corre arriba de cada página.
- **Las chapas de La Boca.** Cada casa de chapa se pintaba con la pintura que sobraba en los astilleros del Riachuelo y cada pared quedaba de un color. De ahí sale que cada categoría tenga su color propio y que juntas formen la paleta.
- **El almacén de barrio.** El heredero de la pulpería del campo. De ahí salen las notas escritas a mano, la lista de precios de la portada, pegada con cinta, y la cuenta del carrito como un ticket.

La página «Identidad» del prototipo lo reúne en una lámina (Figura 2): las tres fuentes, las tintas con su código y su uso, las tres letras (Anton para los títulos, Permanent Marker para las notas a mano y Bricolage Grotesque para el texto) y las piezas de la interfaz.

![Lámina de identidad visual](prototipo/identidad.png)

*Figura 2. Lámina de la página «Identidad» del prototipo: fuentes, tintas, letras y piezas.*

El color de cada categoría sale de su código en la base de datos (clases .cat-1 a .cat-6 en css/estilos.css), así que la tinta acompaña a la categoría en todas las pantallas: su afiche, su franja, la sombra de sus tarjetas y su aviso al añadir al carrito.

### 3.2. Flujo de pantallas

Login → Categorías → Productos → Carrito → Confirmación del pedido.

Desde cualquier pantalla con sesión iniciada se puede ir al perfil, al carrito y cerrar sesión. Si la sesión caduca, cualquier pantalla lleva al login con el aviso de sesión caducada.

Al añadir un producto, la página vuelve a la tarjeta de ese producto, con el mismo filtro, y muestra un aviso con un enlace al carrito. En el libro, añadir lleva directo al carrito; quedarse en la lista es su ejercicio propuesto 1 del capítulo 4, y deja seguir comprando sin perder el sitio.

### 3.3. Pantallas

Cada pantalla es un frame de la página «Pantallas», exportado desde Figma (los PNG están en la carpeta prototipo/figma/), con lo que muestra y los requisitos que cubre. Los datos son los de la base de prueba, con la sesión de Juan Román Riquelme (apartado 2.2); el gestor, con la del administrador.

**01 Login** · RF-05, RF-06, RF-07

Logo, correo, clave con un botón para verla, casilla «Recordar mi correo», botón Entrar y mensaje de error si falla.

![01 Login](prototipo/figma/01%20Login.png)

**02 Sesión caducada** · RF-09

El login con un aviso arriba: «Tu sesión caducó por inactividad».

![02 Sesión caducada](prototipo/figma/02%20Sesi%C3%B3n%20caducada.png)

**03 Categorías** · RF-01, RF-11

Cabecera común (logo, nombre del usuario, carrito con el número de unidades que tiene, perfil y salir), una lista de precios con el precio más barato de cada categoría («desde 2,90 €») y un afiche por categoría con su descripción, su cantidad de productos y su imagen, recortada como un sticker.

![03 Categorías](prototipo/figma/03%20Categor%C3%ADas.png)

**04 Productos** (categoría Yerbas) · RF-02, RF-03, RF-12, RF-18

Arriba, el filtro por tipo: una ficha por tipo con su cantidad de productos, y la elegida resaltada con el color de la categoría. Debajo, una tarjeta por producto: imagen, nombre, descripción, peso, precio en euros (y en pesos), unidades y botón Añadir. Los que no tienen stock muestran «Sin stock» y no tienen botón. Si el producto ya está en el carrito, la tarjeta lo indica y no deja pedir más unidades de las que quedan. Después de añadir, un aviso abajo de la pantalla con un enlace al carrito. Al pasar el mouse, la foto se cambia por un gif del producto girando.

![04 Productos](prototipo/figma/04%20Productos.png)

**05 Carrito** · RF-12, RF-13, RF-14

Tabla con producto, precio, unidades (con botones − y + para quitar o sumar una), subtotal y botón Quitar. Si hay más unidades de las que quedan en stock, el producto se marca y no se puede confirmar hasta corregirlo. Al lado, la cuenta, como el ticket del almacén: unidades, total en euros y en pesos y botón Confirmar pedido. En el celular, cada fila es una ficha. Si está vacío, un aviso y un enlace a las categorías.

![05 Carrito](prototipo/figma/05%20Carrito.png)

**06 Confirmación** · RF-15, RF-16, RF-17

Número de pedido con un sello «Confirmado» y resumen con el total. Si falta stock, el aviso con los productos afectados (cuántas unidades quedan y cuántas había en el carrito) y un enlace al carrito.

![06 Confirmación](prototipo/figma/06%20Confirmaci%C3%B3n.png)

**07 Perfil** · RF-10

Datos del usuario y lista de sus pedidos con fecha, total y estado.

![07 Perfil](prototipo/figma/07%20Perfil.png)

**08 Gestor de productos** · RF-04

Solo para el administrador. Listado de todos los productos con su categoría, precio y stock, y botones de alta, modificación y baja. El alta y la modificación usan el mismo formulario.

![08 Gestor de productos](prototipo/figma/08%20Gestor%20%28RF-04%29.png)

## 4. Limitaciones

- **Cotización fija.** El precio en pesos se calcula con 1 € = 1.700 ARS, el valor tomado el 06/11/2026. No se actualiza solo.
- **Sin correos.** Al confirmar un pedido no se envía ningún correo. El libro lo hace con PHPMailer, pero eso exige guardar credenciales de una cuenta de correo.
- **Sin registro.** Los usuarios no se dan de alta desde la web: se crean en la base de datos (ver los usuarios de prueba del apartado 2.2).
- **Sin pago ni envío.** El pedido queda registrado, pero no hay pasarela de pago. El campo «enviado» existe en la base de datos, pero no se gestiona desde la web.
- **Precios.** Los precios de las yerbas se fijaron a partir de precios reales: los de los supermercados argentinos (DIA, Jumbo, Vea, Disco, Carrefour y ChangoMás, consultados el 06/11/2026) y los de las tiendas europeas Pampa Drugstore, Mate-Tee y UruShop. Nueve de las catorce que se sumaron el 10/11 no se venden en las tiendas consultadas y su precio es estimado. Los del resto de categorías son estimados.
- **Solo en local.** La aplicación funciona en XAMPP y no está desplegada en un servidor público.
- **Imágenes.** Las fotos de los productos son de los fabricantes y de las tiendas online argentinas donde se venden, y se usan solo con fines académicos. Los kits son fotos armadas juntando las de cada producto. Las imágenes de los afiches de las categorías se hicieron aparte para la tienda y no repiten productos del catálogo.
- **Carrito en la sesión.** El carrito vive en $_SESSION['carrito'] y no en la base de datos, así que se pierde al cerrar sesión o al caducar por inactividad. El pedido, en cambio, sí se guarda en la base de datos al confirmarlo.

## 5. Líneas futuras

- Botón para cambiar la moneda de toda la tienda entre euros y pesos, con la cotización del día.
- Registro de usuarios desde la web.
- Pasarela de pago y seguimiento del envío.
- Envío de un correo de confirmación con cada pedido.
- Nuevas categorías: vinos (exige verificar la mayoría de edad) y carnes (exige cadena de frío y envíos especiales).
- Renders 3D y vídeos de los productos.
- Filtro por tamaño del paquete (500 g, 1 kg), sumado al filtro por tipo.
- Ampliar el catálogo con más mates, bombillas y termos.
- Ofrecer la tienda a comercios reales del rubro.
