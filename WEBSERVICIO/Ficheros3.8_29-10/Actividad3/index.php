<?php
// ActividadTablaUsuarios
// Ejercicio propuesto 3 del tema 3: mostrar en una tabla los datos de la tabla usuarios
// de la base de datos empresa (la de ActividadBD09-10)

// datos conexión
$cadena_conexion = 'mysql:dbname=empresa;host=127.0.0.1';
$usuario = 'root';
$clave = '';
?>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Tabla de usuarios</title>
</head>
<body>
<?php
try {
    // conectar
    $bd = new PDO($cadena_conexion, $usuario, $clave);
    $sql = 'SELECT codigo, nombre, clave, rol FROM usuarios';
    $usuarios = $bd->query($sql);
?>
    <table border="3">
        <tr>
            <th>Código</th>
            <th>Nombre</th>
        </tr>
<?php
    // cada vuelta del foreach es una fila, con las columnas del select como claves
    foreach ($usuarios as $row) {
        echo "<tr>";
        echo "<td>" . $row['codigo'] . "</td>";
        echo "<td>" . $row['nombre'] . "</td>";
    }
?>
    </table>
<?php
} catch (PDOException $e) {
    echo 'Error con la base de datos: ' . $e->getMessage();
}
?>
</body>
</html>
