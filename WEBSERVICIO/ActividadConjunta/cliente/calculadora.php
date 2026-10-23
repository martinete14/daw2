<?php
    session_start();
    if (!isset($_SESSION['token'])) {
        header('Location: alta.php');
        exit;
    }
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Calculadora</title>
    <link rel="stylesheet" href="estilo.css">
</head>
<body class="autenticada">
    <div class="card">
        <h1>Calculadora</h1>
        <p class="sesion">Sesión: <?php echo htmlspecialchars($_SESSION['usuario']); ?></p>

        <form action="operar.php" method="post">
            <label for="operacion1">Número 1</label>
            <input type="number" name="operacion1" id="operacion1">

            <label for="operacion2">Número 2</label>
            <input type="number" name="operacion2" id="operacion2">

            <button type="submit" name="accion" value="sumar">Sumar</button>
            <button type="submit" name="accion" value="restar">Restar</button>
        </form>

        <p class="salir"><a href="historial.php">Ver historial</a></p>
        <p class="salir"><a href="logout.php">Cerrar sesión</a></p>
    </div>
</body>
</html>
