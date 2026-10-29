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

## ActividadColorFondo · Color de fondo con cookie

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

## Ficheros3.8_29-10 · ActividadFichero: probar las funciones de la sección 3.8 Ficheros

En la carpeta `Ficheros3.8_29-10` van todas las actividades de la sección 3.8 Ficheros, que arrancamos en clase el 29/10.

Páginas 86 a 92 del libro (la 43 a la 46 del PDF). Para arrancar con ficheros: un script por cada ejemplo del libro, con los mismos ficheros de prueba. `index.php` tiene un link a cada uno.

Ficheros de prueba:
- `fichero_ejemplo.txt`: dos líneas de texto.
- `matriz.txt`: la matriz de 4 filas y 4 columnas del libro, 4 números por línea separados por espacios.
- `empleados.xml`: un departamento (Marketing) con dos empleados, Ana y Antonio.
- `departamento.xsd`: el esquema para validar `empleados.xml`.
- `departamento.xslt`: la transformación que convierte el XML en una tabla HTML.

### Ficheros de texto

- `ficheros_fopen.php`: `fopen($ruta, "r")` abre un fichero que existe y uno que no. Si no puede abrirlo devuelve `FALSE`, y por eso se compara con `=== FALSE`. Con el que no existe, PHP además muestra un Warning; según el libro, en producción no se mostraría.
- `ficheros_fgetc.php`: lee carácter a carácter con `fgetc()` dentro de `while (!feof($fich))`. `feof()` da TRUE al llegar al final. Al terminar, `fclose()`. En el navegador las dos líneas salen juntas, porque el salto de línea del fichero no es un `<br>`.
- `ficheros_fscanf.php`: lee `matriz.txt` con el formato `"%d %d %d %d"` de las dos maneras del libro:
  1. `$num = fscanf($fich, "%d %d %d %d")` devuelve un array con los 4 números.
  2. `fscanf($fich, "%d %d %d %d", $num1, $num2, $num3, $num4)` guarda los números en las variables.
  
  Entre las dos vueltas, `rewind($fich)` vuelve el indicador de posición al principio.
- `ficheros_contents.php`: `file_get_contents()` devuelve todo el fichero en una cadena y `file_put_contents()` escribe en `fichero_salida.txt`, que lo crea si no existe. No hace falta `fopen()` ni `fclose()`.

Modos de apertura (cuadro 3.1): `r` solo lectura; `r+` lectura y escritura (los dos devuelven FALSE si el fichero no existe); `w` y `w+` lo crean si no existe y, si existe, lo vacían; `a` y `a+` escriben siempre al final.

Otras funciones del cuadro 3.2: `fgets`, `fputs`, `fwrite`, `fread`, `fseek`, `ftell`, `copy`, `unlink` (borrar), `rename`, `filesize`, `is_file`, `is_dir`.

### 3.8.1 Ficheros XML

- `xml_leer.php`: `simplexml_load_file()` devuelve un objeto `SimpleXMLElement`. Recorrido con `foreach`, da los hijos del raíz (cada `<empleado>`), y `print_r` los muestra.
- `xml_xpath.php`: `$datos->xpath("//edad")` se queda solo con los elementos `<edad>`.
- `xml_validar.php`: `DOMDocument` + `schemaValidate("departamento.xsd")` dice si el XML cumple el esquema.
- `xml_xslt.php`: carga el XML y la transformación con `DOMDocument`, crea un `XSLTProcessor`, lo asocia con `importStylesheet()` y transforma con `transformToXml()`. Sale la tabla con nombre, apellidos y edad.

Si me preguntan:
- **¿Por qué `=== FALSE` y no `== FALSE`?** `===` compara también el tipo. Así es seguro que `fopen()` falló y no que devolvió algo que PHP considera falso.
- **¿Para qué el `fclose()`?** Para cerrar el fichero cuando termino de usarlo y liberarlo.
- **¿Qué diferencia hay entre `w` y `a`?** `w` borra lo que había y escribe desde el principio; `a` mantiene lo que había y escribe al final.
- **¿Qué hace `rewind()`?** Vuelve el indicador de posición al principio del fichero, para leerlo de nuevo sin cerrarlo y abrirlo otra vez.

## Cómo los probé

Con XAMPP prendido (Apache y MySQL), entrando por `http://localhost/daw2/WEBSERVICIO/...`.

- Actividad09-10: sin logearme, `compra.php` me manda al inicio. Logeado, me muestra los segundos que quedan. Pasado el tiempo, me manda al inicio y me sale el formulario de nuevo.
- Actividad 3.4: código `1` (Riquelme), `5` (Messi), `50` (no existe) y `abc` (error, no es un número).
- Ficheros3.8_29-10/ActividadFichero: cada link del `index.php`. `ficheros_fopen.php` tiene que mostrar el Warning del fichero que no existe, y `xml_validar.php` tiene que decir "El fichero es válido".
- ActividadColorFondo: la primera vez sale blanco. Elijo celeste, cierro la pestaña y vuelvo a entrar: sigue celeste. La cookie `color` se ve en las herramientas del navegador (F12 → Aplicación → Cookies).
