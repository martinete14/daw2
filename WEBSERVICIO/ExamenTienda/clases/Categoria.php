<?php
// Clase Categoria: lee las categorías de la base de datos (RF-01) y los tipos de producto de cada una (RF-18)

class Categoria {
    // una propiedad por columna de la tabla categorias
    public $codigo;
    public $nombre;
    public $descripcion;
    // no son columnas: las calcula todas() para el afiche de cada categoría
    public $cantidad;   // cuántos productos tiene
    public $imagen;     // la foto de su primer producto
    public $desde;      // el precio más barato, para la lista de precios de la portada

    // todas las categorías, como objetos Categoria, con su cantidad de productos, una foto y el precio más barato
    public static function todas() {
        $sql = "SELECT c.*,
                    (SELECT COUNT(*) FROM productos p WHERE p.categoria = c.codigo) AS cantidad,
                    (SELECT MIN(p.precio) FROM productos p WHERE p.categoria = c.codigo) AS desde,
                    (SELECT p.imagen FROM productos p WHERE p.categoria = c.codigo ORDER BY p.codigo LIMIT 1) AS imagen
                FROM categorias c
                ORDER BY c.codigo";
        $consulta = BaseDatos::conexion()->query($sql);
        return $consulta->fetchAll(PDO::FETCH_CLASS, "Categoria");
    }

    // los tipos de producto de esta categoría y cuántos hay de cada uno, para el filtro (RF-18).
    // FETCH_KEY_PAIR arma el array con la primera columna de clave: ["Con palo" => 11, "Compuesta" => 3, ...]
    public function tipos() {
        $consulta = BaseDatos::conexion()->prepare(
            "SELECT tipo, COUNT(*) FROM productos WHERE categoria = ? GROUP BY tipo ORDER BY COUNT(*) DESC, tipo");
        $consulta->execute([$this->codigo]);
        return $consulta->fetchAll(PDO::FETCH_KEY_PAIR);
    }

    // una categoría por su código, o false si no existe
    public static function buscar($codigo) {
        $consulta = BaseDatos::conexion()->prepare("SELECT * FROM categorias WHERE codigo = ?");
        $consulta->execute([$codigo]);
        $consulta->setFetchMode(PDO::FETCH_CLASS, "Categoria");
        return $consulta->fetch();
    }
}
