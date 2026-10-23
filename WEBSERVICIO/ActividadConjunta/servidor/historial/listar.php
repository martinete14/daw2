<?php
    require('../conexion.php');
    header('Content-Type: application/json');

    // Microservicio "historial" (listar): devuelve las operaciones de un usuario,
    // de la mas nueva a la mas vieja.
    try {
        $sql = $bd->prepare(
            'SELECT operacion, operacion1, operacion2, resultado, fecha
            FROM historial WHERE usuario = :usuario ORDER BY fecha DESC'
        );
        $sql->bindValue(':usuario', $_POST['usuario'] ?? '');
        $sql->execute();

        // FETCH_ASSOC: cada fila como array con el nombre de la columna (sin los indices numericos)
        echo json_encode(['ok' => true, 'operaciones' => $sql->fetchAll(PDO::FETCH_ASSOC)]);
    } catch (PDOException $e) {
        echo json_encode(['ok' => false, 'mensaje' => $e->getMessage()]);
    }
?>
