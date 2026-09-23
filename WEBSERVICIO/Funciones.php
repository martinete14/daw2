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
