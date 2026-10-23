<?php
    session_start();

    if (isset($_SESSION['token'])) {
        // Invalidar el token en el servidor: lo borramos de la BD para que no
        // se pueda reutilizar, aunque alguien lo hubiera copiado.
        $ch = curl_init('http://localhost/libro_servidor/cap3/subidos/act_conjunta/servidor/seguridad/logout.php');
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query([
            'token' => $_SESSION['token']
        ]));
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_exec($ch);
        curl_close($ch);
    }

    // Vaciar y destruir la sesion local, igual que en sesiones1_logout.php
    $_SESSION = array();
    session_destroy();

    header('Location: alta.php');
    exit;
?>
