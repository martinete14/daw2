<?php
// ExamenTienda - La Pulpería
// Productos de una categoría (RF-02, RF-03): imagen, nombre, descripción, peso,
// precio en euros y en pesos, y el sello "Sin stock" si no quedan.
// Arriba, el filtro por tipo (RF-18): con palo, sin palo, compuesta...
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

// el tipo elegido también llega por la URL: productos.php?categoria=1&tipo=Sin palo (sin tipo, todos)
$tipo = $_GET['tipo'] ?? "";
$tipos = $categoria->tipos();
$productos = Producto::deCategoria($categoria->codigo, $tipo);
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

      <?php if (count($tipos) > 1) { ?>
        <!-- RF-18: cada opción es un enlace con el tipo en la URL; filtra la consulta en PHP, no JavaScript.
             #filtro hace que la página vuelva a abrir acá y no arriba de todo -->
        <nav class="filtro" id="filtro" aria-label="Filtrar por tipo">
          <span class="filtro-nota">¿Cuál buscás?</span>
          <a href="productos.php?categoria=<?php echo $categoria->codigo; ?>#filtro"<?php if ($tipo == "") echo ' aria-current="page"'; ?>>
            Todos <small><?php echo array_sum($tipos); ?></small>
          </a>
          <?php foreach ($tipos as $nombre => $cantidad) { ?>
            <!-- http_build_query arma "categoria=1&tipo=Sin+palo", con los espacios y las tildes codificados -->
            <a href="productos.php?<?php echo htmlspecialchars(http_build_query(['categoria' => $categoria->codigo, 'tipo' => $nombre])); ?>#filtro"<?php if ($tipo == $nombre) echo ' aria-current="page"'; ?>>
              <?php echo htmlspecialchars($nombre); ?> <small><?php echo $cantidad; ?></small>
            </a>
          <?php } ?>
        </nav>
      <?php } ?>

      <?php if (!$productos) { ?>
        <div class="vacio">
          <p>No hay productos de ese tipo.</p>
          <a class="boton boton-chico" href="productos.php?categoria=<?php echo $categoria->codigo; ?>">Ver todos</a>
        </div>
      <?php } ?>

      <div class="estantes">
        <?php foreach ($productos as $producto) { ?>
          <article class="producto<?php if ($producto->sinStock()) echo " agotado"; ?>" data-anima="tarjeta">
            <?php if ($producto->tieneImagen()) { ?>
              <div class="foto">
                <!-- loading="lazy": la foto se baja cuando se acerca con el scroll, no todas al abrir la página -->
                <img src="<?php echo htmlspecialchars($producto->imagen); ?>" alt="<?php echo htmlspecialchars($producto->nombre); ?>" loading="lazy">
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
