<?php
// ActividadFichero
// Ejemplo de la 3.8: fopen() con un fichero que existe y otro que no

// fopen() devuelve FALSE si no puede abrir el fichero,
// si no, devuelve el puntero para manejarlo
$fich = fopen("fichero_ejemplo.txt", "r");
if ($fich === FALSE) {
    echo "No se encuentra fichero_ejemplo.txt<br>";
} else {
    echo "fichero_ejemplo.txt se abrió con éxito<br>";
}

// este no existe: además del mensaje, PHP muestra un Warning
$fich = fopen("fichero_no_existe.txt", "r");
if ($fich === FALSE) {
    echo "No se encuentra fichero_no_existe.txt<br>";
} else {
    echo "fichero_no_existe.txt se abrió con éxito<br>";
}
