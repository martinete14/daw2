<?php
// ExamenTienda - La Pulpería
// Perfil (RF-10): los datos del usuario leídos de la BD y la lista de sus pedidos
require "config.php";
Usuario::comprobarSesion();

// el código sale de la sesión, así cada uno solo ve su propio perfil
$usuario = Usuario::buscar($_SESSION['usuario']['codigo']);
$pedidos = Pedido::deUsuario($usuario->codigo);

// iniciales para el círculo: primera letra del primer y del último nombre ("Juan Román Riquelme" -> "JR").
// mb_substr y no substr, para que una tilde o una ñ no se corte por la mitad
$nombres = explode(" ", $usuario->nombre);
$iniciales = mb_substr($nombres[0], 0, 1) . mb_substr(end($nombres), 0, 1);

$titulo = "Mi perfil";
require "inc/cabecera.php";
?>
    <section class="ficha">
      <span class="avatar" aria-hidden="true"><?php echo htmlspecialchars($iniciales); ?></span>
      <div>
        <p class="nota">tu ficha de cliente</p>
        <h1 data-anima="letras"><?php echo htmlspecialchars($usuario->nombre); ?></h1>
        <dl class="datos">
          <div><dt>Correo</dt><dd><?php echo htmlspecialchars($usuario->correo); ?></dd></div>
          <div><dt>Dirección</dt><dd><?php echo htmlspecialchars($usuario->direccion); ?></dd></div>
          <div><dt>Ciudad</dt><dd><?php echo htmlspecialchars($usuario->ciudad); ?></dd></div>
          <div><dt>Código postal</dt><dd><?php echo htmlspecialchars($usuario->cp); ?></dd></div>
          <div><dt>País</dt><dd><?php echo htmlspecialchars($usuario->pais); ?></dd></div>
          <div><dt>Cliente desde</dt><dd><?php echo date("d/m/Y", strtotime($usuario->fecha_alta)); ?></dd></div>
        </dl>
      </div>
    </section>

    <h2 class="seccion-titulo">Mis pedidos <small><?php echo count($pedidos); ?> en total</small></h2>
    <?php if (count($pedidos) == 0) { ?>
      <div class="vacio">
        <p>Todavía no hiciste ningún pedido.</p>
        <a class="boton boton-chico" href="categorias.php"><i class="ph-bold ph-storefront" aria-hidden="true"></i> Ir al almacén</a>
      </div>
    <?php } else { ?>
      <!-- la envoltura deja mover la tabla de costado en pantallas chicas -->
      <div class="tabla-envoltura">
        <table class="tabla">
          <tr><th>Pedido</th><th>Fecha</th><th>Total</th><th>Estado</th></tr>
          <?php foreach ($pedidos as $pedido) { ?>
            <tr>
              <td>Nº <?php echo $pedido->codigo; ?></td>
              <td><?php echo date("d/m/Y H:i", strtotime($pedido->fecha)); ?></td>
              <td><?php echo euros($pedido->total); ?> <small>(<?php echo pesos($pedido->total); ?>)</small></td>
              <td><span class="estado<?php if ($pedido->enviado) echo " enviado"; ?>"><?php echo $pedido->enviado ? "Enviado" : "Pendiente de envío"; ?></span></td>
            </tr>
          <?php } ?>
        </table>
      </div>
    <?php } ?>
<?php require "inc/pie.php"; ?>
