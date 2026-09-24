<?php
// actividad 2.2 del libro
$titulo = "Potencia";
require "../comun/cabecera.php";

// el exponente es opcional, si no se pasa vale 2
function potencia($base, $exponente = 2)
{
    $resultado = 1;
    for ($i = 0; $i < $exponente; $i++) {
        $resultado = $resultado * $base;
    }
    return $resultado;
}

echo potencia(5) . "<br>";
echo potencia(2, 4) . "<br>";
echo potencia(7, 0) . "<br>";

require "../comun/pie.php";
?>
