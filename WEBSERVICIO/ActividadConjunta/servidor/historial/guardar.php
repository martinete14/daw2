<?php
    require('../conexion.php');
    header('Content-Type: application/json');

    // Microservicio "historial" (guardar): operar.php lo llama despues de cada
    // calculo para dejar registrada la operacion en su propia tabla.
    try {
        $sql = $bd->prepare(
            'INSERT INTO historial (usuario, operacion, operacion1, operacion2, resultado, fecha)
            VALUES (:usuario, :operacion, :operacion1, :operacion2, :resultado, NOW())'
        );
        $sql->bindValue(':usuario', $_POST['usuario'] ?? '');
        $sql->bindValue(':operacion', $_POST['operacion'] ?? '');
        $sql->bindValue(':operacion1', $_POST['operacion1'] ?? 0);
        $sql->bindValue(':operacion2', $_POST['operacion2'] ?? 0);
        $sql->bindValue(':resultado', $_POST['resultado'] ?? 0);
        $sql->execute();

        echo json_encode(['ok' => true]);
    } catch (PDOException $e) {
        echo json_encode(['ok' => false, 'mensaje' => $e->getMessage()]);
    }
?>
