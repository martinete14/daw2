# Apuntes ejercicios propuestos tema 2

Para acordarme qué hice en cada uno y cómo explicarlo si me preguntan.

Todos siguen la idea del ejercicio 1 (`ActividadMatematica`) que hicimos con Fran: en vez de un script con los valores fijos, un formulario que manda los datos a PHP, PHP valida y muestra el resultado en los cuadritos `ok` / `error`. Cabecera, pie y estilos salen de `comun`.

## Ej. 2 · ActividadFuncionCuadratica

- `index.html` manda A, B y C por POST a `resultado.php`, igual que en el 1.
- La diferencia: la cuenta ahora la hace `resolverEcuacion($a, $b, $c)`, que devuelve un array con las soluciones o `false` si no hay soluciones reales.
  - Discriminante negativo → `false`
  - Discriminante 0 → array con 1 solución (raíz doble)
  - Discriminante positivo → array con 2 soluciones
- La página recorre el array con `foreach` y usa `count()` para saber si es raíz doble o dos soluciones.
- Puse el chequeo de `REQUEST_METHOD` que en el 1 quedó comentado: si entrás directo a `resultado.php` sin pasar por el formulario, te manda a `index.html`.

Si me preguntan:
- **¿Por qué `=== false` y no `== false`?** Con `===` compara también el tipo, así me aseguro de que sea `false` de verdad y no otra cosa que PHP tome como falsa (un 0, un array vacío...).
- **¿Por qué la función chequea `a == 0` si la página ya lo chequea antes?** La página lo chequea para mostrar un mensaje claro. La función lo chequea por si la llaman desde otro lado (como en el ej. 3), para que no divida por cero.

## Ej. 3 · ActividadIncluir

- `matematicas.php` tiene solamente la función `resolverEcuacion`, la misma del ej. 2.
- `index.php` la trae con `require "matematicas.php";` y la usa. El formulario se manda a la misma página.
- Para mostrar las soluciones usé `implode`, que junta los elementos del array en un texto.

Si me preguntan:
- **¿Por qué `matematicas.php` sin tilde si el enunciado dice `matemáticas.php`?** Los nombres de archivo con tilde a veces dan problemas en el servidor. Está comentado en el archivo.
- **¿`require` o `include`?** Hacen lo mismo, pero si el archivo no existe, `require` corta con un error fatal y `include` solo tira un warning y sigue. Prefiero que corte ahí y no que siga y falle más abajo con un error raro.

## Ej. 4 · ActividadPalindromo

- `esPalindromo($cadena)` devuelve `true` o `false`:
  1. Pasa todo a minúsculas con `mb_strtolower`.
  2. Saca espacios, comas y puntos, y cambia las vocales con tilde por la vocal sola (`str_replace` con arrays).
  3. Compara la primera letra con la última, la segunda con la anteúltima, y así hasta la mitad. Si alguna no coincide → `false`.
- Lo que escribe el usuario lo muestro con `htmlspecialchars` para que no se pueda meter HTML.

Si me preguntan:
- **¿Por qué `mb_strlen` / `mb_substr` y no `strlen` / `substr`?** La ñ y las letras con tilde ocupan 2 bytes, y las funciones normales cuentan bytes, no letras. Con las `mb_` "Añora la roña" da bien.
- **¿Por qué el `for` llega hasta `$largo / 2`?** Porque cada vuelta compara una letra de cada punta. A la mitad ya comparé todas.
- Ejemplos que dan palíndromo: Neuquén, Anita lava la tina, Dábale arroz a la zorra el abad, Somos o no somos.

## Ej. 5 · ActividadLimite

- El usuario carga números separados por coma y un límite.
- `explode(",", ...)` corta el texto en cada coma y me da un array. Con `trim` le saco los espacios a cada pedazo y con `is_numeric` me fijo que sea número.
- `menoresQueLimite($numeros, $limite)` recorre el array con `foreach` y arma uno nuevo solo con los menores (`$menores[] = $n;` agrega al final).
- Si en la lista hay algo que no es número, o el límite no es número → error. Si ninguno es menor → lo aviso.

## Ej. 6 · PENDIENTE

"Escribe un script para probar las funciones del cuadro 2.6". Me falta saber qué funciones trae el cuadro 2.6 del libro (Ganzábal, Síntesis): está entre Operadores (pág. 42) y Funciones predefinidas (pág. 48). Sacarle foto y hacerlo con el mismo estilo que los demás.

## Cómo los probé

Con XAMPP prendido: `http://localhost/...` apuntando a la carpeta de cada actividad. Casos que probé en el 2 y el 3: `1, -5, 6` (dos raíces: 3 y 2), `1, 2, 1` (raíz doble: -1), `1, 0, 1` (sin soluciones reales), `0, 2, 3` (error por A = 0).

## Ejercicio EXTRA · FicheroEjercicioEXTRA (carpeta `ActividadFichero`)

El que puso Fran en 3 fases: **FICHERO / FORM / CÁLCULO**.

Son 3 archivos, uno por fase:

- **FICHERO**: `notas.txt`. Primero eran solo las notas; la mejora es que cada línea tenga `Nombre Apellido;Nota`.
- **FORM**: `index.php` con un solo campo, el **límite**, que se manda por POST a `calculo.php`.
- **CÁLCULO**: `calculo.php` es la fachada. Recibe el límite, lo valida (número entre 0 y 10), lee el fichero, lo pasa a un array y muestra los alumnos con nota **menor o igual** al límite.
  - `leerNotas` usa `file()`, que devuelve un array con cada línea del fichero. Corta cada línea con `explode(";", ...)` y arma un array asociativo `nombre => nota`.
  - `notasMenoresOIguales` recorre ese array con `foreach` y arma uno nuevo solo con los que cumplen `<= $limite`.
- Si entrás directo a `calculo.php` sin pasar por el form, te manda a `index.php` (chequeo de `REQUEST_METHOD`).

Si me preguntan:
- **¿Qué hacen `FILE_IGNORE_NEW_LINES` y `FILE_SKIP_EMPTY_LINES`?** La primera le saca el salto de línea a cada elemento del array, y la segunda se saltea las líneas vacías (por ejemplo, la última del fichero).
- **¿Por qué un array asociativo?** Para que cada nota quede pegada al nombre del alumno. Con `foreach ($alumnos as $nombre => $nota)` saco las dos cosas juntas.
- **¿Por qué `htmlspecialchars` en el nombre?** Porque viene de un fichero y no sé qué tiene escrito. Así no se cuela HTML en la página.
- **¿Por qué `file_exists` antes de leer?** Si el fichero no está, `file()` tira un warning feo. Así muestro un error claro.

En el fichero puse 15 alumnos con nombres de jugadores de fútbol (Robben, Vegetti, Riquelme, Zidane...).

Casos que probé: límite `5` (Germán Denis 4, Teófilo Gutiérrez 3.5, Rodrigo Palacio 5, Mario Balotelli 2 y Lucas Pratto 4.5), `0` (ninguna), `abc` y `11` (error por el límite).
