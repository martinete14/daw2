<?php
    session_start();

    $usuario = $_POST['usuario'] ?? '';
    $password = $_POST['password'] ?? '';
    $password2 = $_POST['password2'] ?? ''; // repetir contraseña, cuando llega del segundo envio

    $error = '';

    if (isset($_POST['password2'])) {
        // Segundo paso: ya escribió la contraseña dos veces, toca comprobar
        if ($password !== $password2) {
            $error = 'Las contraseñas no coinciden';
        } else {
            // 1) Cifrar la contraseña con SHA-256 ANTES de mandarla por la red
            $passwordCifrada = hash('sha256', $password);

            // 2) Llamar al microservicio de seguridad con curl (peticion HTTP real)
            //    En vez de require(), "llamamos por telefono" a otra URL.
            $ch = curl_init('http://localhost/libro_servidor/cap3/subidos/act_conjunta/servidor/seguridad/alta.php');
            curl_setopt($ch, CURLOPT_POST, true);
            curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query([
                'usuario' => $usuario,
                'password' => $passwordCifrada
            ]));
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true); // devuelve la respuesta como texto, en vez de imprimirla
            $respuesta = curl_exec($ch);
            curl_close($ch);

            // 3) La respuesta es JSON (texto), la convertimos a array de PHP
            $datos = json_decode($respuesta, true);

            if ($datos['ok']) {
                // Guardamos el token en sesion, para que calculadora.php lo use despues
                $_SESSION['token'] = $datos['token'];
                $_SESSION['usuario'] = $usuario;
                header('Location: calculadora.php');
                exit;
            } else {
                $error = $datos['mensaje'] ?? 'No se pudo crear el usuario';
            }
        }
    }
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Confirmar contraseña</title>
    <link rel="stylesheet" href="estilo.css">
</head>
<body>
    <div class="card">
        <h1>Confirmar contraseña</h1>
        <?php if ($error !== ''): ?>
            <p class="error"><?php echo htmlspecialchars($error); ?></p>
        <?php endif; ?>

        <form action="confirmar.php" method="post">
            <!-- usuario y password viajan ocultos, ya vienen de alta.php -->
            <input type="hidden" name="usuario" value="<?php echo htmlspecialchars($usuario); ?>">
            <input type="hidden" name="password" value="<?php echo htmlspecialchars($password); ?>">

            <label for="password2">Repite la contraseña</label>
            <input type="password" name="password2" id="password2">

            <button type="submit">Confirmar</button>
        </form>
    </div>
</body>
</html>
