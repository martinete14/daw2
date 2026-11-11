<?php
// Cabecera común: cinta de afiche, logo, nombre del usuario, menú con el carrito y cerrar sesión (RF-11).
// Antes de incluirla, cada página define $titulo.

// lo que pasa en la cinta de arriba (va dos veces seguidas para que el giro no tenga corte)
$cinta = ["Yerba mate", "Mates y bombillas", "Termos", "Alfajores", "Dulce de leche",
          "Almacén criollo", "Lo de allá, acá", "1 € = " . number_format(COTIZACION_ARS, 0, ",", ".") . " ARS"];
?>
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title><?php echo htmlspecialchars($titulo); ?> · La Pulpería</title>
  <link rel="icon" href="img/logo.svg" type="image/svg+xml">
  <!-- tipografías e iconos desde CDN; sin internet se usan las del sistema -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Anton&family=Bricolage+Grotesque:opsz,wght@12..96,400..800&family=Permanent+Marker&display=swap">
  <link rel="stylesheet" href="https://unpkg.com/@phosphor-icons/web@2.1.1/src/bold/style.css">
  <link rel="stylesheet" href="css/estilos.css">
  <!-- marca que hay JavaScript, así el CSS esconde lo que después anima GSAP (sin JS se ve todo) -->
  <script>document.documentElement.classList.add("js");</script>
</head>
<body>
  <div class="cinta">
    <div class="cinta-pista">
      <?php for ($i = 0; $i < 2; $i++) { ?>
        <ul <?php if ($i) echo 'aria-hidden="true"'; ?>>
          <?php foreach ($cinta as $texto) { ?><li><?php echo htmlspecialchars($texto); ?></li><?php } ?>
        </ul>
      <?php } ?>
    </div>
  </div>

  <header class="cabecera">
    <a class="logo" href="categorias.php">
      <img src="img/logo.svg" alt="" width="46" height="46">
      <span class="logo-texto">La Pulpería</span>
      <span class="logo-sello">almacén argentino</span>
    </a>
    <?php if (isset($_SESSION['usuario'])) { ?>
      <nav class="menu">
        <!-- strtok corta el nombre en el primer espacio: "Juan Román Riquelme" -> "Juan" -->
        <span class="hola">Hola, <?php echo htmlspecialchars(strtok($_SESSION['usuario']['nombre'], " ")); ?></span>
        <a href="categorias.php"><i class="ph-bold ph-squares-four" aria-hidden="true"></i> Categorías</a>
        <a href="perfil.php"><i class="ph-bold ph-user-circle" aria-hidden="true"></i> Mi perfil</a>
        <!-- el número son las unidades que hay en $_SESSION['carrito'] -->
        <?php $enCarrito = Carrito::cantidad(); ?>
        <a class="menu-carrito" href="carrito.php" aria-label="Carrito, <?php echo $enCarrito . ($enCarrito == 1 ? " unidad" : " unidades"); ?>">
          <i class="ph-bold ph-shopping-cart-simple" aria-hidden="true"></i> Carrito
          <?php if ($enCarrito > 0) { ?><span class="contador"><?php echo $enCarrito; ?></span><?php } ?>
        </a>
        <a class="salir" href="logout.php"><i class="ph-bold ph-sign-out" aria-hidden="true"></i> Salir</a>
      </nav>
    <?php } ?>
  </header>
  <main class="contenido">
