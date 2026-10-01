<?php
// recorre el array y arma uno nuevo solo con los números menores que el límite
function menoresQueLimite($numeros, $limite)
{
    $menores = [];
    foreach ($numeros as $n) {
        if ($n < $limite) {
            $menores[] = $n;
        }
    }
    return $menores;
}

$titulo = "Menores que el límite";
require "../comun/cabecera.php";
?>
    <form action="index.php" method="post">
      <div class="campo">
        <label for="numeros">Números separados por coma</label>
        <input type="text" id="numeros" name="numeros" placeholder="Ej: 4, 15, 8, 23, 1" required>
      </div>

      <div class="campo">
        <label for="limite">Límite</label>
        <input type="number" id="limite" name="limite" step="any" required>
      </div>

      <button type="submit" class="enviar">Filtrar</button>
    </form>

<?php
if (isset($_POST["numeros"], $_POST["limite"])) {
    $limite = $_POST["limite"];

    // explode corta el texto en cada coma y me devuelve un array con los pedazos
    $partes = explode(",", $_POST["numeros"]);

    // paso los pedazos al array de números, y si alguno no es número me lo anoto
    $numeros = [];
    $todoBien = true;
    foreach ($partes as $parte) {
        $parte = trim($parte); // le saco los espacios de alrededor
        if (is_numeric($parte)) {
            $numeros[] = $parte;
        } else {
            $todoBien = false;
        }
    }

    if (!is_numeric($limite)) {
        echo "<p class='error'>Error: el límite tiene que ser un número.</p>";
    } elseif (!$todoBien) {
        echo "<p class='error'>Error: hay algo en la lista que no es un número. Separalos con coma, por ejemplo: 4, 15, 8</p>";
    } else {
        $menores = menoresQueLimite($numeros, $limite);

        echo "<p>Array original: " . implode(", ", $numeros) . "</p>";

        if (count($menores) == 0) {
            echo "<p class='error'>Ningún número es menor que $limite</p>";
        } else {
            echo "<p class='ok'>Menores que $limite: " . implode(", ", $menores) . "</p>";
        }
    }
}

require "../comun/pie.php";
?>
