<?php
$titulo = "Notas del fichero";
require "../comun/cabecera.php";
?>
    <p>Poné un límite y te muestro las notas del fichero que sean menores o iguales</p>

    <!-- el form solo manda el límite, las notas las lee calculo.php del fichero -->
    <form action="calculo.php" method="post">
      <div class="campo">
        <label for="limite">Límite</label>
        <input type="number" id="limite" name="limite" step="any" required>
      </div>

      <button type="submit" class="enviar">Calcular</button>
    </form>
<?php require "../comun/pie.php"; ?>