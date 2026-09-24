<?php
require "Funciones.php";

// 5 DNI inventados, el DNI es la clave y el nombre el valor
$personas = [
    "12345678Z" => "Ana García",
    "87654321X" => "Luis Martínez",
    "11111111H" => "Marta López",
    "22222222J" => "Carlos Sánchez",
    "33333333P" => "Lucía Fernández",
];

$titulo = "Buscar un DNI";
require "cabecera.php";
?>
    <form action="dni.php" method="post">
      <div class="campo">
        <label for="dni">DNI</label>
        <input type="text" id="dni" name="dni" placeholder="12345678Z" value="<?php
          if (isset($_POST["dni"])) {
            echo htmlspecialchars($_POST["dni"]);
          }
        ?>">
      </div>

      <button type="submit" class="enviar">Buscar</button>
    </form>

<?php
if (isset($_POST["dni"])) {
    // saco espacios y paso la letra a mayúscula para que 12345678z también lo encuentre
    $dni = strtoupper(trim($_POST["dni"]));
    $nombre = buscarPorDni($dni, $personas);

    if ($nombre != null) {
        echo '<p class="ok">El DNI ' . htmlspecialchars($dni) . ' es de ' . $nombre . '.</p>';
    } else {
        echo '<p class="error">No hay nadie con el DNI ' . htmlspecialchars($dni) . '.</p>';
    }
}
?>

    <ul class="resultados">
      <?php foreach ($personas as $clave => $valor): ?>
      <li><?php echo $clave; ?> &middot; <?php echo $valor; ?></li>
      <?php endforeach; ?>
    </ul>
<?php require "pie.php"; ?>
