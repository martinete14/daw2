<?php
// Clase Producto: lee los productos de una categoría (todos o de un tipo) o uno por su código, y consulta el stock (RF-02, RF-03, RF-18)

class Producto {
    // una propiedad por columna de la tabla productos
    public $codigo;
    public $nombre;
    public $descripcion;
    public $peso;       // en gramos
    public $precio;     // en euros
    public $stock;
    public $imagen;     // ruta, por ejemplo img/productos/playadito.jpg
    public $tipo;       // tipo dentro de la categoría, por ejemplo "Con palo" (RF-18)
    public $categoria;  // código de la categoría

    // los productos de una categoría, como objetos Producto.
    // Si llega un tipo, solo los de ese tipo (RF-18): se suma "AND tipo = ?" a la consulta
    public static function deCategoria($categoria, $tipo = "") {
        $sql = "SELECT * FROM productos WHERE categoria = ?";
        $datos = [$categoria];
        if ($tipo != "") {
            $sql .= " AND tipo = ?";
            $datos[] = $tipo;
        }
        $consulta = BaseDatos::conexion()->prepare($sql . " ORDER BY codigo");
        $consulta->execute($datos);
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

    // la animación es un gif con el mismo nombre que la imagen (playadito.jpg -> playadito.gif).
    // Devuelve su ruta, o false si ese producto todavía no tiene gif
    public function gif() {
        $gif = preg_replace('/\.jpg$/', '.gif', $this->imagen);
        return file_exists(__DIR__ . "/../" . $gif) ? $gif : false;
    }
}
