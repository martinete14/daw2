<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $numero = $_POST["numero"];

    try {
        if (!is_numeric($numero)) {
            throw new Exception("\"$numero\" no es un número.");
        }
        $error = false;
        $mensaje = "Recibido correctamente: $numero";
    } catch (Exception $e) {
        $error = true;
        $mensaje = $e->getMessage();
    }
} else {
    $error = true;
    $mensaje = "Este formulario se envía por POST, entra desde index.php.";
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Resultado</title>
  <link rel="stylesheet" href="estilos.css">
</head>
<body>
  <main>
    <h1>Resultado</h1>

    <p class="<?php echo $error ? "error" : "ok"; ?>">
      <?php echo $error ? "Error: " . $mensaje : $mensaje; ?>
    </p>

    <a href="index.php">Volver</a>
  </main>
</body>
</html>
