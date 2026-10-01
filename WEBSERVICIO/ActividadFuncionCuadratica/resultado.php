<?php
// la mejora que quedó comentada en ActividadMatematica: si entran directo sin el formulario, los mando de vuelta
if ($_SERVER["REQUEST_METHOD"] != "POST") {
    header("Location: index.html");
    exit;
}

// recibe los coeficientes y devuelve un array con las soluciones,
// o false si no hay soluciones reales
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

$a = $_POST["a"];
$b = $_POST["b"];
$c = $_POST["c"];

$titulo = "Soluciones de la ecuación";
require "../comun/cabecera.php";

echo "<p>Ecuación: " . htmlspecialchars("{$a}x² + {$b}x + {$c} = 0") . "</p>";

if (!is_numeric($a) || !is_numeric($b) || !is_numeric($c)) {
    echo "<p class='error'>Error: los tres coeficientes tienen que ser números. Volvé y fijate qué cargaste.</p>";
} elseif ($a == 0) {
    echo "<p class='error'>Error: A no puede valer 0, porque ahí la ecuación ya no es de segundo grado.</p>";
} else {
    $soluciones = resolverEcuacion($a, $b, $c);

    // con === me aseguro de que sea false de verdad y no otra cosa que PHP tome como false
    if ($soluciones === false) {
        echo "<p class='error'>Error: la ecuación no tiene soluciones reales.</p>";
    } else {
        if (count($soluciones) == 1) {
            echo "<p class='ok'>La ecuación tiene una sola solución (raíz doble):</p>";
        } else {
            echo "<p class='ok'>La ecuación tiene dos soluciones:</p>";
        }

        // recorro el array que me devolvió la función
        echo "<ul class='resultados'>";
        foreach ($soluciones as $x) {
            echo "<li>x = $x</li>";
        }
        echo "</ul>";
    }
}

echo "<a href='index.html'>Probar con otros valores</a>";
require "../comun/pie.php";
