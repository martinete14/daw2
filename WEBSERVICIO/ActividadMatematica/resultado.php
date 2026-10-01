<?php
// mejora para el futuro: si alguien entra directo sin pasar por el formulario, lo mando de vuelta
// if ($_SERVER["REQUEST_METHOD"] != "POST") {
//     header("Location: index.html");
//     exit;
// }

$a = $_POST["a"];
$b = $_POST["b"];
$c = $_POST["c"];

$titulo = "Raíces de la función cuadrática";
require "../comun/cabecera.php";

echo "<p>Función: " . htmlspecialchars("f(x) = {$a}x² + {$b}x + {$c}") . "</p>";

if (!is_numeric($a) || !is_numeric($b) || !is_numeric($c)) {
    echo "<p class='error'>Error: los tres valores tienen que ser números. Volvé y fijate qué cargaste.</p>";
} elseif ($a == 0) {
    echo "<p class='error'>Error: A no puede valer 0, porque ahí ya no es una función cuadrática (sería una lineal).</p>";
} else {
    // primero saco el discriminante, que me dice cuántas raíces tiene
    $discriminante = $b * $b - 4 * $a * $c;

    if ($discriminante < 0) {
        echo "<p class='error'>Error: esta función no tiene raíces reales (el discriminante da negativo).</p>";
    } elseif ($discriminante == 0) {
        $x = -$b / (2 * $a);
        echo "<p class='ok'>La función tiene una raíz doble: x = $x</p>";
    } else {
        // aplico la resolvente: x = (-b ± √discriminante) / 2a
        $x1 =(-$b + sqrt($discriminante)) / (2 * $a);
        $x2 = (-$b - sqrt($discriminante)) / (2 * $a);
        echo "<p class='ok'>La función tiene dos raíces: x1 = $x1 y x2 = $x2</p>";
    }
}

echo "<a href='index.html'>Probar con otros valores</a>";
require "../comun/pie.php";
