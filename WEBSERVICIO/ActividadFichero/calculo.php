<?php
// si entran directo sin pasar por el form, los mando de vuelta
if ($_SERVER["REQUEST_METHOD"] != "POST") {
    header("Location: index.php");
    exit;
}

// lee notas.txt (Nombre Apellido;Nota) y devuelve un array nombre => nota
function leerNotas($fichero)
{
    $notas = [];
    // file me devuelve un array con cada línea del fichero
    $lineas = file($fichero, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lineas as $linea) {
        // corto la línea en el ; y me queda [nombre, nota]
        $partes = explode(";", $linea);
        if (count($partes) == 2 && is_numeric(trim($partes[1]))) {
            $notas[trim($partes[0])] = trim($partes[1]);
        }
    }
    return $notas;
}

// arma un array nuevo solo con los alumnos que tienen nota menor o igual al límite
function notasMenoresOIguales($notas, $limite)
{
    $resultado = [];
    foreach ($notas as $nombre => $nota) {
        if ($nota <= $limite) {
            $resultado[$nombre] = $nota;
        }
    }
    return $resultado;
}

$limite = $_POST["limite"];

$titulo = "Notas menores o iguales al límite";
require "../comun/cabecera.php";

if (!is_numeric($limite) || $limite < 0 || $limite > 10) {
    echo "<p class='error'>Error: el límite tiene que ser un número entre 0 y 10.</p>";
} elseif (!file_exists("notas.txt")) {
    echo "<p class='error'>Error: no encuentro notas.txt en la carpeta.</p>";
} else {
    $notas = leerNotas("notas.txt");
    $menores = notasMenoresOIguales($notas, $limite);

    echo "<p>Notas del fichero: " . implode(", ", $notas) . "</p>";

    if (count($menores) == 0) {
        echo "<p class='error'>Ningún alumno tiene nota menor o igual que $limite</p>";
    } else {
        echo "<p class='ok'>Alumnos con nota menor o igual que $limite:</p>";
        echo "<ul class='resultados'>";
        foreach ($menores as $nombre => $nota) {
            echo "<li>" . htmlspecialchars($nombre) . ": $nota</li>";
        }
        echo "</ul>";
    }
}

echo "<a href='index.php'>Probar con otro límite</a>";
require "../comun/pie.php";
