<?php
// ExamenTienda - La Pulpería
// Perfil (RF-10): los datos del usuario leídos de la BD y la lista de sus pedidos
require "config.php";
Usuario::comprobarSesion();

// el código sale de la sesión, así cada uno solo ve su propio perfil
$usuario = Usuario::buscar($_SESSION['usuario']['codigo']);
$pedidos = Pedido::deUsuario($usuario->codigo);

$titulo = "Mi perfil";
require "inc/cabecera.php";
?>
    <h1>Mi perfil</h1>

    <dl class="datos">
      <dt>Nombre</dt><dd><?php echo htmlspecialchars($usuario->nombre); ?></dd>
      <dt>Correo</dt><dd><?php echo htmlspecialchars($usuario->correo); ?></dd>
      <dt>Dirección</dt><dd><?php echo htmlspecialchars($usuario->direccion); ?></dd>
      <dt>Ciudad</dt><dd><?php echo htmlspecialchars($usuario->ciudad); ?></dd>
      <dt>Código postal</dt><dd><?php echo htmlspecialchars($usuario->cp); ?></dd>
      <dt>País</dt><dd><?php echo htmlspecialchars($usuario->pais); ?></dd>
      <dt>Cliente desde</dt><dd><?php echo date("d/m/Y", strtotime($usuario->fecha_alta)); ?></dd>
    </dl>

    <h2>Mis pedidos</h2>
    <?php if (count($pedidos) == 0) { ?>
      <p>Todavía no hiciste ningún pedido.</p>
    <?php } else { ?>
      <table class="tabla">
        <tr><th>Pedido</th><th>Fecha</th><th>Total</th><th>Estado</th></tr>
        <?php foreach ($pedidos as $pedido) { ?>
          <tr>
            <td>Nº <?php echo $pedido->codigo; ?></td>
            <td><?php echo date("d/m/Y H:i", strtotime($pedido->fecha)); ?></td>
            <td><?php echo euros($pedido->total); ?> <small>(<?php echo pesos($pedido->total); ?>)</small></td>
            <td><?php echo $pedido->enviado ? "Enviado" : "Pendiente de envío"; ?></td>
          </tr>
        <?php } ?>
      </table>
    <?php } ?>
<?php require "inc/pie.php"; ?>
