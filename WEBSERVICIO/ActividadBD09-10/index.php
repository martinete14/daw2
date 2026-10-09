<?php
$titulo = "Buscar usuario";
require "../comun/cabecera.php";
?>
    <p>Poné el código de un usuario y te muestro todos sus datos</p>

    <!-- el form solo manda el código, los datos los busca usuario.php en la base de datos -->
    <form action="usuario.php" method="post">
      <div class="campo">
        <label for="codigo">Código del usuario</label>
        <input type="number" id="codigo" name="codigo" required>
      </div>

      <button type="submit" class="enviar">Buscar</button>
    </form>
<?php require "../comun/pie.php"; ?>
