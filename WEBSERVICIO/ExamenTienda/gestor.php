<?php
// ExamenTienda - La Pulpería
// Gestor de productos (RF-04), solo para el administrador. A la izquierda, todos los productos con su
// categoría, precio y stock; a la derecha, el formulario, que sirve para el alta (vacío) y para
// modificar (gestor.php?cod=5 lo llena con los datos del producto 5).
// Como en login.php, el formulario se manda a esta misma página: si falta un dato, vuelve con lo escrito.
// La baja la hace gestor_baja.php.
require "config.php";
Usuario::comprobarAdmin();

$categorias = Categoria::todas();
// el nombre de cada categoría por su código: [1 => "Yerbas", 2 => "Mates y bombillas", ...]
$nombresCategoria = array_column($categorias, "nombre", "codigo");
$error = false;

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // un Producto con lo que llegó del formulario. El código va oculto: 0 es un alta
    $producto = new Producto();
    $producto->codigo = (int)($_POST['cod'] ?? 0);
    $producto->nombre = trim($_POST['nombre'] ?? "");
    $producto->descripcion = trim($_POST['descripcion'] ?? "");
    $producto->categoria = (int)($_POST['categoria'] ?? 0);
    $producto->tipo = trim($_POST['tipo'] ?? "");
    // (float) y (int) convierten lo que llega en un número, como en anadir.php: "abc" -> 0
    $producto->precio = (float)($_POST['precio'] ?? 0);
    $producto->stock = (int)($_POST['stock'] ?? 0);
    $producto->peso = (int)($_POST['peso'] ?? 0);
    $producto->imagen = trim($_POST['imagen'] ?? "");

    // ningún texto vacío, precio y peso mayores que 0, stock no negativo y una categoría que exista
    if ($producto->nombre == "" || $producto->descripcion == "" || $producto->tipo == "" || $producto->imagen == ""
        || $producto->precio <= 0 || $producto->peso <= 0 || $producto->stock < 0
        || !isset($nombresCategoria[$producto->categoria])) {
        $error = true;
    } else {
        if ($producto->codigo) {
            $producto->modificar();
            $aviso = "modificado";
        } else {
            $producto->insertar(); // ahora $producto->codigo es el que le dio la base
            $aviso = "alta";
        }
        // vuelve a la fila del producto con el aviso en la URL, como anadir.php.
        // Al redirigir, recargar la página no lo guarda otra vez
        header("Location: gestor.php?$aviso=$producto->codigo#p-$producto->codigo");
        exit;
    }
} else {
    // gestor.php?cod=5: el formulario se llena con el producto 5
    $producto = Producto::buscar($_GET['cod'] ?? 0);
    if (!$producto) {
        $producto = new Producto(); // sin cod, o si no existe: formulario vacío para el alta
    }
}

$productos = Producto::todos();

// avisos que llegan en la URL: ?alta=71, ?modificado=5, ?enpedidos=11 (de gestor_baja.php) o ?baja=nombre
$alta = (int)($_GET['alta'] ?? 0);
$modificado = (int)($_GET['modificado'] ?? 0);
$enPedidos = (int)($_GET['enpedidos'] ?? 0);
$baja = $_GET['baja'] ?? "";
$avisado = null; // el producto del aviso, se busca en la tabla

$titulo = "Gestor de productos";
require "inc/cabecera.php";
?>
    <div class="gestor-cabeza">
      <div>
        <p class="nota">solo para el administrador</p>
        <h1 class="pagina-titulo" data-anima="letras">Gestor de productos</h1>
      </div>
      <a class="boton boton-chico" href="gestor.php#formulario"><i class="ph-bold ph-plus" aria-hidden="true"></i> Nuevo producto</a>
    </div>

    <div class="gestor">
      <div class="tabla-envoltura">
        <table class="tabla">
          <thead>
            <tr><th>Nº</th><th>Producto</th><th>Categoría</th><th>Precio</th><th>Stock</th><th><span class="oculto">Acciones</span></th></tr>
          </thead>
          <tbody>
            <?php foreach ($productos as $fila) {
                if (in_array($fila->codigo, [$alta, $modificado, $enPedidos])) {
                    $avisado = $fila;
                }
                $nombre = htmlspecialchars($fila->nombre); ?>
              <!-- id="p-codigo": después de guardar, la página vuelve a esta fila -->
              <tr class="cat-<?php echo $fila->categoria; ?>" id="p-<?php echo $fila->codigo; ?>">
                <td><?php echo $fila->codigo; ?></td>
                <td class="linea-producto">
                  <?php if ($fila->tieneImagen()) { ?>
                    <img src="<?php echo htmlspecialchars($fila->imagen); ?>" alt="" width="64" height="64" loading="lazy">
                  <?php } ?>
                  <span>
                    <?php echo $nombre; ?>
                    <?php if ($fila->pedidos > 0) { ?>
                      <small>Está en pedidos: no se puede dar de baja</small>
                    <?php } ?>
                  </span>
                </td>
                <td><?php echo htmlspecialchars($nombresCategoria[$fila->categoria]); ?></td>
                <td><?php echo euros($fila->precio); ?></td>
                <td<?php if ($fila->sinStock()) echo ' class="stock-cero"'; ?>><?php echo $fila->stock; ?></td>
                <td>
                  <div class="acciones-fila">
                    <!-- Modificar es un enlace: solo abre el formulario. La baja es un formulario POST,
                         como Quitar en el carrito, porque cambia la base de datos -->
                    <a class="quitar" href="gestor.php?cod=<?php echo $fila->codigo; ?>#formulario" aria-label="Modificar <?php echo $nombre; ?>"><i class="ph-bold ph-pencil-simple" aria-hidden="true"></i> Modificar</a>
                    <form action="gestor_baja.php" method="post">
                      <input type="hidden" name="cod" value="<?php echo $fila->codigo; ?>">
                      <button class="quitar" type="submit" aria-label="Dar de baja <?php echo $nombre; ?>"<?php if ($fila->pedidos > 0) echo " disabled"; ?>><i class="ph-bold ph-trash" aria-hidden="true"></i> Baja</button>
                    </form>
                  </div>
                </td>
              </tr>
            <?php } ?>
          </tbody>
        </table>
      </div>

      <!-- el mismo formulario sirve para el alta (vacío) y para modificar (con los datos del producto) -->
      <aside class="ficha-form" id="formulario">
        <h2><?php echo $producto->codigo ? "Modificar producto Nº " . $producto->codigo : "Nuevo producto"; ?></h2>

        <?php if ($error) { ?>
          <p class="error"><i class="ph-bold ph-warning-circle" aria-hidden="true"></i> Revisá los datos: no puede quedar ningún campo vacío, el precio y el peso tienen que ser mayores que 0 y el stock no puede ser negativo.</p>
        <?php } ?>

        <form action="gestor.php#formulario" method="post">
          <input type="hidden" name="cod" value="<?php echo $producto->codigo; ?>">
          <!-- maxlength: lo que entra en cada columna de la tabla productos -->
          <div class="campo">
            <label for="nombre">Nombre</label>
            <input type="text" id="nombre" name="nombre" maxlength="100" required value="<?php echo htmlspecialchars($producto->nombre ?? ""); ?>">
          </div>
          <div class="campo">
            <label for="descripcion">Descripción</label>
            <textarea id="descripcion" name="descripcion" maxlength="300" required><?php echo htmlspecialchars($producto->descripcion ?? ""); ?></textarea>
          </div>
          <div class="campos-dos">
            <div class="campo">
              <label for="categoria">Categoría</label>
              <select id="categoria" name="categoria">
                <?php foreach ($categorias as $categoria) { ?>
                  <option value="<?php echo $categoria->codigo; ?>"<?php if ($categoria->codigo == $producto->categoria) echo " selected"; ?>><?php echo htmlspecialchars($categoria->nombre); ?></option>
                <?php } ?>
              </select>
            </div>
            <div class="campo">
              <label for="tipo">Tipo</label>
              <input type="text" id="tipo" name="tipo" maxlength="30" required placeholder="Con palo, Bombillas…" value="<?php echo htmlspecialchars($producto->tipo ?? ""); ?>">
            </div>
            <div class="campo">
              <label for="precio">Precio (€)</label>
              <input type="number" id="precio" name="precio" step="0.01" min="0.01" required value="<?php echo $producto->precio; ?>">
            </div>
            <div class="campo">
              <label for="stock">Stock</label>
              <input type="number" id="stock" name="stock" min="0" required value="<?php echo $producto->stock; ?>">
            </div>
            <div class="campo">
              <label for="peso">Peso (g)</label>
              <input type="number" id="peso" name="peso" min="1" required value="<?php echo $producto->peso; ?>">
            </div>
            <div class="campo">
              <label for="imagen">Imagen</label>
              <input type="text" id="imagen" name="imagen" maxlength="150" required placeholder="img/productos/….jpg" value="<?php echo htmlspecialchars($producto->imagen ?? ""); ?>">
            </div>
          </div>

          <button class="boton" type="submit">
            <i class="ph-bold ph-floppy-disk" aria-hidden="true"></i> <?php echo $producto->codigo ? "Guardar cambios" : "Dar de alta"; ?>
          </button>
        </form>

        <?php if ($producto->codigo) { ?>
          <a class="volver" href="gestor.php#formulario"><i class="ph-bold ph-x" aria-hidden="true"></i> Cancelar y crear uno nuevo</a>
        <?php } ?>
        <p class="nota-baja">Un producto que ya está en algún pedido no se puede dar de baja, para no romper los pedidos antiguos.</p>
      </aside>
    </div>

    <?php if ($avisado) { ?>
      <!-- el aviso va fijo abajo, como el de "añadiste…", porque la página se abre en la fila del producto -->
      <p class="avisito cat-<?php echo $avisado->categoria; ?><?php if ($avisado->codigo == $enPedidos) echo " tope"; ?>" role="status">
        <i class="ph-bold <?php echo $avisado->codigo == $enPedidos ? "ph-info" : "ph-check-circle"; ?>" aria-hidden="true"></i>
        <span>
          <?php if ($avisado->codigo == $alta) { ?>
            Diste de alta <strong><?php echo htmlspecialchars($avisado->nombre); ?></strong> con el Nº <?php echo $avisado->codigo; ?>.
          <?php } elseif ($avisado->codigo == $modificado) { ?>
            Guardaste los cambios de <strong><?php echo htmlspecialchars($avisado->nombre); ?></strong>.
          <?php } else { ?>
            <strong><?php echo htmlspecialchars($avisado->nombre); ?></strong> está en pedidos: no se puede dar de baja.
          <?php } ?>
        </span>
        <?php if ($avisado->codigo != $enPedidos) { ?>
          <a href="productos.php?categoria=<?php echo $avisado->categoria; ?>#p-<?php echo $avisado->codigo; ?>">Ver en la tienda <i class="ph-bold ph-arrow-right" aria-hidden="true"></i></a>
        <?php } ?>
      </p>
    <?php } elseif ($baja != "") { ?>
      <!-- el producto ya no existe: el nombre viaja en la URL -->
      <p class="avisito" role="status">
        <i class="ph-bold ph-check-circle" aria-hidden="true"></i>
        <span>Diste de baja <strong><?php echo htmlspecialchars($baja); ?></strong>.</span>
      </p>
    <?php } ?>
<?php require "inc/pie.php"; ?>
