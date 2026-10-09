<?php
session_start();

// el login dura un minuto
$duracion = 60;

// si no está logeado, o pasó más de un minuto desde el login, lo mando al inicio
if (!isset($_SESSION["usuario"]) || time() - $_SESSION["hora"] > $duracion) {
    // borro la sesión para que en el inicio le vuelva a salir el formulario
    session_destroy();
    header("Location: inicio.php");
    exit;
}

// cuántos segundos le quedan antes de tener que logearse de nuevo
$quedan = $duracion - (time() - $_SESSION["hora"]);

$titulo = "Comprar";
require "../comun/cabecera.php";
?>
    <p class="ok">Tu login sigue activo, podés comprar.</p>
    <p>Te quedan <?php echo $quedan; ?> segundos antes de tener que volver a logearte.</p>

    <a href="inicio.php">Volver al inicio</a>
<?php require "../comun/pie.php"; ?>
