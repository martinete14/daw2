<?php
// el enunciado dice matemáticas.php pero le saqué la tilde,
// los nombres de archivo con tilde a veces dan problemas en el servidor

// la misma función del ejercicio 2 (ActividadFuncionCuadratica), ahora sola en su fichero
// para poder incluirla en cualquier página que la necesite
function resolverEcuacion($a, $b, $c)
{
    // por las dudas: con a = 0 no es de segundo grado y además dividiría por cero
    if ($a == 0) {
        return false;
    }

    $discriminante = $b * $b - 4 * $a * $c;

    if ($discriminante < 0) {
        return false;
    }

    if ($discriminante == 0) {
        // raíz doble, el array tiene una sola solución
        return [-$b / (2 * $a)];
    }

    $x1 = (-$b + sqrt($discriminante)) / (2 * $a);
    $x2 = (-$b - sqrt($discriminante)) / (2 * $a);
    return [$x1, $x2];
}
