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
  </div>

  <div class="contenido">
