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

## Cómo los probé

Con XAMPP prendido (Apache y MySQL), entrando por `http://localhost/daw2/WEBSERVICIO/...`.

- Actividad09-10: sin logearme, `compra.php` me manda al inicio. Logeado, me muestra los segundos que quedan. Pasado el tiempo, me manda al inicio y me sale el formulario de nuevo.
- Actividad 3.4: código `1` (Riquelme), `5` (Messi), `50` (no existe) y `abc` (error, no es un número).
