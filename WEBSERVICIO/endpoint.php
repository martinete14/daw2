<?php
function obtenerMinimo($numeros)
{
    $minimo = $numeros[0];
    foreach ($numeros as $n) {
        if ($n < $minimo) {
            $minimo = $n;
        }
    }
    return $minimo;
}

function obtenerMaximo($numeros)
{
    $maximo = $numeros[0];
    foreach ($numeros as $n) {
        if ($n > $maximo) {
            $maximo = $n;
        }
    }
    return $maximo;
}

function obtenerMedia($numeros)
{
    return array_sum($numeros) / count($numeros);
}

if ($_SERVER["REQUEST_METHOD"] != "POST") {
    header("Location: index.php");
    exit;
}

$numeros = [];
$calcularMedia = isset($_POST["media"]);

try {
    if (is_numeric($_POST["n1"])) {
        $numeros[] = $_POST["n1"];
    } else {
        throw new Exception("1");
    }

    if (is_numeric($_POST["n2"])) {
        $numeros[] = $_POST["n2"];
    } else {
        throw new Exception("2");
    }

    if (is_numeric($_POST["n3"])) {
        $numeros[] = $_POST["n3"];
    } else {
        throw new Exception("3");
    }

    if (is_numeric($_POST["n4"])) {
        $numeros[] = $_POST["n4"];
    } else {
        throw new Exception("4");
    }

    if (is_numeric($_POST["n5"])) {
        $numeros[] = $_POST["n5"];
    } else {
        throw new Exception("5");
    }
} catch (Exception $e) {
    // vuelvo al formulario sin perder lo que el usuario ya había escrito
    $params = "error=" . $e->getMessage();
    $params .= "&n1=" . urlencode($_POST["n1"]);
    $params .= "&n2=" . urlencode($_POST["n2"]);
    $params .= "&n3=" . urlencode($_POST["n3"]);
    $params .= "&n4=" . urlencode($_POST["n4"]);
    $params .= "&n5=" . urlencode($_POST["n5"]);
    if ($calcularMedia) {
        $params .= "&media=1";
    }
    header("Location: index.php?" . $params);
    exit;
}

$titulo = "Resultado";
?>
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title><?php echo htmlspecialchars($titulo); ?></title>
  <link rel="stylesheet" href="estilos.css">
</head>
<body>
  <div class="cabecera">
    <h1><?php echo htmlspecialchars($titulo); ?></h1>
  </div>

  <div class="contenido">
    <p class="ok">Números recibidos: <?php echo htmlspecialchars(implode(", ", $numeros)); ?></p>
    <ul class="resultados">
      <li>Mínimo: <?php echo obtenerMinimo($numeros); ?></li>
      <li>Máximo: <?php echo obtenerMaximo($numeros); ?></li>
      <?php if ($calcularMedia): ?>
      <li>Media: <?php echo obtenerMedia($numeros); ?></li>
      <?php endif; ?>
    </ul>

    <a href="index.php">Volver</a>
  </div>

  <div class="pie">
    <p>Martinete daw2 &middot; Desarrollo web en entorno servidor</p>
  </div>
</body>
</html>
