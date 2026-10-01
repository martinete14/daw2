<?php
// traigo la función desde matematicas.php
// uso require y no include porque si el fichero no está prefiero que corte acá y no siga con un error raro más abajo
require "matematicas.php";

$titulo = "Usando matematicas.php";
require "../comun/cabecera.php";
?>
    <p>La función que resuelve la ecuación está en matematicas.php, esta página solo la incluye y la usa</p>

    <form action="index.php" method="post">
      <div class="campo">
        <label for="a">Coeficiente A</label>
        <input type="number" id="a" name="a" step="any" required>
      </div>

      <div class="campo">
        <label for="b">Coeficiente B</label>
        <input type="number" id="b" name="b" step="any" required>
      </div>

      <div class="campo">
        <label for="c">Coeficiente C</label>
        <input type="number" id="c" name="c" step="any" required>
      </div>

      <button type="submit" class="enviar">Resolver</button>
    </form>

<?php
if (isset($_POST["a"], $_POST["b"], $_POST["c"])) {
    $a = $_POST["a"];
    $b = $_POST["b"];
    $c = $_POST["c"];

    echo "<p>Ecuación: " . htmlspecialchars("{$a}x² + {$b}x + {$c} = 0") . "</p>";

    if (!is_numeric($a) || !is_numeric($b) || !is_numeric($c)) {
        echo "<p class='error'>Error: los tres coeficientes tienen que ser números.</p>";
    } elseif ($a == 0) {
        echo "<p class='error'>Error: A no puede valer 0, porque ahí la ecuación ya no es de segundo grado.</p>";
    } else {
        // esta función no está en este archivo, viene del require de arriba
        $soluciones = resolverEcuacion($a, $b, $c);

        if ($soluciones === false) {
            echo "<p class='error'>Error: la ecuación no tiene soluciones reales.</p>";
        } else {
            // implode me junta los elementos del array en un solo texto
            echo "<p class='ok'>Soluciones: x = " . implode(" y x = ", $soluciones) . "</p>";
        }
    }
}

require "../comun/pie.php";
?>
