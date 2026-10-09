<?php
// session_start va antes de cualquier HTML, si no PHP no puede usar la sesión
session_start();

$titulo = "Inicio";
require "../comun/cabecera.php";
?>
<?php if (isset($_SESSION["usuario"])) { ?>
    <!-- esta parte solo la ve el que está logeado -->
    <p class="ok">Hola <?php echo htmlspecialchars($_SESSION["usuario"]); ?>, ya estás logeado.</p>

    <p><strong>Zona de usuarios:</strong></p>
    <ul class="resultados">
      <li>Camiseta de Boca 2000 firmada por Riquelme</li>
      <li>Botines de Robben</li>
      <li>Entrada para ver a Vegetti</li>
    </ul>
<?php } else { ?>
    <!-- si no está logeado le muestro el formulario -->
    <p>Entrá con tu usuario para ver la zona de usuarios</p>

    <form action="login.php" method="post">
      <div class="campo">
        <label for="usuario">Usuario</label>
        <input type="text" id="usuario" name="usuario" required>
      </div>

      <div class="campo">
        <label for="clave">Contraseña</label>
        <input type="password" id="clave" name="clave" required>
      </div>

      <button type="submit" class="enviar">Entrar</button>
    </form>
<?php } ?>
<?php require "../comun/pie.php"; ?>
