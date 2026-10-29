<?php
// ActividadFichero
// Ejemplo de la 3.8.1: recorrer empleados.xml con simplexml_load_file()

// simplexml_load_file() devuelve un objeto SimpleXMLElement con el fichero
$datos = simplexml_load_file("empleados.xml");
if ($datos === false) {
    echo "Error al leer el fichero";
}
// recorrido como un array, da los hijos del elemento raíz (los empleados)
foreach ($datos as $valor) {
    print_r($valor);
    echo "<br>";
}
