<?php
// ExamenTienda - La Pulpería
// Categorías (RF-01): las 6 categorías leídas de la BD, cada una lleva a sus productos
require "config.php";
Usuario::comprobarSesion();

$categorias = Categoria::todas();

$titulo = "Categorías";
require "inc/cabecera.php";
?>
    <h1>Categorías</h1>
    <div class="rejilla">
      <?php foreach ($categorias as $categoria) { ?>
        <a class="tarjeta categoria" href="productos.php?categoria=<?php echo $categoria->codigo; ?>">
          <h2><?php echo htmlspecialchars($categoria->nombre); ?></h2>
          <p><?php echo htmlspecialchars($categoria->descripcion); ?></p>
        </a>
      <?php } ?>
    </div>
<?php require "inc/pie.php"; ?>
