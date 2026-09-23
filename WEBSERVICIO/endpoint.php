<?php
require "Funciones.php";

if ($_SERVER["REQUEST_METHOD"] != "POST") {
    header("Location: index.php");
    exit;
}

$numeros = [];
$calcularMedia = isset($_POST["media"]);

try {
    if (isset($_POST["n1"]) && is_numeric($_POST["n1"])) {
        $numeros[] = $_POST["n1"];
    } else {
        throw new Exception("1");
    }

    if (isset($_POST["n2"]) && is_numeric($_POST["n2"])) {
        $numeros[] = $_POST["n2"];
    } else {
        throw new Exception("2");
    }

    if (isset($_POST["n3"]) && is_numeric($_POST["n3"])) {
        $numeros[] = $_POST["n3"];
    } else {
        throw new Exception("3");
    }

    if (isset($_POST["n4"]) && is_numeric($_POST["n4"])) {
        $numeros[] = $_POST["n4"];
    } else {
        throw new Exception("4");
    }

    if (isset($_POST["n5"]) && is_numeric($_POST["n5"])) {
        $numeros[] = $_POST["n5"];
    } else {
        throw new Exception("5");
    }
} catch (Exception $e) {
    // vuelvo al formulario sin perder lo que el usuario ya había escrito
    // (si algún campo ni siquiera vino en el POST, lo trato como vacío)
    if (isset($_POST["n1"])) {
        $v1 = $_POST["n1"];
    } else {
        $v1 = "";
    }
    if (isset($_POST["n2"])) {
        $v2 = $_POST["n2"];
    } else {
        $v2 = "";
    }
    if (isset($_POST["n3"])) {
        $v3 = $_POST["n3"];
    } else {
        $v3 = "";
    }
    if (isset($_POST["n4"])) {
        $v4 = $_POST["n4"];
    } else {
        $v4 = "";
    }
    if (isset($_POST["n5"])) {
        $v5 = $_POST["n5"];
    } else {
        $v5 = "";
    }

    $params = "error=" . $e->getMessage();
    $params .= "&n1=" . urlencode($v1);
    $params .= "&n2=" . urlencode($v2);
    $params .= "&n3=" . urlencode($v3);
    $params .= "&n4=" . urlencode($v4);
    $params .= "&n5=" . urlencode($v5);
    if ($calcularMedia) {
        $params .= "&media=1";
    }
    header("Location: index.php?" . $params);
    exit;
}

$titulo = "Resultado";
require "cabecera.php";
?>
    <p class="ok">Números recibidos: <?php echo htmlspecialchars(implode(", ", $numeros)); ?></p>
    <ul class="resultados">
      <li>Mínimo: <?php echo obtenerMinimo($numeros); ?></li>
      <li>Máximo: <?php echo obtenerMaximo($numeros); ?></li>
      <?php if ($calcularMedia): ?>
      <li>Media: <?php echo obtenerMedia($numeros); ?></li>
      <?php endif; ?>
    </ul>

    <a href="index.php">Volver</a>
<?php require "pie.php"; ?>
