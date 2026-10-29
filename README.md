# DAW2

Mis cosas de 2º de DAW en ILERNA. Lo subo todo acá para poder seguir en la PC de casa lo que empecé en clase, y al revés, porque este año no tengo laptop.

Una carpeta por asignatura, y va creciendo a medida que avanzo.

- `PYTHON`: lo de Python. El hola mundo y `actividad_10_programas`, diez programas sueltos con variables, `input()`, operadores y f-strings (sin `if` ni bucles porque todavía no los vimos).
- `WEBCLIENTE`: JavaScript en el navegador. Una carpeta por actividad:
  - `EjercicioBOTON`: un botón que cuenta los clics y cambia la foto de fondo.
  - `ValidacionDeFormularios`: formulario de inscripción a un gimnasio con validación nativa de HTML y reglas propias en JavaScript.
  - `ActividadContraseña`: generador y evaluador de contraseñas, con Vite.
  - `ActividadSessionStorage`: la primera versión del login con sessionStorage y el carrito de yerbas, con Vite.
  - `TiendaYerbas`: la versión que entregué de la actividad de sessionStorage y localStorage. Login con 3 usuarios de prueba, catálogo de yerbas sacado de `data/productos.json`, carrito en el sessionStorage e inventario en el localStorage que se actualiza entre pestañas. Se abre con Live Server; el detalle está en su README.
- `WEBSERVICIO`: la otra pata, PHP del lado del servidor con formularios. Sin JavaScript, eso ya está en WEBCLIENTE. Una carpeta por actividad:
  - Tema 2: `ActividadNumeros` (formulario de 5 números), `ActividadDNI` (buscar un DNI en un array), `ActividadFuncionesAnonimas`, `ActividadPotencia` (2.2 del libro) y `ActividadFactorial` (2.3 del libro). De los ejercicios propuestos: `ActividadMatematica` (ej. 1, raíces de la cuadrática, la hicimos en clase), `ActividadFuncionCuadratica` (ej. 2, lo mismo pero con una función que devuelve un array o false), `ActividadIncluir` (ej. 3, la función en `matematicas.php` y una página que la incluye), `ActividadPalindromo` (ej. 4) y `ActividadLimite` (ej. 5, quedarse con los números menores que un límite). Además `ActividadCuadro26` (funciones útiles del cuadro 2.6) y `ActividadFicheroOld` (ejercicio extra: leer alumnos de un fichero y filtrarlos con un formulario).
  - Tema 3: `Actividad09-10` (login con sesión, el usuario arriba a la derecha y una compra con tiempo límite) y `ActividadBD09-10` (base de datos `empresa` con 10 usuarios y buscar uno por código). `ActividadColorFondo` (ej. 1 del tema 3, formulario para elegir el color de fondo que se guarda en una cookie). En `Ficheros3.8_29-10` van las actividades de la sección 3.8 Ficheros que arrancamos el 29/10: por ahora `ActividadFichero`, un script por cada ejemplo del libro, de `fopen` y `fscanf` hasta XML con XPath, XSD y XSLT. `ActividadConjunta`: clonada del repo de mi compañero ([Skyfreefury/PHP](https://github.com/Skyfreefury/PHP), carpeta `act_conjunta`), microservicios de sumar y restar protegidos con token, con su propia base de datos `microservicios` (`basedatos/script.sql`). Yo le agregué el microservicio de historial (guarda cada operación y `cliente/historial.php` las lista) y mi compañero hace multiplicar y dividir. La idea es que cada uno vea el trabajo del otro desde su IP.
  - En `comun` están la cabecera, el pie y los estilos que usan todas. En `APUNTES_TEMA2.md` y `APUNTES_TEMA3.md` anoto qué hice en cada actividad y cómo explicarlo.
- `INGLES_TECNICO`: inglés técnico. `SuperSearch` es el prototipo web del pitch *My First App Idea* que hicimos con Jesús y Cristina: elegís una receta y te compara cuánto sale la compra en cada supermercado.
- `INTERFAZ`: diseño de interfaces web. Por ahora el inicio de sesión y recuperar contraseña en HTML crudo, con logo y favicon.
- `IPE`: Itinerario Personal para la Empleabilidad. No es de programar, pero la pongo para tener todo junto. Por ahora está mi CV.
- `DESPLIEGUE`: despliegue de aplicaciones web. Por ahora vacía, solo el README.
- `TFG`: el Trabajo de Fin de Grado. Por ahora vacía, solo el README.
