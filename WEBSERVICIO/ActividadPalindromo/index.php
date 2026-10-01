<?php
// devuelve true si la cadena se lee igual al derecho y al revés
function esPalindromo($cadena)
{
    // todo a minúsculas, si no "Ana" no daría por la A mayúscula
    $cadena = mb_strtolower($cadena);

    // saco espacios, comas y puntos, y las vocales con tilde las cambio por la vocal sola,
    // así frases como "Dábale arroz a la zorra el abad" también cuentan
    $cadena = str_replace([" ", ",", "."], "", $cadena);
    $cadena = str_replace(["á", "é", "í", "ó", "ú"], ["a", "e", "i", "o", "u"], $cadena);

    // comparo la primera letra con la última, la segunda con la anteúltima, y así hasta la mitad.
    // si alguna no coincide ya no es palíndromo
    // (uso mb_strlen y mb_substr porque la ñ ocupa 2 bytes y con strlen y substr se rompe la cuenta)
    $largo = mb_strlen($cadena);
    for ($i = 0; $i < $largo / 2; $i++) {
        if (mb_substr($cadena, $i, 1) != mb_substr($cadena, $largo - 1 - $i, 1)) {
            return false;
        }
    }
    return true;
}

$titulo = "Palíndromos";
require "../comun/cabecera.php";
?>
    <form action="index.php" method="post">
      <div class="campo">
        <label for="texto">Palabra o frase</label>
        <input type="text" id="texto" name="texto" placeholder="Ej: Neuquén o Anita lava la tina" required>
      </div>
      <button type="submit" class="enviar">Comprobar</button>
    </form>

<?php
if (isset($_POST["texto"])) {
    $texto = trim($_POST["texto"]);

    if ($texto == "") {
        echo "<p class='error'>Escribí algo para comprobar.</p>";
    } elseif (esPalindromo($texto)) {
        echo "<p class='ok'>\"" . htmlspecialchars($texto) . "\" es un palíndromo</p>";
    } else {
        echo "<p class='error'>\"" . htmlspecialchars($texto) . "\" no es un palíndromo</p>";
    }
}

require "../comun/pie.php";
?>
