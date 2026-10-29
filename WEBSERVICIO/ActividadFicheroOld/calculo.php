<?php
// lee notas.txt (Nombre Apellido;Nota) y devuelve un array nombre => nota
function leerNotas($fichero)
{
    $notas = [];
    // file me devuelve un array con cada línea del fichero
    $lineas = file($fichero, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lineas as $linea) {
        // corto la línea en el ; y me queda [nombre, nota]
        $partes = explode(";", $linea);
        $notas[trim($partes[0])] = trim($partes[1]);
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

$titulo = "Notas menores o iguales al límite";
require "../comun/cabecera.php";

if (!isset($_POST["limite"]) || !is_numeric($_POST["limite"])) {
    echo "<p class='error'>Error: el límite tiene que ser un número.</p>";
} else {
    $limite = $_POST["limite"];
    $notas = leerNotas("notas.txt");
    $menores = notasMenoresOIguales($notas, $limite);

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
