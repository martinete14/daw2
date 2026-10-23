<?php
    session_start();
    $error = '';

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $usuario = $_POST['usuario'] ?? '';
        $password = $_POST['password'] ?? '';

        // Cifrar igual que en el alta, para comparar lo mismo que hay guardado
        $passwordCifrada = hash('sha256', $password);

        // Llamar al microservicio de seguridad: endpoint "autenticar"
        // (valida credenciales y renueva el token, como pedia el enunciado)
        $ch = curl_init('http://localhost/libro_servidor/cap3/subidos/act_conjunta/servidor/seguridad/autenticar.php');
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query([
            'usuario' => $usuario,
            'password' => $passwordCifrada
        ]));
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        $datos = json_decode(curl_exec($ch), true);
        curl_close($ch);

        if ($datos['ok']) {
            $_SESSION['token'] = $datos['token'];
            $_SESSION['usuario'] = $usuario;
            header('Location: calculadora.php');
            exit;
        } else {
            $error = $datos['mensaje'] ?? 'No se pudo iniciar sesión';
        }
    }
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Iniciar sesión</title>
    <link rel="stylesheet" href="estilo.css">
</head>
<body>
    <div class="card">
        <h1>Iniciar sesión</h1>
        <?php if ($error !== ''): ?>
            <p class="error"><?php echo htmlspecialchars($error); ?></p>
        <?php endif; ?>

        <form action="login.php" method="post">
            <label for="usuario">Usuario</label>
            <input type="text" name="usuario" id="usuario" placeholder="juan">

            <label for="password">Password</label>
            <input type="password" name="password" id="password">

            <button type="submit">Entrar</button>
        </form>

        <p class="salir"><a href="alta.php">¿No tienes cuenta? Date de alta</a></p>
    </div>
</body>
</html>
