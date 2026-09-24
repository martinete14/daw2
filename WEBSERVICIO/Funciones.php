<?php
function obtenerMinimo($numeros)
{
    $minimo = $numeros[0];
    foreach ($numeros as $n) {
        if ($n < $minimo) {
            $minimo = $n;
        }
    }
    return $minimo;
}

function obtenerMaximo($numeros)
{
    $maximo = $numeros[0];
    foreach ($numeros as $n) {
        if ($n > $maximo) {
            $maximo = $n;
        }
    }
    return $maximo;
}

function obtenerMedia($numeros)
{
    return array_sum($numeros) / count($numeros);
}

// actividad 2.2: si no me pasan el exponente, vale 2 (elevar al cuadrado)
function potencia($base, $exponente = 2)
{
    $resultado = 1;
    for ($i = 0; $i < $exponente; $i++) {
        $resultado = $resultado * $base;
    }
    return $resultado;
}

// actividad 2.3: devuelve el factorial o -1 si el argumento no es válido
// (tiene que ser un número entero y no negativo)
function factorial($n)
{
    if (!is_numeric($n) || $n < 0 || floor($n) != $n) {
        return -1;
    }
    $resultado = 1;
    for ($i = 2; $i <= $n; $i++) {
        $resultado = $resultado * $i;
    }
    return $resultado;
}

// busca por clave: el DNI es la clave del array y el nombre es el valor
// si no está, devuelvo null
function buscarPorDni($dni, $personas)
{
    if (array_key_exists($dni, $personas)) {
        return $personas[$dni];
    }
    return null;
}
