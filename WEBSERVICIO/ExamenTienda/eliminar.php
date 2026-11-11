<?php
// ExamenTienda - La Pulpería
// Quitar del carrito (RF-14). Como eliminar.php del libro (4.4.8): no muestra nada, recibe por POST
// el código ("cod") y las unidades que hay que quitar, cambia el carrito y vuelve a carrito.php.
// El botón − manda 1 unidad; el botón Quitar manda todas las que hay, y el producto sale del carrito.
require "config.php";
Usuario::comprobarSesion();

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $unidades = (int)($_POST['unidades'] ?? 0);
    if ($unidades >= 1) {
        Carrito::quitar((int)($_POST['cod'] ?? 0), $unidades);
    }
}
header("Location: carrito.php");
exit;
