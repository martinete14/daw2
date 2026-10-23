<?php
    // Microservicio "sumar": no toca la base de datos, solo calcula.
    // Recibe operacion1 y operacion2 por POST, devuelve el resultado en JSON.
    $op1 = (float) ($_POST['operacion1'] ?? 0);
    $op2 = (float) ($_POST['operacion2'] ?? 0);

    header('Content-Type: application/json');
    echo json_encode([
        'resultado' => $op1 + $op2
    ]);
?>
