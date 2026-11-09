<?php
// ExamenTienda - La Pulpería
// Login (RF-05, RF-06, RF-07): comprueba correo y clave contra la BD y,
// si se marca la casilla, guarda el correo en la cookie recordar_correo
require "config.php";

// si ya tiene sesión, no tiene nada que hacer acá
if (isset($_SESSION['usuario'])) {
    header("Location: categorias.php");
    exit;
}

$error = false;
// la cookie propia: si existe, el correo aparece escrito (RF-07)
$correo = $_COOKIE['recordar_correo'] ?? "";

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $correo = trim($_POST['correo'] ?? "");
    $usuario = Usuario::login($correo, $_POST['clave'] ?? "");

    if ($usuario) {
        if (isset($_POST['recordar'])) {
            // solo el correo, nunca la clave (RNF-03). Dura 30 días
            setcookie("recordar_correo", $correo, ['expires' => time() + 60 * 60 * 24 * 30, 'httponly' => true, 'samesite' => 'Lax']);
        } else {
            // casilla desmarcada: se borra con una fecha ya pasada
            setcookie("recordar_correo", "", time() - 3600);
        }
        $usuario->iniciarSesion();
        header("Location: categorias.php");
        exit;
    }
    // el mismo mensaje falle el correo o la clave (RF-06)
    $error = true;
}

$titulo = "Entrar";
require "inc/cabecera.php";
?>
    <section class="login">
      <h1>Entrar a la tienda</h1>

      <?php if (isset($_GET['caducada'])) { ?>
        <p class="aviso">Tu sesión caducó por inactividad. Volvé a entrar.</p>
      <?php } elseif (isset($_GET['redirigido'])) { ?>
        <p class="aviso">Entrá con tu cuenta para continuar.</p>
      <?php } ?>

      <?php if ($error) { ?>
        <p class="error">El correo o la clave no son correctos.</p>
      <?php } ?>

      <form method="post" action="login.php">
        <label for="correo">Correo</label>
        <input type="email" id="correo" name="correo" required value="<?php echo htmlspecialchars($correo); ?>">

        <label for="clave">Clave</label>
        <input type="password" id="clave" name="clave" required>

        <label class="casilla">
          <input type="checkbox" name="recordar" <?php if (isset($_COOKIE['recordar_correo'])) echo "checked"; ?>>
          Recordar mi correo
        </label>

        <button type="submit">Entrar</button>
      </form>
    </section>
<?php require "inc/pie.php"; ?>
