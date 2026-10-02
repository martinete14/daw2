<?php
// datos de prueba, de acá salen todos los resultados de abajo
$jugador = "Riquelme";
$vacio = "";
$texto = "10.5";

$numeros = [7, 3, 9, 1, 5];
$notas = ["Robben" => 8.5, "Vegetti" => 7, "Riquelme" => 10];

$titulo = "Funciones del cuadro 2.6";
require "../comun/cabecera.php";
?>
    <!-- todas estas funciones ya vienen con PHP, no hay que hacer ningún require -->
    <!-- var_dump para los true/false, porque con echo el false no se ve -->
    <p><strong>Funciones de variables:</strong></p>
    <ul class="resultados">
      <!-- isset: true si la variable existe y no es null. $jugador vale "Riquelme" -->
      <li>isset($jugador): <?php var_dump(isset($jugador)); ?></li>
      <!-- empty: true si la variable está vacía. $vacio es "" -->
      <li>empty($vacio): <?php var_dump(empty($vacio)); ?></li>
      <!-- intval: pasa el valor a número entero, le corta los decimales a "10.5" -->
      <li>intval($texto): <?php echo intval($texto); ?></li>
    </ul>

    <p><strong>Funciones de cadenas:</strong></p>
    <ul class="resultados">
      <!-- strlen: cuenta cuántos caracteres tiene el texto -->
      <li>strlen($jugador): <?php echo strlen($jugador); ?></li>
      <!-- strtoupper: pasa todo el texto a mayúsculas -->
      <li>strtoupper($jugador): <?php echo strtoupper($jugador); ?></li>
      <!-- strstr: busca "Román" y devuelve el texto desde ahí hasta el final -->
      <!-- (en el cuadro dice str() pero la función se llama strstr()) -->
      <li>strstr("Juan Román Riquelme", "Román"): <?php echo strstr("Juan Román Riquelme", "Román"); ?></li>
    </ul>

    <p><strong>Funciones de arrays (con <?php echo implode(", ", $numeros); ?>):</strong></p>
    <ul class="resultados">
      <!-- count: cuántos elementos tiene el array -->
      <li>count($numeros): <?php echo count($numeros); ?></li>
      <!-- sort: ordena el array de menor a mayor, y con implode lo muestro separado por comas -->
      <li>sort($numeros): <?php sort($numeros); echo implode(", ", $numeros); ?></li>
      <!-- array_key_exists: true si "Riquelme" es una de las claves de $notas -->
      <!-- (en el cuadro está al revés: primero va la clave y después el array) -->
      <li>array_key_exists("Riquelme", $notas): <?php var_dump(array_key_exists("Riquelme", $notas)); ?></li>
    </ul>
<?php require "../comun/pie.php"; ?>
