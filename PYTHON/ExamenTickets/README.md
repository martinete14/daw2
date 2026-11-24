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
| `parsear_producto` | Las que empiezan con espacio y un número | Tupla (cantidad, descripción, importe) |
| `parsear_totales` | `SUBTOTAL`, `IVA`, `TOTAL` | Los tres importes como `float` |
| `parsear_pago` | `FORMA DE PAGO:` y `Autorización:` | Forma de pago y código de autorización |

### Sin datos repetidos: `setdefault`

`guardar_ticket()` guarda cada sucursal, empleado, forma de pago y producto en un diccionario cuya clave es el CIF, el código del cajero, el nombre del pago o la descripción del producto. `setdefault(clave, valor)` solo agrega el valor si la clave no está, así que Juan Pérez queda una sola vez aunque aparezca en varios tickets. El id nuevo es `len(diccionario) + 1`, así salen consecutivos.

El precio de cada producto se calcula la primera vez que aparece: `importe / cantidad`, redondeado a 2 decimales.

### Orden de los `INSERT`

`generar_sql()` escribe sucursal, empleado, forma_pago, producto y después cada ticket con sus líneas, para que cada clave foránea ya exista cuando se inserta.

## Validaciones

Cada ticket se procesa dentro de un `try`. Si algo falla se muestra `Descarto 'archivo': motivo` y se sigue con el siguiente.

| Validación | Dónde | Mensaje |
|---|---|---|
| Ticket repetido | `guardar_ticket` | `ticket repetido: N` |
| Campos obligatorios (número, cajero, fecha, forma de pago, subtotal, IVA, total) | `validar_ticket` | `falta el campo X` |
| Al menos un producto | `validar_ticket` | `ticket sin productos` |
| Subtotal + IVA = total | `validar_ticket` | `subtotal + IVA no coincide con el total` |
| Suma de las líneas = subtotal | `validar_ticket` | `la suma de productos no coincide con el subtotal` |
| Fecha que exista | `parsear_fecha` | el `ValueError` de `strptime` |
| CIF de 9 caracteres | `parsear_sucursal` | `CIF incorrecto: X` |
| Número de ticket y código de cajero numéricos | `parsear_numero`, `parsear_cajero` | `número de ticket incorrecto: X`, `código de cajero incorrecto: X` |
| Cantidad e importe mayores que 0 | `parsear_producto` | `cantidad o importe incorrecto: línea` |

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
```

Después, en MySQL (Workbench o la consola), ejecutar primero `schema.sql` y después `insert_ticket.sql`.

## Pruebas

Con los 20 tickets quedan 1 sucursal, 7 empleados, 20 productos, 2 formas de pago (14 con tarjeta y 6 en efectivo), 20 tickets y 157 líneas. Cargado en MySQL, la suma de las líneas de cada ticket da su subtotal.

Para probar las validaciones, copié algunos tickets a otra carpeta y les cambié un dato a cada uno:

| Cambio | Resultado |
|---|---|
| El mismo ticket dos veces | `ticket repetido: 20010001` |
| `TOTAL A PAGAR` cambiado | `subtotal + IVA no coincide con el total` |
| CIF `B1234` | `CIF incorrecto: B1234` |
| Fecha `31/02/2025` | `day is out of range for month` |
| Sin la línea `Cajero:` | `falta el campo cajero` |
| Ticket `2001X006` | `número de ticket incorrecto: 2001X006` |
| Cantidad `0` | `cantidad o importe incorrecto: ...` |
| Sin argumento | `Pasá la carpeta de los tickets: ...` |
| Carpeta que no existe | `No existe la carpeta 'no_existe'` |

Los productos por kg tienen una diferencia de un céntimo según el ticket (la Manzana Golden sale a 1.24 o a 1.25 el kg) por el redondeo del supermercado. Se guarda el precio del primer ticket donde aparece.
