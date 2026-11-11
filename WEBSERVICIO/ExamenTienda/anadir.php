<?php
// ExamenTienda - La Pulpería
// Añadir al carrito (RF-12). Como anadir.php del libro (4.4.6): no muestra nada, recibe por POST
// el código ("cod") y las unidades, cambia el carrito y redirige.
// A diferencia del libro, no deja pasar del stock y vuelve a la tarjeta del producto en vez de ir
// al carrito (ejercicio propuesto 1 del capítulo 4). Desde el botón + del carrito, vuelve al carrito.
require "config.php";
Usuario::comprobarSesion();

// solo se llega con un formulario (POST); si se abre la dirección a mano, a las categorías
if ($_SERVER["REQUEST_METHOD"] != "POST") {
    header("Location: categorias.php");
    exit;
}

// (int) convierte lo que llega en un número entero: "abc" -> 0, "2.5" -> 2
$codigo = (int)($_POST['cod'] ?? 0);
$unidades = (int)($_POST['unidades'] ?? 0);
$producto = Producto::buscar($codigo);

if (!$producto) {
    header("Location: categorias.php");
    exit;
}

// "anadido" o "tope" viajan en la URL para que la página siguiente muestre el aviso.
// Con unidades de menos de 1 o un producto sin stock (RF-03) el carrito no se toca y no hay aviso
$aviso = "";
if ($unidades >= 1 && !$producto->sinStock()) {
    $aviso = Carrito::anadir($codigo, $unidades, $producto->stock) ? "anadido" : "tope";
}

if (($_POST['volver'] ?? "") == "carrito") {
    $destino = "carrito.php" . ($aviso == "tope" ? "?tope=$codigo" : "");
} else {
    // de vuelta a la categoría del producto, con el mismo filtro por tipo, y a su tarjeta (#p-codigo)
    $datos = ['categoria' => $producto->categoria];
    if (($_POST['tipo'] ?? "") != "") {
        $datos['tipo'] = $_POST['tipo'];
    }
    if ($aviso != "") {
        $datos[$aviso] = $codigo;
    }
    $destino = "productos.php?" . http_build_query($datos) . "#p-$codigo";
}
header("Location: $destino");
exit;
