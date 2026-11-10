<?php
// ExamenTienda - La Pulpería
// Productos de una categoría (RF-02, RF-03): imagen, nombre, descripción, peso,
// precio en euros y en pesos, y el sello "Sin stock" si no quedan
require "config.php";
Usuario::comprobarSesion();

// el código de la categoría llega por la URL: productos.php?categoria=1
$categoria = Categoria::buscar($_GET['categoria'] ?? 0);

$titulo = $categoria ? $categoria->nombre : "Categoría no encontrada";
require "inc/cabecera.php";

if (!$categoria) { ?>
    <p class="error"><i class="ph-bold ph-warning-circle" aria-hidden="true"></i> Esa categoría no existe.</p>
    <a class="volver" href="categorias.php"><i class="ph-bold ph-arrow-left" aria-hidden="true"></i> Volver a las categorías</a>
<?php
    require "inc/pie.php";
    exit;
}

$productos = Producto::deCategoria($categoria->codigo);
?>
    <!-- cat-N: la franja y las tarjetas toman la tinta de la categoría -->
    <div class="cat-<?php echo $categoria->codigo; ?>">
      <section class="banda">
        <a class="volver" href="categorias.php"><i class="ph-bold ph-arrow-left" aria-hidden="true"></i> Todas las categorías</a>
        <h1 class="banda-titulo" data-anima="letras"><?php echo htmlspecialchars($categoria->nombre); ?></h1>
        <p class="banda-texto"><?php echo htmlspecialchars($categoria->descripcion); ?></p>
        <span class="banda-cantidad"><?php echo count($productos); ?> productos</span>
        <?php if ($productos && $productos[0]->tieneImagen()) { ?>
          <img class="banda-foto" src="<?php echo htmlspecialchars($productos[0]->imagen); ?>" alt="">
        <?php } ?>
      </section>

      <div class="estantes">
        <?php foreach ($productos as $producto) { ?>
          <article class="producto<?php if ($producto->sinStock()) echo " agotado"; ?>" data-anima="tarjeta">
            <?php if ($producto->tieneImagen()) { ?>
              <div class="foto">
                <img src="<?php echo htmlspecialchars($producto->imagen); ?>" alt="<?php echo htmlspecialchars($producto->nombre); ?>">
                <?php if ($producto->gif()) { ?>
                  <!-- el gif va encima, invisible; el CSS lo muestra al pasar el mouse -->
                  <img class="animada" src="<?php echo htmlspecialchars($producto->gif()); ?>" alt="" loading="lazy">
                <?php } ?>
              </div>
            <?php } else { ?>
              <div class="sin-imagen">Imagen en preparación</div>
            <?php } ?>

            <p class="sticker">
              <strong><?php echo euros($producto->precio); ?></strong>
              <small><?php echo pesos($producto->precio); ?></small>
            </p>

            <?php if ($producto->sinStock()) { ?>
              <p class="sello">Sin stock</p>
            <?php } ?>

            <h2><?php echo htmlspecialchars($producto->nombre); ?></h2>
            <p class="descripcion"><?php echo htmlspecialchars($producto->descripcion); ?></p>
            <p class="peso"><i class="ph-bold ph-scales" aria-hidden="true"></i> <?php echo $producto->pesoTexto(); ?></p>
          </article>
        <?php } ?>
      </div>
    </div>
<?php require "inc/pie.php"; ?>
