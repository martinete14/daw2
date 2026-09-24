<?php
// 1. creo funciones anónimas y las guardo en variables
$castellano = function ($texto) {
    return "Hola, " . $texto;
};

$ingles = function ($texto) {
    return "Hello, " . $texto;
};

$italiano = function ($texto) {
    return "Ciao, " . $texto;
};

// 2. función principal que recibe otra función como parámetro y la ejecuta
function ejecutarProceso($callback)
{
    return $callback("Martín");
}

$titulo = "Funciones anónimas";
require "cabecera.php";
?>
    <p class="ok">Pasando una función anónima como parámetro</p>
    <ul class="resultados">
      <!-- 3. le paso la variable que tiene la función -->
      <li><?php echo ejecutarProceso($castellano); ?></li>
      <li><?php echo ejecutarProceso($ingles); ?></li>
      <li><?php echo ejecutarProceso($italiano); ?></li>
      <!-- o la declaro directamente en la llamada, sin guardarla antes -->
      <li><?php echo ejecutarProceso(function ($texto) {
          return "Olá, " . $texto;
      }); ?></li>
    </ul>
<?php require "pie.php"; ?>
