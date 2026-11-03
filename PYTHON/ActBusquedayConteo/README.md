# Actividad: Búsqueda y conteo de una palabra en un archivo de texto

Martin Villagra Tejerina - DAW 2

## Análisis del problema

- **Qué resuelve:** cuenta cuántas veces aparece una palabra dentro de un archivo de texto.
- **Entrada:** el nombre o la ruta del archivo y la palabra a buscar, las dos por teclado.
- **Salida:** una sola línea con el formato `palabra: número`.
- **Criterio de búsqueda:** literal, palabra completa y respetando mayúsculas. Antes de comparar, a cada palabra del texto se le quitan los signos pegados (`.` `,` `;` `:` `¿?` `¡!` comillas, rayas de diálogo y paréntesis), así `archivo.` o `“archivo` cuentan como `archivo`. En cambio `archivos` o `Archivo` no cuentan.

## Archivos

- `ActBusquedayConteo.py` - el script.
- `pruebas_ActBusquedayConteo.py` - pruebas de `contar_palabra()` con `assert`.
- `fragmento_novela_la_estacion_de_los_jueves.txt` - texto de prueba.

## Estructura del script

| Fase | Dónde |
|---|---|
| Entrada | `pedir_datos()`: pide la ruta y la palabra con `input()` |
| Proceso | `leer_archivo()`: abre el archivo con `with open(..., encoding="utf-8")` y lo lee. `contar_palabra()`: recorre las palabras con `for` y suma 1 al contador por cada coincidencia |
| Salida | `main()`: muestra `palabra: número` |

`main()` coordina las tres fases. Si el archivo no existe se captura `FileNotFoundError` y se muestra un mensaje en vez del error de Python.

## Ejecución

Abrir una terminal dentro de la carpeta `ActBusquedayConteo` y escribir:

```
python ActBusquedayConteo.py
```

Ejemplo:

```
Escribí el nombre o la ruta del archivo: fragmento_novela_la_estacion_de_los_jueves.txt
Escribí la palabra a buscar: archivo
archivo: 6
```

Para las pruebas:

```
python pruebas_ActBusquedayConteo.py
```

## Pruebas con el archivo real

| Palabra | Resultado | Por qué |
|---|---|---|
| `archivo` | 6 | No cuenta `Archivo` (mayúscula) ni `archivos` |
| `Archivo` | 1 | Solo el cartel "Archivo Vecinal La Estación" |
| `Irene` | 19 | |
| `Ferrer` | 8 | Cuenta `Ferrer.` y `Ferrer,` porque se quitan los signos |
| `B-17` | 6 | El guion es parte de la palabra |
| `zapato` | 0 | No aparece |
| archivo `no_existe.txt` | mensaje de error | `FileNotFoundError` |

Para comprobarlo a mano en VS Code: `Ctrl+F`, activar "Coincidir mayúsculas y minúsculas" y "Solo palabras completas", y buscar la palabra. Con `archivo` marca 6 coincidencias, igual que el script.

El enunciado pone como ejemplo `archivo: 12`, pero con este texto ningún criterio da 12 (contando también `archivos` y `Archivo` salen 10), así que es un número de ejemplo.
