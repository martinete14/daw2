<?php
// ExamenTienda - La Pulpería
// Cerrar sesión (RF-11): borra la sesión y vuelve al login. La cookie recordar_correo se queda.
require "config.php";
Usuario::cerrarSesion();
header("Location: login.php");
exit;
