<?php
// Cabecera común: logo, nombre del usuario, menú y cerrar sesión (RF-11).
// Antes de incluirla, cada página define $titulo.
?>
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title><?php echo htmlspecialchars($titulo); ?> · La Pulpería</title>
  <link rel="stylesheet" href="css/estilos.css">
</head>
<body>
  <header class="cabecera">
    <a class="logo" href="categorias.php">La Pulpería</a>
    <?php if (isset($_SESSION['usuario'])) { ?>
      <nav class="menu">
        <span class="hola">Hola, <?php echo htmlspecialchars($_SESSION['usuario']['nombre']); ?></span>
        <a href="categorias.php">Categorías</a>
        <a href="perfil.php">Mi perfil</a>
        <a href="logout.php">Salir</a>
      </nav>
    <?php } ?>
  </header>
  <main class="contenido">
