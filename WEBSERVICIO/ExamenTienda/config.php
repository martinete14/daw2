<?php
// ExamenTienda - La Pulpería
// Configuración: lo incluyen todas las páginas. Datos de la BD, la cotización,
// el tiempo de inactividad, las clases y el arranque de la sesión.

// datos para conectarse a la base pulperia (XAMPP)
const BD_HOST = "127.0.0.1";
const BD_NOMBRE = "pulperia";
const BD_USUARIO = "root";
const BD_CLAVE = "";

// cotización fija, el único lugar donde está (RNF-05). Si cambia, se cambia acá.
const COTIZACION_ARS = 1700;

// minutos sin actividad hasta que caduca la sesión (RF-09)
const MINUTOS_INACTIVIDAD = 10;

// cada vez que se usa una clase, PHP carga su archivo de la carpeta clases
spl_autoload_register(function ($clase) {
    require __DIR__ . "/clases/" . $clase . ".php";
});

// la cookie de sesión (PHPSESSID): HttpOnly, JavaScript no la puede leer; SameSite=Lax, el
// navegador no la manda en formularios que vengan de otra web, así otra página no puede
// hacer un pedido en nombre del usuario
session_set_cookie_params(['httponly' => true, 'samesite' => 'Lax']);

// todas las páginas usan la sesión, así que se arranca acá una sola vez
session_start();

// 7.9 -> "7,90 €"
function euros($precio) {
    return number_format($precio, 2, ",", ".") . " €";
}

// 7.9 -> "13.430 ARS" (el precio en euros por la cotización)
function pesos($precio) {
    return number_format($precio * COTIZACION_ARS, 0, ",", ".") . " ARS";
}
