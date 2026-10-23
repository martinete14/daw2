<?php
    session_start();
    if (!isset($_SESSION['token'])) {
        header('Location: alta.php');
        exit;
    }

    // Pedir al microservicio de historial las operaciones del usuario logueado
    $ch = curl_init('http://localhost/libro_servidor/cap3/subidos/act_conjunta/servidor/historial/listar.php');
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query([
        'usuario' => $_SESSION['usuario']
    ]));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    $datos = json_decode(curl_exec($ch), true);
    curl_close($ch);
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Historial</title>
    <link rel="stylesheet" href="estilo.css">
</head>
<body>
    <div class="card">
        <h1>Historial</h1>
        <p class="sesion">Sesión: <?php echo htmlspecialchars($_SESSION['usuario']); ?></p>

        <?php if (empty($datos['operaciones'])): ?>
            <p>Todavía no hay operaciones.</p>
        <?php else: ?>
            <table class="historial">
                <tr>
                    <th>Operación</th>
                    <th>Números</th>
                    <th>Resultado</th>
                    <th>Fecha</th>
                </tr>
                <?php foreach ($datos['operaciones'] as $op): ?>
                    <tr>
                        <td><?php echo htmlspecialchars($op['operacion']); ?></td>
                        <td><?php echo htmlspecialchars($op['operacion1'] . ' y ' . $op['operacion2']); ?></td>
                        <td><?php echo htmlspecialchars($op['resultado']); ?></td>
                        <td><?php echo htmlspecialchars($op['fecha']); ?></td>
                    </tr>
                <?php endforeach; ?>
            </table>
        <?php endif; ?>

        <p class="salir"><a href="calculadora.php">Volver a la calculadora</a></p>
    </div>
</body>
</html>
