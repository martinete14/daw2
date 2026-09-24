<?php
$titulo = "Funciones anónimas";
require "../comun/cabecera.php";

// funciones anonimas guardadas en variables
$castellano = function ($texto) {
    return "Hola, " . $texto;
};
$ingles = function ($texto) {
    return "Hello, " . $texto;
};
$italiano = function ($texto) {
    return "Ciao, " . $texto;
};

// la funcion principal recibe otra funcion como parametro
function ejecutarProceso($callback)
{
    return $callback("Martín");
}

// le paso la funcion anonima como argumento
echo ejecutarProceso($castellano) . "<br>";
echo ejecutarProceso($ingles) . "<br>";
echo ejecutarProceso($italiano) . "<br>";
echo ejecutarProceso(function ($texto) {
    return "Olá, " . $texto;
}) . "<br>";

require "../comun/pie.php";
?>
