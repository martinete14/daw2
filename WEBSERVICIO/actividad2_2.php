<?php
require "Funciones.php";

$titulo = "Actividad 2.2 · Potencias";
require "cabecera.php";
?>
    <form action="actividad2_2.php" method="post">
      <div class="campo">
        <label for="base">Base</label>
        <input type="text" id="base" name="base" value="<?php
          if (isset($_POST["base"])) {
            echo htmlspecialchars($_POST["base"]);
          }
        ?>">
      </div>

      <div class="campo">
        <label for="exponente">Exponente (si lo dejás vacío, vale 2)</label>
        <input type="text" id="exponente" name="exponente" value="<?php
          if (isset($_POST["exponente"])) {
            echo htmlspecialchars($_POST["exponente"]);
          }
        ?>">
      </div>

      <button type="submit" class="enviar">Calcular</button>
    </form>

<?php
if (isset($_POST["base"])) {
    $base = $_POST["base"];
    $exponente = $_POST["exponente"];

    if (!is_numeric($base)) {
        echo '<p class="error">La base tiene que ser un número.</p>';
    } elseif ($exponente == "") {
        // no le paso el exponente, así usa el valor por defecto
        echo '<p class="ok">' . htmlspecialchars($base) . '<sup>2</sup> = ' . potencia($base) . '</p>';
    } elseif (!ctype_digit($exponente)) {
        echo '<p class="error">El exponente tiene que ser un entero mayor o igual que 0.</p>';
    } else {
        echo '<p class="ok">' . htmlspecialchars($base) . '<sup>' . $exponente . '</sup> = ' . potencia($base, $exponente) . '</p>';
    }
}
?>
<?php require "pie.php"; ?>
