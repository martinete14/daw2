<?php
session_start();

$usuarios = ["Riquelme" => "1234", "Robben" => "abcd"];

$usuario = $_POST["usuario"];
$clave = $_POST["clave"];

// el usuario tiene que existir en el array y la contraseña coincidir
if (isset($usuarios[$usuario]) && $usuarios[$usuario] == $clave) {
    $_SESSION["usuario"] = $usuario;
    $_SESSION["hora"] = time();
    header("Location: inicio.php");
    exit;
}

$titulo = "Login";
require "../comun/cabecera.php";

echo "<p class='error'>Usuario o contraseña incorrectos.</p>";
echo "<a href='inicio.php'>Volver a intentar</a>";

require "../comun/pie.php";
