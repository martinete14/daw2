<?php
// datos para conectarme a la base empresa, igual que en el libro
$cadena_conexion = "mysql:dbname=empresa;host=127.0.0.1";
$usuario = "root";
$clave = "";

$titulo = "Datos del usuario";
require "../comun/cabecera.php";

if (!isset($_POST["codigo"]) || !is_numeric($_POST["codigo"])) {
    echo "<p class='error'>Error: el código tiene que ser un número.</p>";
} else {
    $codigo = $_POST["codigo"];

    try {
        $bd = new PDO($cadena_conexion, $usuario, $clave);

        // SELECT * trae todas las columnas del usuario: codigo, nombre, clave y rol
        $sql = "SELECT * FROM usuarios WHERE codigo = $codigo";
        $usuarios = $bd->query($sql);

        // rowCount dice cuántas filas devolvió la consulta
        if ($usuarios->rowCount() == 0) {
            echo "<p class='error'>No hay ningún usuario con el código $codigo</p>";
        }

        // como el código es clave primaria, como mucho viene una fila
        foreach ($usuarios as $fila) {
            echo "<p class='ok'>Datos del usuario con código $codigo:</p>";
            echo "<ul class='resultados'>";
            echo "<li>Código: " . $fila["codigo"] . "</li>";
            echo "<li>Nombre: " . htmlspecialchars($fila["nombre"]) . "</li>";
            echo "<li>Clave: " . htmlspecialchars($fila["clave"]) . "</li>";
            echo "<li>Rol: " . $fila["rol"] . "</li>";
            echo "</ul>";
        }
    } catch (PDOException $e) {
        echo "<p class='error'>Error con la base de datos: " . $e->getMessage() . "</p>";
    }
}

echo "<a href='index.php'>Buscar otro usuario</a>";
require "../comun/pie.php";
