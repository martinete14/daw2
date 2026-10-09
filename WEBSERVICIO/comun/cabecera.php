<?php
if (!isset($titulo)) {
    $titulo = "WEBSERVICIO";
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title><?php echo htmlspecialchars($titulo); ?></title>
  <link rel="stylesheet" href="../comun/estilos.css">
</head>
<body>
  <div class="cabecera">
    <h1><?php echo htmlspecialchars($titulo); ?></h1>
    <?php if (isset($_SESSION["usuario"])) { ?>
      <!-- si hay alguien logeado, su nombre sale arriba a la derecha -->
      <span class="usuario"><?php echo htmlspecialchars($_SESSION["usuario"]); ?></span>
    <?php } ?>
  </div>

  <div class="contenido">
