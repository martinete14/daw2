<?php
// ExamenTienda - La Pulpería
// Productos de una categoría (RF-02, RF-03): imagen, nombre, descripción, peso,
// precio en euros y en pesos, y "Sin stock" si no quedan
require "config.php";
Usuario::comprobarSesion();

// el código de la categoría llega por la URL: productos.php?categoria=1
$categoria = Categoria::buscar($_GET['categoria'] ?? 0);

$titulo = $categoria ? $categoria->nombre : "Categoría no encontrada";
require "inc/cabecera.php";

if (!$categoria) { ?>
    <p class="error">Esa categoría no existe.</p>
    <a href="categorias.php">Volver a las categorías</a>
<?php
    require "inc/pie.php";
    exit;
}

$productos = Producto::deCategoria($categoria->codigo);
?>
    <a class="volver" href="categorias.php">&larr; Categorías</a>
    <h1><?php echo htmlspecialchars($categoria->nombre); ?></h1>

    <div class="rejilla">
      <?php foreach ($productos as $producto) { ?>
        <article class="tarjeta producto">
          <?php if ($producto->tieneImagen()) { ?>
            <img src="<?php echo htmlspecialchars($producto->imagen); ?>" alt="<?php echo htmlspecialchars($producto->nombre); ?>">
          <?php } else { ?>
            <div class="sin-imagen">Imagen en preparación</div>
          <?php } ?>

          <h2><?php echo htmlspecialchars($producto->nombre); ?></h2>
          <p class="descripcion"><?php echo htmlspecialchars($producto->descripcion); ?></p>
          <p class="peso"><?php echo $producto->pesoTexto(); ?></p>
          <p class="precio">
            <?php echo euros($producto->precio); ?>
            <small>(<?php echo pesos($producto->precio); ?>)</small>
          </p>

          <?php if ($producto->sinStock()) { ?>
            <p class="sin-stock">Sin stock</p>
          <?php } ?>
        </article>
      <?php } ?>
    </div>
<?php require "inc/pie.php"; ?>
