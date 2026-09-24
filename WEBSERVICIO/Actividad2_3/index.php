<?php
// devuelve el factorial o -1 si el argumento no es válido
// (tiene que ser un número entero y no negativo)
function factorial($n)
{
    if (!is_numeric($n) || $n < 0 || floor($n) != $n) {
        return -1;
    }
    $resultado = 1;
    for ($i = 2; $i <= $n; $i++) {
        $resultado = $resultado * $i;
    }
    return $resultado;
}

$titulo = "Actividad 2.3 · Factorial";
require "../comun/cabecera.php";
?>
    <form action="index.php" method="post">
      <div class="campo">
        <label for="numero">Número</label>
        <input type="text" id="numero" name="numero" value="<?php
          if (isset($_POST["numero"])) {
            echo htmlspecialchars($_POST["numero"]);
          }
        ?>">
      </div>

      <button type="submit" class="enviar">Calcular</button>
    </form>

<?php
if (isset($_POST["numero"])) {
    $numero = $_POST["numero"];
    $resultado = factorial($numero);

    // la función devuelve -1 cuando el argumento no vale
    if ($resultado == -1) {
        echo '<p class="error">' . htmlspecialchars($numero) . ' no es válido, tiene que ser un entero mayor o igual que 0.</p>';
    } else {
        echo '<p class="ok">' . $numero . '! = ' . $resultado . '</p>';
    }
}
?>
<?php require "../comun/pie.php"; ?>
