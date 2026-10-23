<?php
    require('../conexion.php');
    header('Content-Type: application/json');

    $usuario = $_POST['usuario'] ?? '';
    $password = $_POST['password'] ?? ''; // ya llega cifrada en SHA-256 desde el cliente

    if ($usuario === '' || $password === '') {
        echo json_encode(['ok' => false, 'mensaje' => 'Faltan usuario o password']);
        exit;
    }

    try {
        // Token nuevo: una cadena aleatoria e imposible de adivinar.
        // bin2hex(random_bytes(32)) genera 32 bytes al azar y los convierte
        // a texto hexadecimal (64 caracteres), igual de largo que un hash SHA-256.
        $token = bin2hex(random_bytes(32));

        // INSERT ... ON DUPLICATE KEY UPDATE: si el usuario ya existe (la clave
        // primaria "usuario" ya está en la tabla), en vez de dar error, actualiza
        // su password/token/tiempo. Es justo lo que pide el enunciado:
        // "si el usuario ya existe... se gestiona la sesión creando un token único".
        $sql = $bd->prepare(
            'INSERT INTO usuarios_token (usuario, password, token, tiempo)
            VALUES (:usuario, :password, :token, NOW())
            ON DUPLICATE KEY UPDATE password = :password2, token = :token2, tiempo = NOW()'
        );
        $sql->bindValue(':usuario', $usuario);
        $sql->bindValue(':password', $password);
        $sql->bindValue(':password2', $password);
        $sql->bindValue(':token', $token);
        $sql->bindValue(':token2', $token);
        $sql->execute();

        echo json_encode(['ok' => true, 'token' => $token]);
    } catch (PDOException $e) {
        echo json_encode(['ok' => false, 'mensaje' => $e->getMessage()]);
    }
?>
