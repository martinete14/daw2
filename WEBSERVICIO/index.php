<?php
// si vengo de un botón sumar/restar, ajusto ese campo y vuelvo a esta
// misma página con los valores actualizados (sin usar JS)
if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST["accion"])) {
    $n1 = $_POST["n1"];
    $n2 = $_POST["n2"];
    $n3 = $_POST["n3"];
    $n4 = $_POST["n4"];
    $n5 = $_POST["n5"];

    if ($_POST["accion"] == "sumar_1") {
        if (is_numeric($n1)) {
            $n1 = $n1 + 1;
        } else {
            $n1 = 1;
        }
    } elseif ($_POST["accion"] == "restar_1") {
        if (is_numeric($n1)) {
            $n1 = $n1 - 1;
        } else {
            $n1 = -1;
        }
    } elseif ($_POST["accion"] == "sumar_2") {
        if (is_numeric($n2)) {
            $n2 = $n2 + 1;
        } else {
            $n2 = 1;
        }
    } elseif ($_POST["accion"] == "restar_2") {
        if (is_numeric($n2)) {
            $n2 = $n2 - 1;
        } else {
            $n2 = -1;
        }
    } elseif ($_POST["accion"] == "sumar_3") {
        if (is_numeric($n3)) {
            $n3 = $n3 + 1;
        } else {
            $n3 = 1;
        }
    } elseif ($_POST["accion"] == "restar_3") {
        if (is_numeric($n3)) {
            $n3 = $n3 - 1;
        } else {
            $n3 = -1;
        }
    } elseif ($_POST["accion"] == "sumar_4") {
        if (is_numeric($n4)) {
            $n4 = $n4 + 1;
        } else {
            $n4 = 1;
        }
    } elseif ($_POST["accion"] == "restar_4") {
        if (is_numeric($n4)) {
            $n4 = $n4 - 1;
        } else {
            $n4 = -1;
        }
    } elseif ($_POST["accion"] == "sumar_5") {
        if (is_numeric($n5)) {
            $n5 = $n5 + 1;
        } else {
            $n5 = 1;
        }
    } elseif ($_POST["accion"] == "restar_5") {
        if (is_numeric($n5)) {
            $n5 = $n5 - 1;
        } else {
            $n5 = -1;
        }
    }

    $params = "n1=" . urlencode($n1) . "&n2=" . urlencode($n2) . "&n3=" . urlencode($n3)
        . "&n4=" . urlencode($n4) . "&n5=" . urlencode($n5) . "&";
    if (isset($_POST["media"])) {
        $params .= "media=1&";
    }
    header("Location: index.php?" . $params);
    exit;
}

// si vengo del botón Enviar, delego en endpoint.php y freno acá
if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST["enviar"])) {
    require "endpoint.php";
    exit;
}

$titulo = "Form de números";
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
    <form action="index.php" method="post">
      <?php if (isset($_GET["error"])): ?>
      <p class="error">Por favor, ingrese un valor válido.</p>
      <?php endif; ?>

      <div class="campo">
        <label for="n1">Número 1</label>
        <div class="control-numero">
          <button type="submit" name="accion" value="restar_1">−</button>
          <input type="text" id="n1" name="n1" value="<?php
            if (isset($_GET["n1"])) {
              echo htmlspecialchars($_GET["n1"]);
            } else {
              echo "0";
            }
          ?>">
          <button type="submit" name="accion" value="sumar_1">+</button>
        </div>
      </div>

      <div class="campo">
        <label for="n2">Número 2</label>
        <div class="control-numero">
          <button type="submit" name="accion" value="restar_2">−</button>
          <input type="text" id="n2" name="n2" value="<?php
            if (isset($_GET["n2"])) {
              echo htmlspecialchars($_GET["n2"]);
            } else {
              echo "0";
            }
          ?>">
          <button type="submit" name="accion" value="sumar_2">+</button>
        </div>
      </div>

      <div class="campo">
        <label for="n3">Número 3</label>
        <div class="control-numero">
          <button type="submit" name="accion" value="restar_3">−</button>
          <input type="text" id="n3" name="n3" value="<?php
            if (isset($_GET["n3"])) {
              echo htmlspecialchars($_GET["n3"]);
            } else {
              echo "0";
            }
          ?>">
          <button type="submit" name="accion" value="sumar_3">+</button>
        </div>
      </div>

      <div class="campo">
        <label for="n4">Número 4</label>
        <div class="control-numero">
          <button type="submit" name="accion" value="restar_4">−</button>
          <input type="text" id="n4" name="n4" value="<?php
            if (isset($_GET["n4"])) {
              echo htmlspecialchars($_GET["n4"]);
            } else {
              echo "0";
            }
          ?>">
          <button type="submit" name="accion" value="sumar_4">+</button>
        </div>
      </div>

      <div class="campo">
        <label for="n5">Número 5</label>
        <div class="control-numero">
          <button type="submit" name="accion" value="restar_5">−</button>
          <input type="text" id="n5" name="n5" value="<?php
            if (isset($_GET["n5"])) {
              echo htmlspecialchars($_GET["n5"]);
            } else {
              echo "0";
            }
          ?>">
          <button type="submit" name="accion" value="sumar_5">+</button>
        </div>
      </div>

      <label class="checkbox">
        <input type="checkbox" name="media" value="1"<?php
          if (isset($_GET["media"]) && $_GET["media"] == "1") {
            echo " checked";
          }
        ?>>
        Calcular media
      </label>

      <button type="submit" name="enviar" value="1" class="enviar">Enviar</button>
    </form>
  </div>

  <div class="pie">
    <p>Martinete daw2 &middot; Desarrollo web en entorno servidor</p>
  </div>
</body>
</html>
