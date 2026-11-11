<?php
// Clase Pedido: guarda el pedido en una transacción (RF-15, RF-16) y lista los pedidos de un usuario (RF-10)

class Pedido {
    public $codigo;
    public $fecha;
    public $enviado;    // 0 = no enviado, 1 = enviado
    public $usuario;
    public $total;      // no es columna: lo calcula la consulta con el precio guardado en cada línea

    // los pedidos de un usuario, del más nuevo al más viejo, con su total en euros
    public static function deUsuario($usuario) {
        $sql = "SELECT p.codigo, p.fecha, p.enviado, p.usuario, SUM(pp.unidades * pp.precio) AS total
                FROM pedidos p JOIN pedidos_productos pp ON pp.pedido = p.codigo
                WHERE p.usuario = ?
                GROUP BY p.codigo, p.fecha, p.enviado, p.usuario
                ORDER BY p.fecha DESC";
        $consulta = BaseDatos::conexion()->prepare($sql);
        $consulta->execute([$usuario]);
        return $consulta->fetchAll(PDO::FETCH_CLASS, "Pedido");
    }

    // RF-15 y RF-16: convierte el carrito en un pedido. Como insertar_pedido() del libro (4.4.10):
    // una fila en pedidos y una en pedidos_productos por cada producto, todo en una transacción.
    // Además, antes de guardar vuelve a comprobar el stock, y cada línea guarda el precio del día.
    // Devuelve el número del pedido nuevo, o false si el carrito está vacío o falta stock
    public static function guardar($usuario, $carrito) {
        if (!$carrito) {
            return false;
        }
        // en orden de código: si dos pedidos llevan los mismos productos, los bloquean en el mismo
        // orden y no se quedan esperando el uno al otro
        ksort($carrito);

        $bd = BaseDatos::conexion();
        $bd->beginTransaction();
        try {
            // RF-16: el stock y el precio se vuelven a leer. FOR UPDATE bloquea esas filas hasta el
            // commit: si otro cliente confirma a la vez, espera, y cuando le toca ya ve el stock descontado
            $leer = $bd->prepare("SELECT precio, stock FROM productos WHERE codigo = ? FOR UPDATE");
            $precios = [];
            foreach ($carrito as $codigo => $unidades) {
                $leer->execute([$codigo]);
                $producto = $leer->fetch(PDO::FETCH_ASSOC);
                if (!$producto || $producto['stock'] < $unidades) {
                    $bd->rollBack(); // no se guardó nada todavía; se sueltan los bloqueos
                    return false;
                }
                $precios[$codigo] = $producto['precio'];
            }

            // la fila del pedido; "enviado" queda en 0 (pendiente de envío), su valor por defecto
            $bd->prepare("INSERT INTO pedidos (fecha, usuario) VALUES (NOW(), ?)")->execute([$usuario]);
            $pedido = $bd->lastInsertId(); // el número que le dio AUTO_INCREMENT

            // RF-15: una línea por producto con sus unidades y el precio del día, y el stock descontado
            $linea = $bd->prepare("INSERT INTO pedidos_productos (pedido, producto, unidades, precio) VALUES (?, ?, ?, ?)");
            $stock = $bd->prepare("UPDATE productos SET stock = stock - ? WHERE codigo = ?");
            foreach ($carrito as $codigo => $unidades) {
                $linea->execute([$pedido, $codigo, $unidades, $precios[$codigo]]);
                $stock->execute([$unidades, $codigo]);
            }

            $bd->commit(); // recién acá queda todo guardado
            return (int)$pedido;
        } catch (PDOException $e) {
            // algo falló a mitad de camino: se deshace todo, no queda un pedido a medias (RF-15)
            if ($bd->inTransaction()) {
                $bd->rollBack();
            }
            throw $e; // procesar_pedido.php muestra el error
        }
    }
}
