<?php
$jugador = "Riquelme";
$vacio = "";
$texto = "10.5";

$numeros = [7, 3, 9, 1, 5];
$notas = ["Robben" => 8.5, "Vegetti" => 7, "Riquelme" => 10];

$titulo = "Funciones del cuadro 2.6";
require "../comun/cabecera.php";
?>
    <!-- var_dump para los true/false, porque con echo el false no se ve -->
    <p><strong>Funciones de variables:</strong></p>
    <ul class="resultados">
      <li>isset($jugador): <?php var_dump(isset($jugador)); ?></li>
      <li>empty($vacio): <?php var_dump(empty($vacio)); ?></li>
      <li>intval($texto): <?php echo intval($texto); ?></li>
    </ul>

    <p><strong>Funciones de cadenas:</strong></p>
    <ul class="resultados">
      <li>strlen($jugador): <?php echo strlen($jugador); ?></li>
      <li>strtoupper($jugador): <?php echo strtoupper($jugador); ?></li>
      <!-- en el cuadro dice str() pero la función se llama strstr() -->
      <li>strstr("Juan Román Riquelme", "Román"): <?php echo strstr("Juan Román Riquelme", "Román"); ?></li>
    </ul>

    <p><strong>Funciones de arrays (con <?php echo implode(", ", $numeros); ?>):</strong></p>
    <ul class="resultados">
      <li>count($numeros): <?php echo count($numeros); ?></li>
      <li>sort($numeros): <?php sort($numeros); echo implode(", ", $numeros); ?></li>
      <!-- en el cuadro está al revés: primero va la clave y después el array -->
      <li>array_key_exists("Riquelme", $notas): <?php var_dump(array_key_exists("Riquelme", $notas)); ?></li>
    </ul>
<?php require "../comun/pie.php"; ?>
