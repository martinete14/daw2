<?php
$dept = new DOMDocument();
$dept->load("empleados.xml");
// schemaValidate() comprueba que el XML cumpla el esquema XSD
$res = $dept->schemaValidate("departamento.xsd");
if ($res) {
    echo "El fichero es válido";
} else {
    echo "Fichero no válido";
}
