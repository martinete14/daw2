<?php
// ActividadFichero
// Ejemplo de la 3.8: leer y escribir ficheros con file_get_contents() y file_put_contents()

// funcionan directamente con la ruta, sin fopen() ni fclose()
$contenido = file_get_contents("fichero_ejemplo.txt");
echo "Contenido del fichero: $contenido<br>";

$res = file_put_contents("fichero_salida.txt", "Fichero creado con file_put_contents");
if ($res) {
    echo "Fichero creado con éxito";
} else {
    echo "Error al crear el fichero";
}
