<?php
// ActividadFichero
// Ejemplo de la 3.8: leer un fichero carácter a carácter con fgetc() y feof()

$fich = fopen("fichero_ejemplo.txt", "r");
if ($fich === FALSE) {
    echo "No se encuentra el fichero o no se pudo leer<br>";
} else {
    // feof() da TRUE cuando se llega al final del fichero
    while (!feof($fich)) {
        // fgetc() devuelve el siguiente carácter y avanza el indicador de posición
        $car = fgetc($fich);
        echo $car;
    }
    fclose($fich);
}
