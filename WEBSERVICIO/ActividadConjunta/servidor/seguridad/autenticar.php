<?php
    require('../conexion.php');
    header('Content-Type: application/json');

    $usuario = $_POST['usuario'] ?? '';
    $password = $_POST['password'] ?? ''; // ya llega en SHA-256

    try {
        // Comprueba que esas credenciales existen
        $sql = $bd->prepare('SELECT usuario FROM usuarios_token WHERE usuario = :usuario AND password = :password');
        $sql->bindValue(':usuario', $usuario);
        $sql->bindValue(':password', $password);
        $sql->execute();

        if ($sql->rowCount() === 0) {
            echo json_encode(['ok' => false, 'mensaje' => 'Usuario o password incorrectos']);
            exit;
        }

        // Credenciales correctas: generamos un token nuevo y lo guardamos
        // en la MISMA fila (update), en vez de crear una fila/campo nuevo.
        $token = bin2hex(random_bytes(32));
        $upd = $bd->prepare('UPDATE usuarios_token SET token = :token, tiempo = NOW() WHERE usuario = :usuario');
        $upd->bindValue(':token', $token);
        $upd->bindValue(':usuario', $usuario);
        $upd->execute();

        echo json_encode(['ok' => true, 'token' => $token]);
    } catch (PDOException $e) {
        echo json_encode(['ok' => false, 'mensaje' => $e->getMessage()]);
    }
?>
