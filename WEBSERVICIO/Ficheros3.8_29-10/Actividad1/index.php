<?php
// ActividadColorFondo
// Ejercicio propuesto 1 del tema 3: formulario para elegir el color de fondo,
// la elección se guarda en una cookie y la próxima vez la página sale con ese color

// setcookie() tiene que ir antes de cualquier echo o HTML,
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // el color elegido se guarda en cookie por 30 días
    $color = $_POST["color"];
    setcookie("color", $color, time() + 3600 * 24 * 30);
} else if (isset($_COOKIE["color"])) {
    // ya había elegido antes: uso el color que quedó en la cookie
    $color = $_COOKIE["color"];
} else {
    // fondo base color blanco
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
            <option value="lightgray">Gris</option>
            <option value="orange">Naranja</option>
            <option value="purple">Morado</option>
            <option value="red">Rojo</option>
            <option value="brown">Marrón</option>
            <option value="black">Negro</option>
        </select>
        <input type="submit" value="Guardar">
    </form>
</body>
</html>
