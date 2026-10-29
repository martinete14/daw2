<?php
$fich = fopen("matriz.txt", "r");
if ($fich === FALSE) {
    echo "No se encuentra el fichero o no se pudo leer<br>";
} else {
    // primera manera: fscanf() devuelve un array con los 4 números de la línea
    while (!feof($fich)) {
        $num = fscanf($fich, "%d %d %d %d");
        echo "$num[0] $num[1] $num[2] $num[3] <br>";
    }

    // vuelvo el indicador de posición al principio del fichero
    rewind($fich);
    echo "<br>";

    // segunda manera: fscanf() guarda los números en las variables
    while (!feof($fich)) {
        $num = fscanf($fich, "%d %d %d %d", $num1, $num2, $num3, $num4);
        echo "$num1 $num2 $num3 $num4 <br>";
    }
    fclose($fich);
}
