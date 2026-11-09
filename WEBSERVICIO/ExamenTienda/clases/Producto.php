<?php
// Clase Producto: lee los productos de una categoría o uno por su código, y consulta el stock (RF-02, RF-03)

class Producto {
    // una propiedad por columna de la tabla productos
    public $codigo;
    public $nombre;
    public $descripcion;
    public $peso;       // en gramos
    public $precio;     // en euros
    public $stock;
    public $imagen;     // ruta, por ejemplo img/productos/playadito.jpg
    public $categoria;  // código de la categoría

    // los productos de una categoría, como objetos Producto
    public static function deCategoria($categoria) {
        $consulta = BaseDatos::conexion()->prepare("SELECT * FROM productos WHERE categoria = ? ORDER BY codigo");
        $consulta->execute([$categoria]);
        return $consulta->fetchAll(PDO::FETCH_CLASS, "Producto");
    }

    // un producto por su código, o false si no existe
    public static function buscar($codigo) {
        $consulta = BaseDatos::conexion()->prepare("SELECT * FROM productos WHERE codigo = ?");
        $consulta->execute([$codigo]);
        $consulta->setFetchMode(PDO::FETCH_CLASS, "Producto");
        return $consulta->fetch();
    }

    // RF-03: con stock 0 no se puede añadir al carrito
    public function sinStock() {
        return $this->stock <= 0;
    }

    // 1000 -> "1 kg", 500 -> "500 g"
    public function pesoTexto() {
        return $this->peso >= 1000 ? ($this->peso / 1000) . " kg" : $this->peso . " g";
    }

    // las imágenes van llegando de a poco: si todavía no está, la página muestra un aviso
    public function tieneImagen() {
        return file_exists(__DIR__ . "/../" . $this->imagen);
    }
}
