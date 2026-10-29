<?php
// ActividadInsertarUsuario
// Ejercicio propuesto 4 del tema 3: formulario para insertar usuarios en la tabla usuarios
// de la base de datos empresa; abajo se ve la tabla como en la Actividad3

// datos conexión
$cadena_conexion = 'mysql:dbname=empresa;host=127.0.0.1';
$usuario = 'root';
$clave = '';
?>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Insertar usuario</title>
</head>
<body>
    <form action="index.php" method="post">
        Nombre <input type="text" name="nombre">
        Clave <input type="text" name="clave">
        Rol
        <select name="rol">
            <option value="0">Usuario</option>
            <option value="1">Administrador</option>
        </select>
        <input type="submit" value="Insertar">
    </form>
    <br>
<?php
try {
    // conectar
    $bd = new PDO($cadena_conexion, $usuario, $clave);

    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        // insertar nuevo usuario: los datos vienen del formulario, así que va con
        // una sentencia preparada; cada ? se cambia por el valor del array de execute()
        $ins = $bd->prepare("insert into usuarios(nombre, clave, rol) values(?, ?, ?)");
        $ins->execute(array($_POST['nombre'], $_POST['clave'], $_POST['rol']));
        echo "insert correcto <br>";
        echo "Filas insertadas: " . $ins->rowCount() . "<br>";
        // para los autoincrementos
        echo "Código de la fila insertada: " . $bd->lastInsertId() . "<br><br>";
    }

    $sql = 'SELECT codigo, nombre FROM usuarios';
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
        echo "</tr>";
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
