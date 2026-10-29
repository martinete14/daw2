# Apuntes ejercicios tema 3

Para acordarme qué hice en cada uno y cómo explicarlo si me preguntan.

Siguen la misma idea que los del tema 2: un formulario que manda los datos a PHP, PHP los procesa y muestra el resultado en los cuadritos `ok` / `error`. Cabecera, pie y estilos salen de `comun`.

## Actividad09-10 · Login con sesiones (todavía sin base de datos)

Son 3 archivos: `inicio.php`, `login.php` y `compra.php`.

### Paso 1: login y zona de usuarios

- `inicio.php` arranca con `session_start()`. Si existe `$_SESSION["usuario"]` muestra la zona de usuarios; si no, muestra el formulario de usuario y contraseña.
- El formulario manda los datos por POST a `login.php`.
- `login.php` tiene los usuarios en un array `usuario => contraseña` (sin base de datos todavía). Si el usuario existe y la contraseña coincide, lo guarda en `$_SESSION["usuario"]` y lo manda a `inicio.php` con `header("Location: inicio.php")`. Si no, muestra el error.
- El nombre arriba a la derecha lo puse en `comun/cabecera.php`: si hay alguien en la sesión, lo muestra. Así sale en todas las páginas que tengan la sesión abierta.

Usuarios: Riquelme / 1234 y Robben / abcd.

### Paso 2: compra.php con login de un minuto

- En `login.php`, además del usuario, guardo la hora del login: `$_SESSION["hora"] = time();`. `time()` da la hora actual en segundos.
- En `inicio.php` hay un enlace **Comprar** que lleva a `compra.php`.
- `compra.php` antes de mostrar nada mira dos cosas: que haya alguien logeado y que `time() - $_SESSION["hora"]` no pase de `$duracion`. Si falla alguna, borra la sesión con `session_destroy()` y lo manda al inicio a logearse de nuevo.
- Si está todo bien, muestra cuántos segundos le quedan.
- Ahora `$duracion` está en 10 segundos para probarlo más rápido. Para entregar va en 60.

Si me preguntan:
- **¿Por qué `session_start()` va arriba de todo?** Porque tiene que ir antes de que salga cualquier HTML. La sesión viaja en una cookie, y las cookies se mandan antes que la página.
- **¿Por qué `exit` después del `header`?** El `header` solo avisa al navegador que vaya a otra página, pero el PHP sigue corriendo. Con `exit` corto ahí y no se ejecuta lo de abajo.
- **¿Por qué `session_destroy()` cuando se pasa el tiempo?** Para que al volver al inicio no siga apareciendo como logeado y le salga el formulario otra vez.
- **¿El inicio también controla el minuto?** No, solo `compra.php`, que es lo que pide el enunciado. Si se pasa el minuto y no toca Comprar, en el inicio sigue apareciendo logeado hasta que entra a `compra.php`.

## ActividadBD09-10 · Base de datos empresa

Página 79 del libro (la 39 del PDF), apartado 3.6 Bases de datos relacionales.

- `empresa.sql` crea la base `empresa` con la tabla `usuarios`, como dice el "Toma nota" del libro:
  - `codigo`: clave primaria, autonumérico (`AUTO_INCREMENT`).
  - `nombre`: nombre de usuario, `UNIQUE` (no se puede repetir).
  - `clave`: la clave de acceso.
  - `rol`: un número con el rol (1 = administrador, 0 = usuario normal).
- Tiene 10 usuarios de prueba con nombres de jugadores.
- Los nombres de tabla y columnas van en minúscula y sin tilde (`codigo` y no `Código`), por lo mismo que `matematicas.php`.
- Arriba tiene `DROP TABLE IF EXISTS usuarios`, así se puede volver a importar sin que se queje por los nombres repetidos.

Para crearla: XAMPP con MySQL prendido, entrar a phpMyAdmin → Importar → `empresa.sql`.

### Actividad propuesta 3.4

"Escribe un fichero que reciba el código de un usuario y muestre por pantalla todos sus datos."

- `index.php` tiene el formulario con un solo campo, el código, y lo manda por POST a `usuario.php`.
- `usuario.php`:
  1. Arriba los datos de conexión como en el libro: `$cadena_conexion`, `$usuario`, `$clave`.
  2. Chequea con `isset` + `is_numeric` que el código sea un número.
  3. Se conecta con `new PDO(...)` dentro de un `try` / `catch`.
  4. Hace `SELECT * FROM usuarios WHERE codigo = $codigo` con `$bd->query()`.
  5. Si `rowCount()` da 0 avisa que no existe; si no, recorre el resultado con `foreach` y muestra código, nombre, clave y rol.

Si me preguntan:
- **¿Qué es PDO?** Una forma de trabajar con bases de datos desde PHP que sirve para varias (MySQL, SQLite...). Si cambio de base de datos, el código casi no cambia.
- **¿Por qué el `try` / `catch`?** Si no se puede conectar (por ejemplo MySQL apagado), `new PDO` lanza una `PDOException`. Con el `catch` la atrapo y muestro el error en vez de que la página explote.
- **¿Por qué `foreach` si viene un solo usuario?** Porque es como enseña el libro a recorrer lo que devuelve `query()`. Como `codigo` es clave primaria, el `foreach` da como mucho una vuelta.
- **¿Por qué `is_numeric` antes de la consulta?** Porque el código va metido directo en el SQL. Si no fuera un número, alguien podría escribir SQL en el campo (inyección SQL). En la página 80 el libro muestra `prepare()` y `execute()`, que es la forma buena de pasar parámetros.

## Ficheros3.8_29-10 · Actividades del 29/10

En la carpeta `Ficheros3.8_29-10` va todo lo que hicimos en clase el 29/10, cuando arrancamos la sección 3.8 Ficheros. Las actividades de ese día se llaman por su número (`Actividad1`, `Actividad2`...) y no por lo que hacen. Para saber qué es cada una sin leer el código, todos los PHP tienen arriba una anotación con el nombre de la actividad (por ejemplo `// ActividadColorFondo`) y una línea que dice qué hace.

### ActividadFichero · Probar las funciones de la sección 3.8 Ficheros

Páginas 86 a 92 del libro (la 43 a la 46 del PDF). Para arrancar con ficheros: un script por cada ejemplo del libro, con los mismos ficheros de prueba. `index.php` tiene un link a cada uno.

Ficheros de prueba:
- `fichero_ejemplo.txt`: dos líneas de texto.
- `matriz.txt`: la matriz de 4 filas y 4 columnas del libro, 4 números por línea separados por espacios.
- `empleados.xml`: un departamento (Marketing) con dos empleados, Ana y Antonio.
- `departamento.xsd`: el esquema para validar `empleados.xml`.
- `departamento.xslt`: la transformación que convierte el XML en una tabla HTML.

#### Ficheros de texto

- `ficheros_fopen.php`: `fopen($ruta, "r")` abre un fichero que existe y uno que no. Si no puede abrirlo devuelve `FALSE`, y por eso se compara con `=== FALSE`. Con el que no existe, PHP además muestra un Warning; según el libro, en producción no se mostraría.
- `ficheros_fgetc.php`: lee carácter a carácter con `fgetc()` dentro de `while (!feof($fich))`. `feof()` da TRUE al llegar al final. Al terminar, `fclose()`. En el navegador las dos líneas salen juntas, porque el salto de línea del fichero no es un `<br>`.
- `ficheros_fscanf.php`: lee `matriz.txt` con el formato `"%d %d %d %d"` de las dos maneras del libro:
  1. `$num = fscanf($fich, "%d %d %d %d")` devuelve un array con los 4 números.
  2. `fscanf($fich, "%d %d %d %d", $num1, $num2, $num3, $num4)` guarda los números en las variables.
  
  Entre las dos vueltas, `rewind($fich)` vuelve el indicador de posición al principio.
- `ficheros_contents.php`: `file_get_contents()` devuelve todo el fichero en una cadena y `file_put_contents()` escribe en `fichero_salida.txt`, que lo crea si no existe. No hace falta `fopen()` ni `fclose()`.

Modos de apertura (cuadro 3.1): `r` solo lectura; `r+` lectura y escritura (los dos devuelven FALSE si el fichero no existe); `w` y `w+` lo crean si no existe y, si existe, lo vacían; `a` y `a+` escriben siempre al final.

Otras funciones del cuadro 3.2: `fgets`, `fputs`, `fwrite`, `fread`, `fseek`, `ftell`, `copy`, `unlink` (borrar), `rename`, `filesize`, `is_file`, `is_dir`.

#### 3.8.1 Ficheros XML

- `xml_leer.php`: `simplexml_load_file()` devuelve un objeto `SimpleXMLElement`. Recorrido con `foreach`, da los hijos del raíz (cada `<empleado>`), y `print_r` los muestra.
- `xml_xpath.php`: `$datos->xpath("//edad")` se queda solo con los elementos `<edad>`.
- `xml_validar.php`: `DOMDocument` + `schemaValidate("departamento.xsd")` dice si el XML cumple el esquema.
- `xml_xslt.php`: carga el XML y la transformación con `DOMDocument`, crea un `XSLTProcessor`, lo asocia con `importStylesheet()` y transforma con `transformToXml()`. Sale la tabla con nombre, apellidos y edad.

Si me preguntan:
- **¿Por qué `=== FALSE` y no `== FALSE`?** `===` compara también el tipo. Así es seguro que `fopen()` falló y no que devolvió algo que PHP considera falso.
- **¿Para qué el `fclose()`?** Para cerrar el fichero cuando termino de usarlo y liberarlo.
- **¿Qué diferencia hay entre `w` y `a`?** `w` borra lo que había y escribe desde el principio; `a` mantiene lo que había y escribe al final.
- **¿Qué hace `rewind()`?** Vuelve el indicador de posición al principio del fichero, para leerlo de nuevo sin cerrarlo y abrirlo otra vez.

### Actividad1 · ActividadColorFondo

Ejercicio propuesto 1 del tema 3 (página 95 del libro, la 48 del PDF): "Crea una página web con un formulario para elegir el color de fondo. Almacena la elección del usuario con una cookie para que la siguiente vez que el usuario se conecte la página aparezca directamente con ese color."

Hecho como el ejemplo `contador_visitas.php` del apartado 3.3 Cookies (páginas 71-72). Es un solo archivo, `index.php`, con un formulario que se manda a sí mismo por POST:

1. Arriba de todo, antes del HTML, decide el color:
   - Si viene del formulario (`$_SERVER["REQUEST_METHOD"] == "POST"`), toma `$_POST["color"]` y lo guarda con `setcookie("color", $color, time() + 3600 * 24 * 30)`. Dura 30 días.
   - Si no, pero existe `$_COOKIE["color"]`, usa ese color. Es el caso de "la siguiente vez que se conecte".
   - Si no hay ninguna de las dos, es la primera vez y el fondo va blanco.
2. El color se pone en el `<body style="background-color: ...">`.
3. El formulario tiene un `<select>` con 11 colores (blanco, celeste, verde, amarillo, rosa, gris, naranja, morado, rojo, marrón y negro).

Si me preguntan:
- **¿Por qué `setcookie()` va antes del HTML?** Porque la cookie se manda en las cabeceras de la respuesta, y las cabeceras salen antes que la página. Si ya hice un `echo`, da error (el "Recuerda" de la página 71).
- **¿Por qué cuando mando el formulario uso `$_POST` y no `$_COOKIE`?** Porque la cookie recién creada no está en `$_COOKIE` hasta la siguiente petición, como dice el libro en la página 72. En esa misma carga todavía no existe.
- **¿Qué es `time() + 3600 * 24 * 30`?** La fecha en la que caduca. `time()` es ahora en segundos, y le sumo 30 días (3600 segundos por hora, por 24 horas, por 30 días).
- **¿Cómo la borro?** Con `setcookie("color", "", time() - 3600 * 24)`: una fecha que ya pasó. También se puede borrar desde el navegador.

### Actividad2 · ActividadZonaAdmin

Ejercicio propuesto 2 del tema 3 (página 96 del libro, la 48 del PDF): "Amplía el ejemplo de la sección 3.4 para que la página principal incluya un nuevo vínculo, 'Zona Admin', solo visible para los usuarios con rol 1."

Son los tres archivos del ejemplo de sesiones de la 3.4 (páginas 74 a 76), con los mismos nombres que en el libro:

- `sesiones1_login.php`: formulario de login que se manda a sí mismo. `comprobar_usuario()` hace de base de datos falsa: `usuario` / `1234` es rol 0 y `admin` / `1234` es rol 1. Devuelve un array con el nombre y el rol, o `FALSE`. Si el login va bien, hace `session_start()`, guarda el usuario en la sesión y redirige a la principal.
- `sesiones1_principal.php`: se une a la sesión. Si no existe `$_SESSION['usuario']`, manda al login con `?redirigido=true`. Si existe, muestra "Bienvenido" y el link Salir.
- `sesiones1_logout.php`: vacía `$_SESSION`, hace `session_destroy()`, borra la cookie de sesión y vuelve al login.

Lo nuevo son dos cosas:
1. En el login, además del nombre se guarda el rol: `$_SESSION['rol'] = $usu['rol'];`. El libro ya tenía el rol en `comprobar_usuario()` pero no lo guardaba en la sesión, así que la principal no podía saber quién era admin.
2. En la principal, el vínculo sale solo si `$_SESSION['rol'] == 1`.

Del escaneo corregí `$usu['rol'] = ;` (al admin le falta el 1), `ñame` y `valué` (son `name` y `value`).

Si me preguntan:
- **¿Por qué hay que guardar el rol en la sesión?** Porque la principal es otra petición y no ve las variables del login. Lo único que comparten las páginas es `$_SESSION`.
- **¿Esconder el link alcanza para proteger la zona admin?** No. Si alguien escribe `zona_admin.php` a mano, entra igual. Para protegerla, esa página tendría que controlar también `$_SESSION['rol']`. El ejercicio solo pide el vínculo, así que `zona_admin.php` no existe y el link da 404.
- **¿El logout borra el rol?** Sí: `$_SESSION = array()` vacía todas las variables de sesión, el rol incluido.

### Actividad3 · ActividadTablaUsuarios

Ejercicio propuesto 3 del tema 3 (página 96 del libro, la 48 del PDF): "Escribe un programa que muestre una tabla con los datos de la tabla Usuarios."

Usa la base `empresa` de `ActividadBD09-10` (la tabla `usuarios` con los 10 jugadores). Si no está creada, hay que importar `ActividadBD09-10/empresa.sql` en phpMyAdmin.

Hecho como el ejemplo de la 3.6.2 Recuperación y presentación de datos (página 79). Es un solo archivo, `index.php`:

1. Arriba, los datos de conexión como en el libro: `$cadena_conexion`, `$usuario` y `$clave`.
2. Dentro de un `try`, se conecta con `new PDO(...)` y hace `SELECT codigo, nombre, clave, rol FROM usuarios` con `$bd->query()`.
3. Arma una `<table border="3">` con la cabecera (Código y Nombre) y recorre el resultado con `foreach`: cada vuelta es una fila `<tr>` con un `<td>` por columna.
4. En el `catch (PDOException $e)` muestra "Error con la base de datos" y el mensaje. Por ejemplo, si MySQL está apagado.

Si me preguntan:
- **¿Qué devuelve `query()`?** Un objeto `PDOStatement` con el resultado, o `FALSE` si hubo un error. Se puede recorrer con `foreach` como si fuera un array.
- **¿Qué es `$row` en el `foreach`?** Una fila de la tabla, como un array cuyas claves son las columnas del `SELECT` (`$row['nombre']`, `$row['rol']`...).
- **¿Por qué pongo las columnas en el `SELECT` y no `*`?** Como el libro, así se ve en el código qué columnas trae y con qué claves se leen después. Con `*` funcionaría igual.
- **¿Por qué el `try` / `catch`?** Si no se puede conectar, `new PDO` lanza una `PDOException`. Con el `catch` se muestra el error en vez de que la página se rompa.

Lo simplifiqué: en la tabla quedan solo el código y el nombre (la clave y el rol no hace falta mostrarlos) y saqué el "Usuarios: 10" del `rowCount()`.

### Actividad4 · ActividadInsertarUsuario

Ejercicio propuesto 4 del tema 3 (página 96 del libro, la 48 del PDF): "Confecciona un formulario para insertar usuarios en la tabla Usuarios."

Hecho con el insert de la 3.6.3 Inserción, borrado y actualización (página 80) y la sentencia preparada de la 3.6.2 (página 80). Es un solo archivo, `index.php`, con el formulario arriba y la tabla de la Actividad3 abajo:

1. El formulario tiene nombre, clave y rol (un `<select>` con 0 = Usuario y 1 = Administrador) y se manda a sí mismo por POST. El código no se pide porque es autonumérico.
2. Se conecta con `new PDO(...)` dentro de un `try`.
3. Si viene del formulario, inserta con una sentencia preparada:
   ```php
   $ins = $bd->prepare("insert into usuarios(nombre, clave, rol) values(?, ?, ?)");
   $ins->execute(array($_POST['nombre'], $_POST['clave'], $_POST['rol']));
   ```
   Después muestra "insert correcto", las filas insertadas con `rowCount()` y el código que le dio MySQL con `$bd->lastInsertId()`, como el libro.
4. Abajo, la misma tabla que la Actividad3 (código y nombre, `border="3"`), así se ve al toque el usuario nuevo.

Si me preguntan:
- **¿Por qué `prepare()` y no `query()` como en el ejemplo del insert?** En el libro los valores del insert están escritos a mano. Acá vienen de un formulario, y si los meto directo en el SQL alguien podría escribir SQL en el campo (inyección SQL). El libro dice en la página 80 que las sentencias preparadas "previenen la inyección de código". Cada `?` se cambia, en orden, por un valor del array de `execute()`.
- **¿Qué hace `lastInsertId()`?** Devuelve el código autonumérico que MySQL le dio a la fila recién insertada.
- **¿Qué pasa si pongo un nombre que ya existe?** `nombre` es `UNIQUE`, así que el insert falla. En PHP 8, PDO lanza una `PDOException` en vez de devolver `FALSE`, y la agarra el `catch`: "Error con la base de datos: ... Duplicate entry 'Riquelme' for key 'nombre'". Por eso el `else print_r($bd->errorInfo())` del libro no hace falta: el libro es de antes de PHP 8, cuando el error no tiraba excepción.
- **¿Por qué ahí no sale la tabla?** Porque la excepción salta en el insert y va directo al `catch`, sin pasar por la consulta de la tabla.

## Cómo los probé

Con XAMPP prendido (Apache y MySQL), entrando por `http://localhost/daw2/WEBSERVICIO/...`.

- Actividad09-10: sin logearme, `compra.php` me manda al inicio. Logeado, me muestra los segundos que quedan. Pasado el tiempo, me manda al inicio y me sale el formulario de nuevo.
- Actividad 3.4: código `1` (Riquelme), `5` (Messi), `50` (no existe) y `abc` (error, no es un número).
- Ficheros3.8_29-10/ActividadFichero: cada link del `index.php`. `ficheros_fopen.php` tiene que mostrar el Warning del fichero que no existe, y `xml_validar.php` tiene que decir "El fichero es válido".
- Ficheros3.8_29-10/Actividad1 (ActividadColorFondo): la primera vez sale blanco. Elijo celeste, cierro la pestaña y vuelvo a entrar: sigue celeste. La cookie `color` se ve en las herramientas del navegador (F12 → Aplicación → Cookies).
- Ficheros3.8_29-10/Actividad2 (ActividadZonaAdmin): sin login, la principal me manda al login con "Haga login para continuar". Con `usuario` / `1234` sale Bienvenido y Salir, sin Zona Admin. Con `admin` / `1234` sale también Zona Admin. Con la clave mal sale "revise usuario y contraseña". Después de Salir, la principal me vuelve a mandar al login.
- Ficheros3.8_29-10/Actividad3 (ActividadTablaUsuarios): con MySQL prendido sale la tabla con el código y el nombre de los 10 jugadores. Con MySQL apagado sale "Error con la base de datos" y el motivo.
- Ficheros3.8_29-10/Actividad4 (ActividadInsertarUsuario): inserto Tevez / apache10 / Usuario y sale "insert correcto", "Filas insertadas: 1", "Código de la fila insertada: 11", y Tevez aparece abajo en la tabla (y en la Actividad3). Con un nombre repetido (Riquelme) sale el error de `Duplicate entry`.
