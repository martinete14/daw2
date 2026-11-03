#Martin Villagra Tejerina DAW 2
'''
Pruebas de contar_palabra() con assert
Si alguna falla, Python corta con AssertionError y muestra cuál fue.
'''
from ActBusquedayConteo import contar_palabra, leer_archivo

# Caso normal
assert contar_palabra("hola mundo hola", "hola") == 2
# La palabra no aparece
assert contar_palabra("hola mundo", "chau") == 0
# Texto vacío
assert contar_palabra("", "hola") == 0
# Signos pegados a la palabra
assert contar_palabra("archivo. archivo, (archivo) “archivo”", "archivo") == 4
# Raya de diálogo y signos de apertura
assert contar_palabra("—¿Archivo? —dijo", "Archivo") == 1
# Distingue mayúsculas (búsqueda literal)
assert contar_palabra("Archivo archivo", "archivo") == 1
# Palabra dentro de otra: no cuenta
assert contar_palabra("archivos archivo", "archivo") == 1

# Archivo real
texto = leer_archivo("fragmento_novela_la_estacion_de_los_jueves.txt")
assert contar_palabra(texto, "archivo") == 6
assert contar_palabra(texto, "Irene") == 19
assert contar_palabra(texto, "Ferrer") == 8

print("Todas las pruebas pasaron")
