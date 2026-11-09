<?php
// Clase Pedido: lista los pedidos de un usuario (RF-10).
// Guardar el pedido en una transacción se agrega en la parte 3.

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
}
