<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Alta de usuario</title>
    <link rel="stylesheet" href="estilo.css">
</head>
<body>
    <div class="card">
        <h1>Crear cuenta</h1>
        <form action="confirmar.php" method="post">
            <label for="usuario">Usuario</label>
            <input type="text" name="usuario" id="usuario" placeholder="juan">

            <label for="password">Password</label>
            <input type="password" name="password" id="password">

            <button type="submit">Alta</button>
        </form>

        <p class="salir"><a href="login.php">¿Ya tienes cuenta? Inicia sesión</a></p>
    </div>
</body>
</html>
