<?php
    // Microservicio "restar": mismo esqueleto que "sumar", solo cambia la operacion.
    $op1 = (float) ($_POST['operacion1'] ?? 0);
    $op2 = (float) ($_POST['operacion2'] ?? 0);

    header('Content-Type: application/json');
    echo json_encode([
        'resultado' => $op1 - $op2
    ]);
?>
