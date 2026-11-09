<?php
// Clase Categoria: lee las categorías de la base de datos (RF-01)

class Categoria {
    // una propiedad por columna de la tabla categorias
    public $codigo;
    public $nombre;
    public $descripcion;

    // todas las categorías, como objetos Categoria
    public static function todas() {
        $consulta = BaseDatos::conexion()->query("SELECT * FROM categorias ORDER BY codigo");
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
