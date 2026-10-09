<?php
session_start();

$titulo = "Inicio";
require "../comun/cabecera.php";
?>
<?php if (isset($_SESSION["usuario"])) { ?>
    <!-- esta parte solo la ve SOLO el que está logeado -->
    <p class="ok">Hola <?php echo htmlspecialchars($_SESSION["usuario"]); ?>, ya estás logeado.</p>

    <p><strong>Zona para los usuarios:</strong></p>
    <ul class="resultados">
      <li>Camiseta de Boca 2000 firmada por Román</li>
      <li>Botines de Robben</li>
      <li>Meet and greet con Pablo Vegetti</li>
      <li>Entrada para ver a Messi en el monumental</li>
    </ul>

    <a href="compra.php">Comprar</a>
<?php } else { ?>
    <!-- si no está logeado le muestro el formulario -->
    <p>Entrá con tu usuario para ver la zona de usuarios pelotudito</p>

    <form action="login.php" method="post">
      <div class="campo">
        <label for="usuario">Usuario</label>
        <input type="text" id="usuario" name="usuario" required>
      </div>

      <div class="campo">
        <label for="clave">Contraseña</label>
        <input type="password" id="clave" name="clave" required>
      </div>

      <button type="submit" class="enviar">ENTRAR</button>
    </form>
<?php } ?>
<?php require "../comun/pie.php"; ?>
