<?php
// ActividadZonaAdmin
// Página principal: solo se entra con login, y el vínculo "Zona Admin" lo ven solo los de rol 1

session_start();
if(!isset($_SESSION['usuario'])){
    header("Location: sesiones1_login.php?redirigido=true");
}
?>
<!DOCTYPE html>
<html>
<head>
    <title>Página principal</title>
    <meta charset = "UTF-8">
</head>
<body>
    <?php echo "Bienvenido ".$_SESSION['usuario'];?>
    <?php
    // lo nuevo: el vínculo solo aparece si el rol guardado en la sesión es 1
    if($_SESSION['rol'] == 1){
        echo "<br><a href = 'zona_admin.php'>Zona Admin</a>";
    }
    ?>
    <br><a href = "sesiones1_logout.php">Salir</a>
</body>
</html>
