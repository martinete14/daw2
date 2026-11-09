<?php
// Clase Usuario: inicia sesión comprobando el hash, comprueba que la sesión siga activa
// y devuelve los datos del perfil (RF-05, RF-08, RF-09, RF-10, RF-11)

class Usuario {
    // una propiedad por columna de la tabla usuarios
    public $codigo;
    public $correo;
    public $clave;      // el hash, nunca la clave en texto (RNF-03)
    public $nombre;
    public $direccion;
    public $ciudad;
    public $cp;
    public $pais;
    public $rol;        // 0 = cliente, 1 = administrador
    public $fecha_alta;

    // devuelve el usuario si el correo existe y la clave coincide con el hash, si no false
    public static function login($correo, $clave) {
        $consulta = BaseDatos::conexion()->prepare("SELECT * FROM usuarios WHERE correo = ?");
        $consulta->execute([$correo]);
        $consulta->setFetchMode(PDO::FETCH_CLASS, "Usuario");
        $usuario = $consulta->fetch();

        if ($usuario && password_verify($clave, $usuario->clave)) {
            return $usuario;
        }
        return false;
    }

    // un usuario por su código (para el perfil)
    public static function buscar($codigo) {
        $consulta = BaseDatos::conexion()->prepare("SELECT * FROM usuarios WHERE codigo = ?");
        $consulta->execute([$codigo]);
        $consulta->setFetchMode(PDO::FETCH_CLASS, "Usuario");
        return $consulta->fetch();
    }

    // guarda en la sesión lo justo para las páginas, nunca la clave
    public function iniciarSesion() {
        // id de sesión nuevo al entrar, para que no sirva uno anterior
        session_regenerate_id(true);
        $_SESSION['usuario'] = [
            'codigo' => $this->codigo,
            'correo' => $this->correo,
            'nombre' => $this->nombre,
            'rol' => $this->rol,
        ];
        $_SESSION['ultima_actividad'] = time();
    }

    // va al principio de cada página protegida (RF-08 y RF-09)
    public static function comprobarSesion() {
        if (!isset($_SESSION['usuario'])) {
            header("Location: login.php?redirigido=1");
            exit;
        }
        // si pasó más tiempo que el permitido desde la última página, la sesión caduca
        if (time() - $_SESSION['ultima_actividad'] > MINUTOS_INACTIVIDAD * 60) {
            self::cerrarSesion();
            header("Location: login.php?caducada=1");
            exit;
        }
        // hubo actividad: el reloj vuelve a empezar
        $_SESSION['ultima_actividad'] = time();
    }

    // borra las variables de sesión, la sesión y su cookie (RF-11)
    public static function cerrarSesion() {
        $_SESSION = [];
        session_destroy();
        setcookie(session_name(), "", time() - 3600, "/");
    }
}
