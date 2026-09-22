<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Formulario</title>
  <link rel="stylesheet" href="estilos.css">
</head>
<body>
  <main>
    <h1>Ingresa un número</h1>

    <form action="endpoint.php" method="post">
      <label for="numero">Número</label>
      <input type="text" id="numero" name="numero">
      <button type="submit">Enviar</button>
    </form>
  </main>
</body>
</html>
