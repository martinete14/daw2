<?php
// Clase Producto: lee los productos de una categoría (todos o de un tipo), uno por su código o varios
// por sus códigos (los del carrito), y consulta el stock (RF-02, RF-03, RF-13, RF-18).
// Para el gestor, lista todos los productos y los da de alta, los modifica y los da de baja (RF-04)

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
    // no es columna: la calcula todos() para el gestor
    public $pedidos;    // en cuántos pedidos aparece; si es más de 0, no se puede dar de baja (RF-04)

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

    // varios productos por sus códigos (los del carrito), en una sola consulta.
    // El libro arma el IN pegando los códigos con implode (cargar_productos, 4.4.10); acá cada
    // código lleva su ? y los valores van aparte, como en el resto de las consultas (RNF-02)
    public static function varios($codigos) {
        if (!$codigos) {
            return []; // "IN ()" vacío es un error de SQL
        }
        // 3 códigos -> "?, ?, ?": en la consulta solo se pegan signos de pregunta, nunca un dato
        $huecos = implode(", ", array_fill(0, count($codigos), "?"));
        $consulta = BaseDatos::conexion()->prepare("SELECT * FROM productos WHERE codigo IN ($huecos)");
        $consulta->execute(array_values($codigos));
        return $consulta->fetchAll(PDO::FETCH_CLASS, "Producto");
    }

    // RF-04: todos los productos para el gestor, ordenados por categoría, con la cantidad de pedidos
    // en los que aparece cada uno (la subconsulta cuenta sus líneas en pedidos_productos)
    public static function todos() {
        $sql = "SELECT p.*,
                    (SELECT COUNT(*) FROM pedidos_productos pp WHERE pp.producto = p.codigo) AS pedidos
                FROM productos p
                ORDER BY p.categoria, p.codigo";
        $consulta = BaseDatos::conexion()->query($sql);
        return $consulta->fetchAll(PDO::FETCH_CLASS, "Producto");
    }

    // RF-04: alta. Guarda este producto como uno nuevo; la base le da el código (AUTO_INCREMENT)
    public function insertar() {
        $bd = BaseDatos::conexion();
        $consulta = $bd->prepare("INSERT INTO productos (nombre, descripcion, peso, precio, stock, imagen, tipo, categoria)
                                  VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
        $consulta->execute([$this->nombre, $this->descripcion, $this->peso, $this->precio,
                            $this->stock, $this->imagen, $this->tipo, $this->categoria]);
        $this->codigo = (int)$bd->lastInsertId();
    }

    // RF-04: modificación. Cambia en la base los datos del producto con este código
    public function modificar() {
        $consulta = BaseDatos::conexion()->prepare("UPDATE productos SET nombre = ?, descripcion = ?, peso = ?, precio = ?,
                                  stock = ?, imagen = ?, tipo = ?, categoria = ? WHERE codigo = ?");
        $consulta->execute([$this->nombre, $this->descripcion, $this->peso, $this->precio,
                            $this->stock, $this->imagen, $this->tipo, $this->categoria, $this->codigo]);
    }

    // RF-04: baja. Si el producto aparece en algún pedido no se borra, para no romper los pedidos
    // antiguos, y devuelve false (la clave ajena de pedidos_productos tampoco dejaría borrarlo)
    public function borrar() {
        $bd = BaseDatos::conexion();
        $consulta = $bd->prepare("SELECT COUNT(*) FROM pedidos_productos WHERE producto = ?");
        $consulta->execute([$this->codigo]);
        if ($consulta->fetchColumn() > 0) {
            return false;
        }
        $bd->prepare("DELETE FROM productos WHERE codigo = ?")->execute([$this->codigo]);
        return true;
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
