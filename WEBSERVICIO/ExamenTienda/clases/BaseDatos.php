<?php
// Clase BaseDatos: abre la conexión PDO una sola vez y la comparte con el resto de clases (RNF-02)

class BaseDatos {
    // la conexión se guarda acá la primera vez y después se reutiliza
    private static $conexion = null;

    public static function conexion() {
        if (self::$conexion === null) {
            try {
                $cadena = "mysql:dbname=" . BD_NOMBRE . ";host=" . BD_HOST . ";charset=utf8mb4";
                self::$conexion = new PDO($cadena, BD_USUARIO, BD_CLAVE);
                // que un error de SQL salte como excepción en vez de fallar callado
                self::$conexion->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            } catch (PDOException $e) {
                // no muestro el mensaje de PDO porque puede tener datos de la conexión
                die("No se pudo conectar con la base de datos. ¿Está encendido MySQL en XAMPP?");
            }
        }
        return self::$conexion;
    }
}
