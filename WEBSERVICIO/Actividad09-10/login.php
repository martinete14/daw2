<?php
session_start();

// sin base de datos
$usuarios = ["Riquelme" => "1234", "Robben" => "abcd"];

$usuario = $_POST["usuario"];
$clave = $_POST["clave"];

// el usuario tiene que existir en el array y la contraseña coincidir
if (isset($usuarios[$usuario]) && $usuarios[$usuario] == $clave) {
    // guardo el usuario y la hora del login en la sesión, y lo mando de vuelta al inicio
    // time() da la hora actual en segundos
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
