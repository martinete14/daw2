#Martin Villagra Tejerina DAW 2
'''
Búsqueda y conteo de una palabra en un archivo de texto

Análisis del problema:
- Qué resuelve: cuenta cuántas veces aparece una palabra dentro de un archivo de texto.
- Entrada: el nombre o la ruta del archivo y la palabra a buscar (las dos por teclado).
- Salida: una sola línea con el formato "palabra: número".
- Criterio: búsqueda literal, palabra completa y respetando mayúsculas.
  A cada palabra del texto se le quitan los signos pegados (puntos, comas,
  comillas, rayas de diálogo...) antes de compararla, así "archivo." cuenta
  como "archivo".
'''

SIGNOS = ".,;:¡!¿?\"'“”«»—()"


def pedir_datos() -> tuple[str, str]:
    """Pide por teclado la ruta del archivo y la palabra a buscar."""
    ruta = input("Escribí el nombre o la ruta del archivo: ").strip()
    palabra = input("Escribí la palabra a buscar: ").strip()
    return ruta, palabra


def leer_archivo(ruta: str) -> str:
    """Abre el archivo y devuelve todo su contenido como texto."""
    with open(ruta, "r", encoding="utf-8") as archivo:
        return archivo.read()


def contar_palabra(texto: str, palabra: str) -> int:
    """Devuelve cuántas veces aparece la palabra en el texto."""
    contador = 0
    for palabra_texto in texto.split():
        if palabra_texto.strip(SIGNOS) == palabra:
            contador += 1
    return contador


def main():
    # ENTRADA
    ruta, palabra = pedir_datos()

    # PROCESO
    try:
        texto = leer_archivo(ruta)
    except FileNotFoundError:
        print(f"No se encontró el archivo '{ruta}'")
        return
    veces = contar_palabra(texto, palabra)

    # SALIDA
    print(f"{palabra}: {veces}")


if __name__ == "__main__":
    main()
