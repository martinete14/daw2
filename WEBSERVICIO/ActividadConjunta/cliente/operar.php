<?php
    session_start();

    if (!isset($_SESSION['token'])) {
        header('Location: alta.php');
        exit;
    }

    // 1) Comprobar (y de paso renovar) el token llamando al microservicio de seguridad
    $ch = curl_init('http://localhost/libro_servidor/cap3/subidos/act_conjunta/servidor/seguridad/comprobar.php');
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query([
        'token' => $_SESSION['token']
    ]));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    $respuestaToken = json_decode(curl_exec($ch), true);
    curl_close($ch);

    if (!$respuestaToken['valido']) {
        // Token caducado o invalido: fuera, que vuelva a entrar
        session_destroy();
        header('Location: alta.php');
        exit;
    }

    // 2) Token valido: llamar al microservicio correspondiente (sumar o restar)
    $accion = $_POST['accion'] ?? '';
    $urlServicio = ($accion === 'restar')
        ? 'http://localhost/libro_servidor/cap3/subidos/act_conjunta/servidor/restar/index.php'
        : 'http://localhost/libro_servidor/cap3/subidos/act_conjunta/servidor/sumar/index.php';

    $ch2 = curl_init($urlServicio);
    curl_setopt($ch2, CURLOPT_POST, true);
    curl_setopt($ch2, CURLOPT_POSTFIELDS, http_build_query([
        'operacion1' => $_POST['operacion1'] ?? 0,
        'operacion2' => $_POST['operacion2'] ?? 0
    ]));
    curl_setopt($ch2, CURLOPT_RETURNTRANSFER, true);
    $respuestaCalculo = json_decode(curl_exec($ch2), true);
    curl_close($ch2);

    // 3) Guardar la operacion en el microservicio de historial
    $ch3 = curl_init('http://localhost/libro_servidor/cap3/subidos/act_conjunta/servidor/historial/guardar.php');
    curl_setopt($ch3, CURLOPT_POST, true);
    curl_setopt($ch3, CURLOPT_POSTFIELDS, http_build_query([
        'usuario' => $_SESSION['usuario'],
        'operacion' => $accion,
        'operacion1' => $_POST['operacion1'] ?? 0,
        'operacion2' => $_POST['operacion2'] ?? 0,
        'resultado' => $respuestaCalculo['resultado']
    ]));
    curl_setopt($ch3, CURLOPT_RETURNTRANSFER, true);
    curl_exec($ch3);
    curl_close($ch3);
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Resultado</title>
    <link rel="stylesheet" href="estilo.css">
</head>
<body class="autenticada">
    <div class="card">
        <h1>Resultado de <?php echo htmlspecialchars($accion); ?></h1>
        <p class="resultado"><?php echo htmlspecialchars($respuestaCalculo['resultado']); ?></p>
        <a href="calculadora.php">Volver a la calculadora</a>
        <p class="salir"><a href="historial.php">Ver historial</a></p>
    </div>
</body>
</html>
