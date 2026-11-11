<?php
// ExamenTienda - La Pulpería
// Carrito (RF-13, RF-14). Como carrito.php del libro (4.4.7): lee de la BD los productos cuyos
// códigos están en $_SESSION['carrito'] y muestra una fila por producto con sus unidades, su precio
// y su subtotal. Cada fila tiene tres formularios: − (quita una unidad, eliminar.php), + (suma una,
// anadir.php) y Quitar (quita todas). Al lado, el total y el botón que confirma el pedido.
require "config.php";
Usuario::comprobarSesion();

// antes de la cabecera: si un producto ya no existe, lineas() lo saca y el número de arriba queda bien
$lineas = Carrito::lineas();
$total = Carrito::total($lineas);
$cantidad = Carrito::cantidad();

// ¿hay en el carrito más unidades de las que quedan? (otro cliente compró mientras tanto)
$faltaStock = false;
foreach ($lineas as $linea) {
    if ($linea['unidades'] > $linea['producto']->stock) {
        $faltaStock = true;
    }
}

// el botón + llegó al stock: anadir.php vuelve con carrito.php?tope=codigo
$tope = (int)($_GET['tope'] ?? 0);

$titulo = "Carrito";
require "inc/cabecera.php";
?>
    <p class="nota">lo que vas a llevar</p>
    <h1 class="pagina-titulo" data-anima="letras">Tu carrito</h1>

    <?php foreach ($lineas as $linea) {
        if ($linea['producto']->codigo == $tope) { ?>
          <p class="aviso"><i class="ph-bold ph-info" aria-hidden="true"></i> No quedan más unidades de <?php echo htmlspecialchars($linea['producto']->nombre); ?>: las <?php echo $linea['producto']->stock; ?> que hay ya están en tu carrito.</p>
    <?php }
    } ?>

    <?php if (!$lineas) { ?>
      <div class="vacio">
        <p>Tu carrito está vacío.</p>
        <a class="boton boton-chico" href="categorias.php"><i class="ph-bold ph-storefront" aria-hidden="true"></i> Ir al almacén</a>
      </div>
    <?php } else { ?>
      <div class="carrito">
        <div class="tabla-envoltura">
          <table class="tabla tabla-carrito">
            <thead>
              <tr><th>Producto</th><th>Precio</th><th>Unidades</th><th>Subtotal</th><th><span class="oculto">Quitar</span></th></tr>
            </thead>
            <tbody>
              <?php foreach ($lineas as $linea) {
                  $producto = $linea['producto'];
                  $unidades = $linea['unidades'];
                  $nombre = htmlspecialchars($producto->nombre); ?>
                <tr class="cat-<?php echo $producto->categoria; ?>">
                  <td class="linea-producto">
                    <?php if ($producto->tieneImagen()) { ?>
                      <img src="<?php echo htmlspecialchars($producto->imagen); ?>" alt="" width="64" height="64">
                    <?php } ?>
                    <div>
                      <a href="productos.php?categoria=<?php echo $producto->categoria; ?>#p-<?php echo $producto->codigo; ?>"><?php echo $nombre; ?></a>
                      <small><?php echo $producto->pesoTexto(); ?></small>
                      <?php if ($unidades > $producto->stock) { ?>
                        <span class="falta"><i class="ph-bold ph-warning" aria-hidden="true"></i>
                          <?php if ($producto->stock == 0) {
                              echo "Se agotó: quitalo para poder confirmar.";
                          } else {
                              echo ($producto->stock == 1 ? "Ahora queda 1" : "Ahora quedan " . $producto->stock) . ": bajá las unidades para poder confirmar.";
                          } ?>
                        </span>
                      <?php } ?>
                    </div>
                  </td>
                  <td data-titulo="Precio"><?php echo euros($producto->precio); ?> <small><?php echo pesos($producto->precio); ?></small></td>
                  <td data-titulo="Unidades">
                    <div class="cantidad">
                      <form action="eliminar.php" method="post">
                        <input type="hidden" name="cod" value="<?php echo $producto->codigo; ?>">
                        <input type="hidden" name="unidades" value="1">
                        <button type="submit" aria-label="Quitar una unidad de <?php echo $nombre; ?>"><i class="ph-bold ph-minus" aria-hidden="true"></i></button>
                      </form>
                      <span><?php echo $unidades; ?></span>
                      <form action="anadir.php" method="post">
                        <input type="hidden" name="cod" value="<?php echo $producto->codigo; ?>">
                        <input type="hidden" name="unidades" value="1">
                        <input type="hidden" name="volver" value="carrito">
                        <!-- con todo el stock en el carrito, el + se apaga (anadir.php igual lo comprueba) -->
                        <button type="submit" aria-label="Sumar una unidad de <?php echo $nombre; ?>"<?php if ($unidades >= $producto->stock) echo " disabled"; ?>><i class="ph-bold ph-plus" aria-hidden="true"></i></button>
                      </form>
                    </div>
                  </td>
                  <td data-titulo="Subtotal"><strong><?php echo euros($linea['subtotal']); ?></strong> <small><?php echo pesos($linea['subtotal']); ?></small></td>
                  <td>
                    <form action="eliminar.php" method="post">
                      <input type="hidden" name="cod" value="<?php echo $producto->codigo; ?>">
                      <input type="hidden" name="unidades" value="<?php echo $unidades; ?>">
                      <button class="quitar" type="submit" aria-label="Quitar <?php echo $nombre; ?> del carrito"><i class="ph-bold ph-trash" aria-hidden="true"></i> Quitar</button>
                    </form>
                  </td>
                </tr>
              <?php } ?>
            </tbody>
          </table>
        </div>

        <!-- la cuenta, como el ticket del almacén -->
        <aside class="resumen">
          <div class="ticket">
            <p class="lista-titulo">La cuenta</p>
            <dl class="cuentas">
              <div><dt>Productos</dt><dd><?php echo $cantidad . ($cantidad == 1 ? " unidad" : " unidades"); ?></dd></div>
              <div class="total"><dt>Total</dt><dd><?php echo euros($total); ?> <small><?php echo pesos($total); ?></small></dd></div>
            </dl>
            <?php if ($faltaStock) { ?>
              <p class="error"><i class="ph-bold ph-warning-circle" aria-hidden="true"></i> Hay productos sin stock suficiente. Revisá los que están marcados.</p>
            <?php } ?>
            <!-- POST y no un enlace: confirmar cambia la base de datos (RF-15) -->
            <form action="procesar_pedido.php" method="post">
              <button class="boton" type="submit"<?php if ($faltaStock) echo " disabled"; ?>>Confirmar pedido <i class="ph-bold ph-check" aria-hidden="true"></i></button>
            </form>
            <p class="ticket-pie">Se guarda con el precio de hoy · 1 € = <?php echo number_format(COTIZACION_ARS, 0, ",", "."); ?> ARS, cotización fija</p>
          </div>
          <a class="volver" href="categorias.php"><i class="ph-bold ph-arrow-left" aria-hidden="true"></i> Seguir comprando</a>
        </aside>
      </div>
    <?php } ?>
<?php require "inc/pie.php"; ?>
