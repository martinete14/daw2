<?php
// actividad 2.3 del libro
$titulo = "Factorial";
require "../comun/cabecera.php";

// devuelve el factorial o -1 si el numero no es valido
function factorial($numero)
{
    if (!is_int($numero) || $numero < 0) {
        return -1;
    }
    $resultado = 1;
    for ($i = 1; $i <= $numero; $i++) {
        $resultado = $resultado * $i;
    }
    return $resultado;
}

echo factorial(5) . "<br>";
echo factorial(0) . "<br>";
echo factorial(-3) . "<br>";
echo factorial("hola") . "<br>";

require "../comun/pie.php";
?>
