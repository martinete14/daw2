<?php
// Clase Carrito: maneja $_SESSION['carrito'], el carrito de la compra (RF-12, RF-13, RF-14, RF-17).
// Igual que en el libro (4.3.4): un array asociativo código de producto => unidades.
// Ejemplo: [4 => 2, 5 => 3] son 2 unidades del producto 4 y 3 del producto 5.
// En la sesión van solo los códigos y las unidades. El nombre, el precio y el stock se leen de la
// base de datos cada vez que se muestra el carrito, así están siempre al día (actividad 4.2 del libro).

class Carrito {
    // el carrito tal como está en la sesión; vacío si todavía no se añadió nada
    public static function contenido() {
        return $_SESSION['carrito'] ?? [];
    }

    // cuántas unidades hay de un producto (0 si no está en el carrito)
    public static function unidades($codigo) {
        return $_SESSION['carrito'][$codigo] ?? 0;
    }

    // el total de unidades, para el número del carrito en la cabecera
    public static function cantidad() {
        return array_sum(self::contenido());
    }

    // RF-12: suma unidades de un producto sin pasarse del stock. Si el código no estaba, se crea
    // el elemento; si estaba, se suman (libro, 4.3.4). La primera vez se crea $_SESSION['carrito'].
    // Quien la llama ya comprobó que el producto tiene stock (RF-03).
    // Devuelve true si entraron todas las unidades, false si hubo que recortar por el stock
    public static function anadir($codigo, $unidades, $stock) {
        $pedidas = self::unidades($codigo) + $unidades;
        $_SESSION['carrito'][$codigo] = min($pedidas, $stock);
        return $pedidas <= $stock;
    }

    // RF-14: resta unidades; si no queda ninguna, el producto sale del carrito (libro, 4.3.4)
    public static function quitar($codigo, $unidades) {
        if (!isset($_SESSION['carrito'][$codigo])) {
            return;
        }
        $_SESSION['carrito'][$codigo] -= $unidades;
        if ($_SESSION['carrito'][$codigo] <= 0) {
            unset($_SESSION['carrito'][$codigo]);
        }
    }

    // RF-17: después de confirmar el pedido, el carrito queda vacío
    public static function vaciar() {
        $_SESSION['carrito'] = [];
    }

    // RF-13: las líneas del carrito para mostrarlas, en el orden en que se añadieron.
    // Cada línea es un array con el producto (leído de la BD), sus unidades y su subtotal en euros
    public static function lineas() {
        // todos los productos del carrito en una sola consulta, guardados por su código
        $porCodigo = [];
        foreach (Producto::varios(array_keys(self::contenido())) as $producto) {
            $porCodigo[$producto->codigo] = $producto;
        }

        $lineas = [];
        foreach (self::contenido() as $codigo => $unidades) {
            if (!isset($porCodigo[$codigo])) {
                // el administrador lo dio de baja mientras estaba en el carrito: sale del carrito
                unset($_SESSION['carrito'][$codigo]);
                continue;
            }
            $producto = $porCodigo[$codigo];
            $lineas[] = [
                'producto' => $producto,
                'unidades' => $unidades,
                'subtotal' => $producto->precio * $unidades,
            ];
        }
        return $lineas;
    }

    // RF-13: la suma de los subtotales, en euros
    public static function total($lineas) {
        return array_sum(array_column($lineas, 'subtotal'));
    }
}
