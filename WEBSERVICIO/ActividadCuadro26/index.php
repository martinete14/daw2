<?php
$titulo = "Funciones del cuadro 2.6";
require "../comun/cabecera.php";

// var_export con true me devuelve el valor como texto, así se ve true/false
// (con echo, true sale como 1 y false no sale nada)

// ----- funciones de variables -----
$jugador = "Riquelme";
$nada = null;
$vacio = "";
$texto = "10.5";

echo "<h2>Funciones de variables</h2>";
echo "<ul class='resultados'>";
echo "<li>isset(\$jugador): " . var_export(isset($jugador), true) . "</li>";
echo "<li>isset(\$noExiste): " . var_export(isset($noExiste), true) . "</li>";
echo "<li>is_null(\$nada): " . var_export(is_null($nada), true) . "</li>";
echo "<li>empty(\$vacio): " . var_export(empty($vacio), true) . "</li>";
echo "<li>empty(\$jugador): " . var_export(empty($jugador), true) . "</li>";
echo "<li>is_int(10): " . var_export(is_int(10), true) . "</li>";
echo "<li>is_float(10.5): " . var_export(is_float(10.5), true) . "</li>";
echo "<li>is_bool(false): " . var_export(is_bool(false), true) . "</li>";
echo "<li>is_array(\$jugador): " . var_export(is_array($jugador), true) . "</li>";
echo "<li>intval(\"10.5\"): " . var_export(intval($texto), true) . "</li>";
echo "<li>floatval(\"10.5\"): " . var_export(floatval($texto), true) . "</li>";
echo "<li>boolval(\"0\"): " . var_export(boolval("0"), true) . "</li>";
echo "<li>strval(10): " . var_export(strval(10), true) . "</li>";
echo "</ul>";

// ----- funciones de cadenas -----
$nombre = "Juan Román Riquelme";

echo "<h2>Funciones de cadenas</h2>";
echo "<ul class='resultados'>";
// da 20 y no 19 porque la á ocupa 2 bytes (lo mismo que en el palíndromo)
echo "<li>strlen(\"$nombre\"): " . strlen($nombre) . "</li>";
echo "<li>explode(\" \", ...): " . implode(" | ", explode(" ", $nombre)) . "</li>";
echo "<li>implode(\", \", ...): " . implode(", ", ["Robben", "Vegetti", "Zidane"]) . "</li>";
echo "<li>strcmp(\"Aimar\", \"Zidane\"): " . strcmp("Aimar", "Zidane") . "</li>";
echo "<li>strcmp(\"Zidane\", \"Aimar\"): " . strcmp("Zidane", "Aimar") . "</li>";
echo "<li>strcmp(\"Pirlo\", \"Pirlo\"): " . strcmp("Pirlo", "Pirlo") . "</li>";
echo "<li>strtolower(\"PALERMO\"): " . strtolower("PALERMO") . "</li>";
echo "<li>strtoupper(\"palermo\"): " . strtoupper("palermo") . "</li>";
// en el cuadro dice str() pero la función se llama strstr()
echo "<li>strstr(\"$nombre\", \"Román\"): " . var_export(strstr($nombre, "Román"), true) . "</li>";
echo "<li>strstr(\"$nombre\", \"Messi\"): " . var_export(strstr($nombre, "Messi"), true) . "</li>";
echo "</ul>";

// ----- funciones de arrays -----
$notas = ["Robben" => 8.5, "Vegetti" => 7, "Riquelme" => 10, "Balotelli" => 2];
$numeros = [7, 3, 9, 1, 5];

// sort y ksort cambian el array original, por eso ordeno copias
$porClave = $notas;
ksort($porClave);
$porClaveDesc = $notas;
krsort($porClaveDesc);
$ordenados = $numeros;
sort($ordenados);
$ordenadosDesc = $numeros;
rsort($ordenadosDesc);

echo "<h2>Funciones de arrays</h2>";
echo "<p>\$numeros = " . implode(", ", $numeros) . "</p>";
echo "<p>\$notas = Robben 8.5, Vegetti 7, Riquelme 10, Balotelli 2</p>";
echo "<ul class='resultados'>";
echo "<li>ksort(\$notas): " . implode(", ", array_keys($porClave)) . "</li>";
echo "<li>krsort(\$notas): " . implode(", ", array_keys($porClaveDesc)) . "</li>";
echo "<li>sort(\$numeros): " . implode(", ", $ordenados) . "</li>";
echo "<li>rsort(\$numeros): " . implode(", ", $ordenadosDesc) . "</li>";
echo "<li>array_values(\$notas): " . implode(", ", array_values($notas)) . "</li>";
echo "<li>array_keys(\$notas): " . implode(", ", array_keys($notas)) . "</li>";
// en el cuadro está al revés: primero va la clave y después el array
echo "<li>array_key_exists(\"Riquelme\", \$notas): " . var_export(array_key_exists("Riquelme", $notas), true) . "</li>";
echo "<li>array_key_exists(\"Messi\", \$notas): " . var_export(array_key_exists("Messi", $notas), true) . "</li>";
echo "<li>count(\$notas): " . count($notas) . "</li>";
echo "</ul>";

require "../comun/pie.php";
