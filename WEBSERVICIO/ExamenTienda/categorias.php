<?php
// ExamenTienda - La Pulpería
// Categorías (RF-01): las 6 categorías leídas de la BD, cada una lleva a sus productos.
// Arriba, la portada con el titular y una lista de precios pegada como un afiche de almacén.
require "config.php";
Usuario::comprobarSesion();

$categorias = Categoria::todas();
// array_column saca la propiedad "cantidad" de cada objeto, y array_sum las suma
$totalProductos = array_sum(array_column($categorias, "cantidad"));

$titulo = "Categorías";
require "inc/cabecera.php";
?>
    <section class="portada">
      <div>
        <p class="nota">lo de allá, acá</p>
        <h1 class="portada-titulo" data-anima="letras">
          <span class="linea">Yerba,</span>
          <span class="linea">mate y</span>
          <span class="linea">alfajores</span>
        </h1>
        <p class="portada-bajada">
          Almacén argentino en Europa: <strong><?php echo count($categorias); ?> categorías</strong> y
          <strong><?php echo $totalProductos; ?> productos</strong>, con el precio en euros y en pesos.
        </p>
        <a class="boton boton-chico" href="#categorias">Ver el almacén <i class="ph-bold ph-arrow-down" aria-hidden="true"></i></a>
      </div>

      <div class="portada-cartel">
        <!-- la lista de precios del almacén: cada categoría con su precio más barato, escrito a mano -->
        <div class="lista-precios" data-anima="salta">
          <p class="lista-titulo">Precios de hoy</p>
          <ul>
            <?php foreach ($categorias as $categoria) { ?>
              <li class="cat-<?php echo $categoria->codigo; ?>">
                <a href="productos.php?categoria=<?php echo $categoria->codigo; ?>">
                  <span class="lista-nombre"><?php echo htmlspecialchars($categoria->nombre); ?></span>
                  <span class="lista-precio">desde <?php echo euros($categoria->desde); ?></span>
                </a>
              </li>
            <?php } ?>
          </ul>
          <p class="lista-pie">1 € = <?php echo number_format(COTIZACION_ARS, 0, ",", "."); ?> ARS · cotización fija</p>
        </div>
        <!-- sello que gira: el texto sigue un círculo (textPath) y textLength lo estira justo a la vuelta -->
        <svg class="sello-giratorio" viewBox="0 0 200 200" aria-hidden="true">
          <defs><path id="circulo" d="M100,100 m-76,0 a76,76 0 1,1 152,0 a76,76 0 1,1 -152,0"/></defs>
          <circle cx="100" cy="100" r="97" fill="#ffe600" stroke="#141414" stroke-width="4"/>
          <text><textPath href="#circulo" textLength="474">Almacén argentino ✶ Lo de allá, acá ✶</textPath></text>
          <image href="img/logo.svg" x="64" y="64" width="72" height="72"/>
        </svg>
      </div>
    </section>

    <h2 class="seccion-titulo" id="categorias">Elegí qué llevar <small>tocá un afiche</small></h2>
    <div class="afiches">
      <?php foreach ($categorias as $i => $categoria) { ?>
        <!-- cat-N le da a cada categoría su tinta (está en estilos.css) -->
        <a class="afiche cat-<?php echo $categoria->codigo; ?>" href="productos.php?categoria=<?php echo $categoria->codigo; ?>" data-anima="tarjeta">
          <span class="afiche-num">Nº <?php echo $i + 1; ?></span>
          <h3 class="afiche-titulo"><?php echo htmlspecialchars($categoria->nombre); ?></h3>
          <p class="afiche-texto"><?php echo htmlspecialchars($categoria->descripcion); ?></p>
          <span class="afiche-cantidad"><?php echo $categoria->cantidad; ?> productos</span>
          <?php if ($categoria->imagen) { ?>
            <img class="afiche-foto" src="<?php echo htmlspecialchars($categoria->imagen); ?>" alt="">
          <?php } ?>
          <span class="afiche-ir" aria-hidden="true"><i class="ph-bold ph-arrow-up-right"></i></span>
        </a>
      <?php } ?>
    </div>
<?php require "inc/pie.php"; ?>
