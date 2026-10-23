<?php
    require('../conexion.php');
    header('Content-Type: application/json');

    try {
        if (isset($_POST['token'])) {
            // MODO 1: la calculadora manda un token y quiere saber si sigue vivo.
            $sql = $bd->prepare('SELECT tiempo FROM usuarios_token WHERE token = :token');
            $sql->bindValue(':token', $_POST['token']);
            $sql->execute();
            $fila = $sql->fetch();

            if (!$fila) {
                echo json_encode(['valido' => false, 'mensaje' => 'Token no existe']);
                exit;
            }

            // TIMESTAMPDIFF calcula los minutos pasados desde "tiempo" hasta ahora.
            $sql2 = $bd->prepare('SELECT TIMESTAMPDIFF(MINUTE, tiempo, NOW()) AS minutos FROM usuarios_token WHERE token = :token');
            $sql2->bindValue(':token', $_POST['token']);
            $sql2->execute();
            $minutos = $sql2->fetch()['minutos'];

            if ($minutos >= 3) {
                echo json_encode(['valido' => false, 'mensaje' => 'Token caducado']);
                exit;
            }

            // Token todavia valido: le regalamos 3 minutos mas de vida (renovarlo)
            $sql3 = $bd->prepare('UPDATE usuarios_token SET tiempo = NOW() WHERE token = :token');
            $sql3->bindValue(':token', $_POST['token']);
            $sql3->execute();

            echo json_encode(['valido' => true]);

        } else {
            // MODO 2: viene usuario + password, se comprueba si existen esas credenciales.
            $usuario = $_POST['usuario'] ?? '';
            $password = $_POST['password'] ?? '';

            $sql = $bd->prepare('SELECT token FROM usuarios_token WHERE usuario = :usuario AND password = :password');
            $sql->bindValue(':usuario', $usuario);
            $sql->bindValue(':password', $password);
            $sql->execute();
            $fila = $sql->fetch();

            if ($fila) {
                echo json_encode(['valido' => true]);
            } else {
                echo json_encode(['valido' => false, 'mensaje' => 'Usuario o password incorrectos']);
            }
        }
    } catch (PDOException $e) {
        echo json_encode(['valido' => false, 'mensaje' => $e->getMessage()]);
    }
?>
