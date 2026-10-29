<?php
// ActividadFichero
// Ejemplo de la 3.8.1: validar empleados.xml con el esquema departamento.xsd

$dept = new DOMDocument();
$dept->load("empleados.xml");
// schemaValidate() comprueba que el XML cumpla el esquema XSD
$res = $dept->schemaValidate("departamento.xsd");
if ($res) {
    echo "El fichero es válido";
} else {
    echo "Fichero no válido";
}
