<?php
    require('../conexion.php');
    header('Content-Type: application/json');

    $token = $_POST['token'] ?? '';

    try {
        // Vacia el token (y el tiempo) de esa fila: ya no sirve para nada,
        // comprobar.php dejara de encontrarlo valido.
        $sql = $bd->prepare('UPDATE usuarios_token SET token = NULL, tiempo = NULL WHERE token = :token');
        $sql->bindValue(':token', $token);
        $sql->execute();

        echo json_encode(['ok' => true]);
    } catch (PDOException $e) {
        echo json_encode(['ok' => false, 'mensaje' => $e->getMessage()]);
    }
?>
