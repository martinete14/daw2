<?php
$datos = simplexml_load_file("empleados.xml");
// xpath() selecciona solo los elementos que cumplen la expresión, acá las <edad>
$edades = $datos->xpath("//edad");
foreach ($edades as $valor) {
    print_r($valor);
    echo "<br>";
}
