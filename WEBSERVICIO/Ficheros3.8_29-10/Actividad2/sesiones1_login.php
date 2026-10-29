<?php
// ActividadZonaAdmin
// Ejercicio propuesto 2 del tema 3: ampliar el ejemplo de sesiones de la 3.4 para que
// la página principal muestre un vínculo "Zona Admin" solo a los usuarios con rol 1

/* formulario de login habitual
si va bien abre sesión, guarda el nombre de usuario y el rol y redirige a principal,
si va mal, mensaje de error */
function comprobar_usuario($nombre, $clave){
    if($nombre === "usuario" and $clave === "1234"){
        $usuario['nombre'] = "usuario";
        $usuario['rol'] = 0;
        return $usuario;
    }elseif($nombre === "admin" and $clave === "1234"){
        $usuario['nombre'] = "admin";
        $usuario['rol'] = 1;
        return $usuario;
    }else return FALSE;
}
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $usu = comprobar_usuario($_POST['usuario'], $_POST['clave']);
    if($usu==FALSE){
        $err = TRUE;
        $usuario = $_POST['usuario'];
    }else{
        session_start();
        $_SESSION['usuario'] = $_POST['usuario'];
        // lo nuevo: guardo también el rol, así la principal sabe si es admin
        $_SESSION['rol'] = $usu['rol'];
        header("Location: sesiones1_principal.php");
    }
}
?>
<!DOCTYPE html>
<html>
<head>
    <title>Formulario de login</title>
    <meta charset = "UTF-8">
</head>
<body>
    <?php if(isset($_GET["redirigido"])){
        echo "<p>Haga login para continuar</p>";
    }?>
    <?php if(isset($err) and $err == true){
        echo "<p> revise usuario y contraseña</p>";
    }?>
    <form method = "POST" action = "<?php echo htmlspecialchars($_SERVER["PHP_SELF"]);?>">
        Usuario
        <input value = "<?php if(isset($usuario))echo $usuario;?>" id = "usuario" name = "usuario" type = "text">
        Clave
        <input id = "clave" name = "clave" type = "password">
        <input type = "submit">
    </form>
</body>
</html>
