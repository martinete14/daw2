<?php
$personas = [
    "12345678Z" => "Ana García",
    "87654321X" => "Luis Martínez",
    "11111111H" => "Marta López",
    "22222222J" => "Carlos Sánchez",
    "33333333P" => "Lucía Fernández",
];

// buscar por clave, el DNI es la clave del array
function buscarPorClave($dni, $personas)
{
    if (array_key_exists($dni, $personas)) {
        return $personas[$dni];
    }
    return false;
}

$titulo = "Buscar DNI";
require "../comun/cabecera.php";
?>
    <form action="index.php" method="post">
      <div class="campo">
        <label for="dni">Buscar por DNI</label>
        <input type="text" id="dni" name="dni" placeholder="DNI a buscar">
      </div>
      <button type="submit" class="enviar">Buscar</button>
    </form>

<?php
if (isset($_POST["dni"])) {
    $nombre = buscarPorClave($_POST["dni"], $personas);
    if ($nombre) {
        echo "<p class='ok'>El DNI pertenece a: " . $nombre . "</p>";
    } else {
        echo "<p class='error'>No existe ese DNI</p>";
    }
}

require "../comun/pie.php";
?>
