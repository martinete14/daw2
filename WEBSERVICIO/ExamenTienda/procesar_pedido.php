<?php
// ExamenTienda - La Pulpería
// Confirmar el pedido (RF-15, RF-16, RF-17). Como procesar_pedido.php del libro (4.4.9): guarda
// el pedido con Pedido::guardar(), vacía el carrito y muestra el número, o el error si no se pudo.
// No manda correo de confirmación (ver Limitaciones en la memoria).
require "config.php";
Usuario::comprobarSesion();

// las líneas se leen antes de guardar: con ellas se arma el resumen
$lineas = Carrito::lineas();

// se llega solo con el botón "Confirmar pedido" (POST). Abrir la dirección a mano, recargar
// o tocar dos veces el botón con el carrito ya vacío no hace otro pedido: vuelve al carrito
if ($_SERVER["REQUEST_METHOD"] != "POST" || !$lineas) {
    header("Location: carrito.php");
    exit;
}
$total = Carrito::total($lineas);

$numero = false;
$errorBD = false;
try {
    $numero = Pedido::guardar($_SESSION['usuario']['codigo'], Carrito::contenido());
} catch (PDOException $e) {
    // Pedido::guardar ya deshizo la transacción: no se guardó nada y el carrito sigue igual
    $errorBD = true;
}

$faltan = [];
if ($numero) {
    Carrito::vaciar(); // RF-17
} elseif (!$errorBD) {
    // RF-16: faltó stock. Se vuelven a leer las líneas (con el stock de ahora) para decir de qué productos
    foreach (Carrito::lineas() as $linea) {
        if ($linea['unidades'] > $linea['producto']->stock) {
            $faltan[] = $linea;
        }
    }
}

$titulo = $numero ? "Pedido confirmado" : "No se pudo hacer el pedido";
require "inc/cabecera.php";
?>
    <section class="pedido-hecho">
      <?php if ($numero) { ?>
        <p class="nota">¡gracias, <?php echo htmlspecialchars(strtok($_SESSION['usuario']['nombre'], " ")); ?>!</p>
        <h1 class="pagina-titulo" data-anima="letras">Pedido Nº <?php echo $numero; ?></h1>
        <p class="sello-pedido">Confirmado</p>
        <p class="pedido-texto">Tu pedido quedó guardado y ya figura en tu perfil, pendiente de envío. Este es el resumen:</p>

        <div class="tabla-envoltura">
          <table class="tabla">
            <thead>
              <tr><th>Producto</th><th>Unidades</th><th>Precio</th><th>Subtotal</th></tr>
            </thead>
            <tbody>
              <?php foreach ($lineas as $linea) { ?>
                <tr>
                  <td><?php echo htmlspecialchars($linea['producto']->nombre); ?></td>
                  <td><?php echo $linea['unidades']; ?></td>
                  <td><?php echo euros($linea['producto']->precio); ?></td>
                  <td><?php echo euros($linea['subtotal']); ?></td>
                </tr>
              <?php } ?>
            </tbody>
            <tfoot>
              <tr><th colspan="3">Total</th><th><?php echo euros($total); ?> <small><?php echo pesos($total); ?></small></th></tr>
            </tfoot>
          </table>
        </div>

        <div class="acciones">
          <a class="boton boton-chico" href="perfil.php"><i class="ph-bold ph-receipt" aria-hidden="true"></i> Ver mis pedidos</a>
          <a class="volver" href="categorias.php">Seguir comprando <i class="ph-bold ph-arrow-right" aria-hidden="true"></i></a>
        </div>

      <?php } else { ?>
        <p class="nota">algo cambió</p>
        <h1 class="pagina-titulo" data-anima="letras">No se pudo hacer el pedido</h1>

        <?php if ($errorBD) { ?>
          <p class="error"><i class="ph-bold ph-warning-circle" aria-hidden="true"></i> Hubo un problema con la base de datos. No se guardó nada y tu carrito sigue igual: probá de nuevo en un rato.</p>
        <?php } else { ?>
          <p class="error"><i class="ph-bold ph-warning-circle" aria-hidden="true"></i> Mientras armabas el carrito, otro cliente se llevó unidades. No se guardó nada.</p>
          <?php if ($faltan) { ?>
            <ul class="faltan">
              <?php foreach ($faltan as $linea) { ?>
                <li><strong><?php echo htmlspecialchars($linea['producto']->nombre); ?></strong>:
                  <?php echo $linea['producto']->stock == 0 ? "se agotó" : ($linea['producto']->stock == 1 ? "queda 1" : "quedan " . $linea['producto']->stock); ?>
                  y en tu carrito hay <?php echo $linea['unidades']; ?>.</li>
              <?php } ?>
            </ul>
          <?php } ?>
        <?php } ?>

        <div class="acciones">
          <a class="boton boton-chico" href="carrito.php"><i class="ph-bold ph-shopping-cart-simple" aria-hidden="true"></i> Volver al carrito</a>
        </div>
      <?php } ?>
    </section>
<?php require "inc/pie.php"; ?>
