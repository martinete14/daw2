<?php
    $cadena_conexion = 'mysql:dbname=microservicios;host=127.0.0.1;port=3306';
    $usuario = 'root';
    $clave = '';
    try {
        $bd = new PDO($cadena_conexion, $usuario, $clave);
    }
    catch (PDOException $e) {
        echo "Error de conexión: " . $e->getMessage();
        exit;
    }
?>
