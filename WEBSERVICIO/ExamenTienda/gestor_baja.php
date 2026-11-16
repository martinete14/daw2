<?php
// ExamenTienda - La Pulpería
// Baja de un producto (RF-04). Como eliminar.php: no muestra nada, recibe por POST el código ("cod"),
// da de baja el producto y vuelve al gestor con el aviso en la URL.
// Un producto que ya está en algún pedido no se borra: Producto::borrar() devuelve false.
require "config.php";
Usuario::comprobarAdmin();

$destino = "gestor.php";
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $producto = Producto::buscar((int)($_POST['cod'] ?? 0));
    if ($producto) {
        if ($producto->borrar()) {
            // ya no está en la base: el aviso lleva su nombre
            $destino = "gestor.php?" . http_build_query(['baja' => $producto->nombre]);
        } else {
            $destino = "gestor.php?enpedidos=$producto->codigo#p-$producto->codigo";
        }
    }
}
header("Location: $destino");
exit;
