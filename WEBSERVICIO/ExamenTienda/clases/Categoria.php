<?php
// Clase Categoria: lee las categorías de la base de datos (RF-01)

class Categoria {
    // una propiedad por columna de la tabla categorias
    public $codigo;
    public $nombre;
    public $descripcion;
    // no son columnas: las calcula todas() para el afiche de cada categoría
    public $cantidad;   // cuántos productos tiene
    public $imagen;     // la foto de su primer producto

    // todas las categorías, como objetos Categoria, con su cantidad de productos y una foto
    public static function todas() {
        $sql = "SELECT c.*,
                    (SELECT COUNT(*) FROM productos p WHERE p.categoria = c.codigo) AS cantidad,
                    (SELECT p.imagen FROM productos p WHERE p.categoria = c.codigo ORDER BY p.codigo LIMIT 1) AS imagen
                FROM categorias c
                ORDER BY c.codigo";
        $consulta = BaseDatos::conexion()->query($sql);
        return $consulta->fetchAll(PDO::FETCH_CLASS, "Categoria");
    }

    // una categoría por su código, o false si no existe
    public static function buscar($codigo) {
        $consulta = BaseDatos::conexion()->prepare("SELECT * FROM categorias WHERE codigo = ?");
        $consulta->execute([$codigo]);
        $consulta->setFetchMode(PDO::FETCH_CLASS, "Categoria");
        return $consulta->fetch();
    }
}
