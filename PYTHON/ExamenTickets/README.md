# Examen Python: generador SQL de tickets

Martin Villagra Tejerina - DAW 2

## Análisis del problema

- **Qué resuelve:** pasa los 20 tickets de compra de SUPERMERCADOS EL AHORRO, que están en archivos `.txt`, a sentencias `INSERT` para cargarlos en la base de datos `tickets_db`.
- **Entrada:** la carpeta con los tickets, como argumento al ejecutar el script.
- **Salida:** el archivo `insert_ticket.sql` con los `INSERT`, y por pantalla un resumen con cuántos tickets, empleados, productos y formas de pago quedaron.
- **Criterio:** cada sucursal, empleado, forma de pago y producto se guarda una sola vez aunque aparezca en muchos tickets. Si un ticket tiene algún dato mal, se avisa, se descarta y se sigue con el siguiente.

## Archivos

- `build_insert_from_tickets.py`: el script.
- `schema.sql`: crea la base `tickets_db` con sus 6 tablas.
- `insert_ticket.sql`: los `INSERT` que genera el script.
- `data_tickets/`: los 20 tickets que nos pasó el profe (`factura_001.txt` a `factura_020.txt`).
- `APUNTES_ExamenTickets.md`: mis notas, con lo que falta para entregar y cómo explicar el script.

## Base de datos

Las tablas mínimas que sugería el profe eran `sucursal`, `empleado`, `producto`, `ticket` y `ticket_linea`. Le agregué `forma_pago` para no repetir `TARJETA` y `EFECTIVO` en cada ticket.

| Tabla | Clave | Qué guarda |
|---|---|---|
| `sucursal` | `id` | Nombre, dirección, CIF (único) y teléfono |
| `empleado` | `id` = código del cajero (`015` → 15) | Nombre (sin sucursal: puede rotar de una a otra) |
| `producto` | `id` | Descripción (única) y precio por unidad o por kg |
| `forma_pago` | `id` | `TARJETA` o `EFECTIVO` |
| `ticket` | `numero` (`20010001`) | Fecha y hora, sucursal, cajero, subtotal, IVA, total, forma de pago y autorización (`NULL` si es en efectivo) |
| `ticket_linea` | `ticket_numero` + `producto_id` | Cantidad (con 3 decimales por los productos por kg, como `2.500`) e importe |

## Estructura del script

| Fase | Dónde |
|---|---|
| Entrada | `pedir_carpeta()`: toma la carpeta de `sys.argv[1]`; si no se pasa o no existe, avisa y corta. `leer_ticket()`: abre cada ticket con `with open(..., encoding="utf-8")` |
| Proceso | `procesar_carpeta()`: recorre los `.txt` en orden. `parsear_lineas()`: arma el diccionario de cada ticket. `guardar_ticket()`: lo junta con los demás sin repetir datos. `generar_sql()`: arma los `INSERT` |
| Salida | `escribir_sql()`: guarda `insert_ticket.sql`. `mostrar_resumen()`: muestra los totales |

`main()` coordina las tres fases.

### Funciones de parseo

`parsear_sucursal()` recibe todas las líneas y lee las 3 primeras. Las demás reciben una línea y el diccionario del ticket, y solo hacen algo si la línea empieza por su etiqueta. `parsear_lineas()` pasa cada línea por todas y al final llama a `validar_ticket()`.

| Función | Línea que lee | Qué guarda |
|---|---|---|
| `parsear_sucursal` | Las 3 primeras | Nombre, dirección, CIF y teléfono |
| `parsear_fecha` | `Fecha:` | Fecha y hora juntas como `datetime` |
| `parsear_cajero` | `Cajero:` | Tupla (código, nombre) |
| `parsear_numero` | `Ticket:` | Número del ticket como entero |
| `parsear_producto` | Las que empiezan con espacio y terminan en `€` | Tupla (cantidad, descripción, importe) |
| `parsear_totales` | `SUBTOTAL`, `IVA`, `TOTAL` | Los tres importes como `float` |
| `parsear_pago` | `FORMA DE PAGO:` y `Autorización:` | Forma de pago y código de autorización |

### Sin datos repetidos: `setdefault`

`guardar_ticket()` guarda cada sucursal, empleado, forma de pago y producto en un diccionario cuya clave es el CIF, el código del cajero, el nombre del pago o la descripción del producto. `setdefault(clave, valor)` solo agrega el valor si la clave no está, así que Juan Pérez queda una sola vez aunque aparezca en varios tickets. El id nuevo es `len(diccionario) + 1`, así salen consecutivos.

El precio de cada producto se calcula la primera vez que aparece: `importe / cantidad`, redondeado a 2 decimales.

### Orden de los `INSERT`

`generar_sql()` escribe sucursal, empleado, forma_pago, producto y después cada ticket con sus líneas, para que cada clave foránea ya exista cuando se inserta.

## Validaciones y log de auditoría

Cada ticket se procesa dentro de un `try`. Si algo falla, se lanza un `ErrorTicket` con un **tipo** y la **línea** del ticket donde está el error. El `except` de `procesar_carpeta()` lo anota en `tickets.log`, muestra `Descarto 'archivo': TIPO en la línea N` y sigue con el siguiente.

| Tipo | Qué controla | Dónde | Línea |
|---|---|---|---|
| `CIF_INVALIDO` | El CIF tiene 9 caracteres | `parsear_sucursal` | 3 |
| `FECHA_INVALIDA` | La fecha existe (no 31/02) | `parsear_fecha` | la de `Fecha:` |
| `CAJERO_INVALIDO` | El código de cajero es un número | `parsear_cajero` | la de `Cajero:` |
| `NUMERO_TICKET_INVALIDO` | El número de ticket es un número | `parsear_numero` | la de `Ticket:` |
| `CANTIDAD_INVALIDA` | La cantidad es un número mayor que 0 (`JJ` → error) | `parsear_producto` | la del producto |
| `IMPORTE_INVALIDO` | El importe es un número mayor que 0 | `parsear_producto`, `parsear_totales` | la del importe |
| `FORMATO_INCORRECTO` | Una línea con etiqueta que no se puede leer | `parsear_lineas` | la de esa línea |
| `TOTAL_NO_CUADRA` | Subtotal + IVA = total | `validar_ticket` | la de `TOTAL A PAGAR` |
| `SUBTOTAL_NO_CUADRA` | Suma de los productos = subtotal | `validar_ticket` | la de `SUBTOTAL` |
| `FALTA_CAMPO` | Están número, cajero, fecha, forma de pago, subtotal, IVA y total | `validar_ticket` | `-` (es del ticket entero) |
| `SIN_PRODUCTOS` | Hay al menos un producto | `validar_ticket` | `-` |
| `TICKET_REPETIDO` | El número no se cargó antes | `guardar_ticket` | `-` |

### `tickets.log`

Se configura con el módulo `logging` en `configurar_log()`. Cada ejecución se agrega al final del archivo, así queda el historial: el inicio, cada ticket cargado (`INFO`), cada ticket descartado (`ERROR`) y el fin. Cada línea es `fecha | nivel | ticket | tipo | línea | detalle`:

```
2026-11-24 13:23:53 | INFO  | INICIO | carpeta tickets
2026-11-24 13:23:53 | INFO  | ticket 20010010 | CARGADO | 8 productos, total 26.80 €
2026-11-24 13:23:53 | ERROR | ticket 20010011 (factura_011.txt) | CANTIDAD_INVALIDA | línea 12 | la cantidad 'JJ' no es un número
2026-11-24 13:23:53 | INFO  | FIN | 17 tickets cargados en insert_ticket.sql
```

En los errores va el número del ticket y también el archivo, por si el error está antes de la línea `Ticket:`.

## Ejecución

Abrir una terminal dentro de la carpeta `ExamenTickets` y escribir:

```
python build_insert_from_tickets.py data_tickets
```

Sale:

```
==================================
  RESUMEN DE LA CARGA
==================================
  Tickets             20
  Empleados            7
  Productos           20
  Formas de pago       2
----------------------------------
  SQL listo en insert_ticket.sql
  Auditoría en tickets.log
```

Después, en MySQL (Workbench o la consola), ejecutar primero `schema.sql` y después `insert_ticket.sql`.

## Pruebas

Con los 20 tickets quedan 1 sucursal, 7 empleados, 20 productos, 2 formas de pago (14 con tarjeta y 6 en efectivo), 20 tickets y 157 líneas. Cargado en MySQL, la suma de las líneas de cada ticket da su subtotal.

Para probar las validaciones, copié algunos tickets a otra carpeta y les cambié un dato a cada uno:

| Cambio | Resultado en `tickets.log` |
|---|---|
| Cantidad `JJ` en el Azúcar del ticket 11 | `CANTIDAD_INVALIDA \| línea 12` |
| Fecha `31/02/2025` | `FECHA_INVALIDA \| línea 6` |
| `TOTAL A PAGAR` cambiado | `TOTAL_NO_CUADRA \| línea 25` |
| El mismo ticket dos veces | `TICKET_REPETIDO \| línea -` |
| Sin argumento | por pantalla: `Pasá la carpeta de los tickets: ...` |
| Carpeta que no existe | por pantalla: `No existe la carpeta 'no_existe'` |

Los productos por kg tienen una diferencia de un céntimo según el ticket (la Manzana Golden sale a 1.24 o a 1.25 el kg) por el redondeo del supermercado. Se guarda el precio del primer ticket donde aparece.
