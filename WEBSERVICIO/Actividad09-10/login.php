<?php
session_start();

// usuarios del sitio, todavía sin base de datos: usuario => contraseña
$usuarios = ["Riquelme" => "1234", "Robben" => "abcd"];

$usuario = $_POST["usuario"];
$clave = $_POST["clave"];

// el usuario tiene que existir en el array y la contraseña coincidir
if (isset($usuarios[$usuario]) && $usuarios[$usuario] == $clave) {
    // guardo el usuario en la sesión y lo mando de vuelta al inicio
    $_SESSION["usuario"] = $usuario;
    header("Location: inicio.php");
    exit;
}

$titulo = "Login";
require "../comun/cabecera.php";

echo "<p class='error'>Usuario o contraseña incorrectos.</p>";
echo "<a href='inicio.php'>Volver a intentar</a>";

require "../comun/pie.php";
