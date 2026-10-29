<?php
// setcookie() tiene que ir antes de cualquier echo o HTML,
// porque la cookie viaja en las cabeceras de la respuesta
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // eligió un color en el formulario: lo guardo en la cookie por 30 días
    $color = $_POST["color"];
    setcookie("color", $color, time() + 3600 * 24 * 30);
} else if (isset($_COOKIE["color"])) {
    // ya había elegido antes: uso el color que quedó en la cookie
    $color = $_COOKIE["color"];
} else {
    // primera vez que entra: fondo blanco
    $color = "white";
}
?>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Color de fondo</title>
</head>
<body style="background-color: <?php echo $color; ?>">
    <form action="index.php" method="post">
        Elegí el color de fondo
        <select name="color">
            <option value="white">Blanco</option>
            <option value="lightblue">Celeste</option>
            <option value="lightgreen">Verde</option>
            <option value="lightyellow">Amarillo</option>
            <option value="pink">Rosa</option>
        </select>
        <input type="submit" value="Guardar">
    </form>
</body>
</html>
