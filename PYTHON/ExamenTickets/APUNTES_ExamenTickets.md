# Apuntes examen Python · tickets

Para mí: qué falta para entregar, cómo funciona el script y qué contestar si me preguntan. Lo formal está en el README.

## Lo que falta para la entrega

- [ ] **Diagrama:** en MySQL Workbench, *Database → Reverse Engineer*, elegir `tickets_db` y capturar el diagrama con las 6 tablas. La base ya está cargada en el MySQL de XAMPP; si no está, ejecutar `schema.sql` y después `insert_ticket.sql`.
- [ ] **Ejecución:** terminal dentro de `ExamenTickets`, correr `python build_insert_from_tickets.py data_tickets` y capturar la salida.
- [ ] **SQL:** abrir `insert_ticket.sql` en VS Code y capturar el principio.
- [ ] Guardar las 3 en `capturas/` (`diagrama.png`, `ejecucion.png`, `sql.png`).
- [ ] Armar el PDF de la entrega: las capturas y la explicación del README.
- [ ] Preguntarle al profe si `forma_pago` como sexta tabla le va bien (sugería 5 como mínimo).

## La idea en una línea

Carpeta de `.txt` → cada ticket se vuelve un **diccionario** → se juntan todos en `datos` sin repetir nada → se escribe un `INSERT` por registro en `insert_ticket.sql`.

## El recorrido, función por función

```
main()
 ├─ pedir_carpeta()        sys.argv[1] → "data_tickets"
 ├─ procesar_carpeta()     para cada .txt, en orden:
 │    ├─ leer_ticket()          el archivo → lista de líneas
 │    ├─ parsear_lineas()       las líneas → diccionario del ticket
 │    │    ├─ parsear_sucursal()    (solo las 3 primeras líneas)
 │    │    ├─ parsear_fecha / cajero / numero / producto / totales / pago   (cada línea pasa por todas)
 │    │    └─ validar_ticket()      ¿falta algo? ¿dan las cuentas?
 │    └─ guardar_ticket()       lo suma a `datos` sin repetir
 ├─ generar_sql()          `datos` → lista de INSERT
 ├─ escribir_sql()         → insert_ticket.sql
 └─ mostrar_resumen()      RESUMEN DE LA CARGA: 20 / 7 / 20 / 2
```

El truco de las `parsear_*`: **todas reciben todas las líneas**, pero cada una solo hace algo si la línea empieza con *su* etiqueta (`Fecha:`, `Cajero:`...). Las demás la ignoran.

## Cómo queda un ticket por dentro

`factura_001.txt` después de `parsear_lineas()`:

```python
{
  'autorizacion': '741486',            # None si es en efectivo
  'lineas': [(2.0, 'Pasta Spaghetti 500g', 1.7),
             (2.5, 'Manzana Golden (kg)', 3.12), ...],   # (cantidad, descripción, importe)
  'sucursal_nombre': 'SUPERMERCADOS EL AHORRO',
  'sucursal_direccion': 'Av. Principal #123 - Madrid',
  'cif': 'B12345678',
  'telefono': '910123456',
  'fecha': datetime(2025, 9, 11, 17, 1),
  'cajero': (15, 'Juan Pérez'),         # (código, nombre)
  'numero': 20010001,
  'subtotal': 25.42, 'iva': 5.34, 'total': 30.76,
  'forma_pago': 'TARJETA',
}
```

## Cómo queda `datos` con los 20 tickets

Un diccionario por tabla. La **clave** es lo que hace que no se repita:

```python
datos["sucursal"]   = {'B12345678': {'id': 1, 'nombre': ..., 'direccion': ..., 'telefono': ...}}
datos["empleado"]   = {15: {'nombre': 'Juan Pérez', 'sucursal_id': 1}, 33: {...}, ...}   # 7
datos["forma_pago"] = {'TARJETA': 1, 'EFECTIVO': 2}
datos["producto"]   = {'Pasta Spaghetti 500g': {'id': 1, 'precio': 0.85}, ...}          # 20
datos["ticket"]     = {20010001: {...el ticket de arriba...}, ...}                      # 20
```

Juan Pérez sale en varios tickets, pero como la clave es `15`, `setdefault` lo guarda la primera vez y las siguientes no hace nada.

## Las cosas de Python que usa

| Qué | Para qué | Ejemplo |
|---|---|---|
| `sys.argv[1]` | La carpeta que se escribe al ejecutar | `python build_insert_from_tickets.py data_tickets` → `"data_tickets"` |
| `sorted(os.listdir(carpeta))` | Los archivos en orden, 001 a 020 | |
| `.split()` sin nada | Corta por espacios, por muchos que haya | `"  2   Pasta Spaghetti 500g   1.70 €"` → `['2', 'Pasta', 'Spaghetti', '500g', '1.70', '€']` |
| `partes[-2]` | El anteúltimo: el importe (el último es `€`) | `'1.70'` |
| `" ".join(partes[1:-2])` | Vuelve a pegar la descripción | `'Pasta Spaghetti 500g'` |
| `.removeprefix("Ticket:")` | Saca la etiqueta del principio | `"Ticket: 20010001"` → `" 20010001"` |
| `datetime.strptime(texto, "%d/%m/%Y %H:%M")` | Texto → fecha; si la fecha no existe (31/02) tira `ValueError` | |
| `dic.setdefault(clave, valor)` | Guarda solo si la clave no está, y devuelve lo que haya | |
| `raise ValueError("...")` | Corta el ticket con un motivo | `raise ValueError("ticket sin productos")` |
| `try / except Exception as error` | Atrapa ese motivo, avisa y sigue con el próximo ticket | `Descarto 'x.txt': ticket sin productos` |
| `f"{importe:.2f}"` / `f"{cantidad:g}"` | 2 decimales / sin `.0` de más | `1.70` / `2` y `2.5` |

## La base, en criollo

- **sucursal**: hay una sola (El Ahorro, Madrid), pero la tabla queda por si aparecen otras. Se distingue por el CIF.
- **empleado**: el `id` es directamente el código del cajero del ticket (`015` → 15). No hace falta inventar otro.
- **producto**: se distingue por la descripción. El precio es por unidad o por kg: `importe / cantidad` del primer ticket donde aparece.
- **forma_pago**: TARJETA y EFECTIVO, así no se repite el texto en cada ticket.
- **ticket**: la clave es el número del ticket. `autorizacion` queda en `NULL` si se pagó en efectivo.
- **ticket_linea**: une ticket y producto (relación muchos a muchos). La clave son las dos juntas. `cantidad` con 3 decimales por el `2.500` de los kg.

Orden de los `INSERT`: sucursal → empleado → forma_pago → producto → ticket → ticket_linea. Siempre el "padre" antes que el "hijo", si no la clave foránea falla.

## Si me preguntan

- **¿Por qué `round(..., 2)` al comparar?** Porque los `float` no son exactos. En el ticket 20010001 la suma de las líneas da `25.419999999999998` y no `25.42`. Sin el `round` lo descartaría estando bien.
- **¿Por qué `parsear_sucursal` es distinta?** Porque sus datos no tienen etiqueta, son siempre las 3 primeras líneas. Por eso recibe todas las líneas y se llama una sola vez.
- **¿Cómo sabe que una línea es un producto?** Empieza con espacio y lo primero es un número (`  2   Pasta...`). La cabecera también empieza con espacios, pero con letras (`Av.`, `CIF:`).
- **¿Y `TOTAL` no se confunde con `SUBTOTAL`?** No, porque mira con qué *empieza* la línea: `SUBTOTAL` empieza con S.
- **¿Qué pasa si un ticket viene mal?** `raise ValueError` con el motivo, el `except` de `procesar_carpeta` lo atrapa, muestra `Descarto 'archivo': motivo` y sigue. Los demás se cargan igual.
- **¿Por qué el precio sale de `importe / cantidad`?** El ticket no trae el precio unitario, solo el total de la línea. En los productos por kg puede variar un céntimo entre tickets por el redondeo (Manzana 1.24 o 1.25); me quedo con el primero.
- **¿Por qué `sys.argv` y no `input()`?** Así se ejecuta de una pasándole la carpeta, sin preguntar nada, y sirve para cualquier carpeta de tickets.
- **¿Por qué `with open`?** Cierra el archivo solo, aunque haya un error.
- **¿Por qué `encoding="utf-8"`?** Por las tildes y el `€`. Sin eso, en Windows lee mal `Pérez` o `Café`.

## Probarlo rápido

```
cd PYTHON/ExamenTickets
python build_insert_from_tickets.py data_tickets      # bien: 20 | 7 | 20 | 2
python build_insert_from_tickets.py                   # sin carpeta: avisa
python build_insert_from_tickets.py no_existe         # carpeta mal: avisa
```

Para probar una validación: copiar un ticket a otra carpeta, romperle un dato (el total, el CIF, poner fecha 31/02...) y correr el script con esa carpeta. Tiene que decir `Descarto ...` con el motivo.

Para comprobar en MySQL que todo cuadra:

```sql
SELECT COUNT(*) FROM ticket;        -- 20
SELECT COUNT(*) FROM ticket_linea;  -- 157
SELECT t.numero, t.subtotal, SUM(l.importe)
FROM ticket t JOIN ticket_linea l ON l.ticket_numero = t.numero
GROUP BY t.numero;                  -- el subtotal y la suma tienen que dar igual
```

## Respecto de lo de Christian

Es la misma idea, los mismos parámetros y las mismas validaciones (`Skyfreefury/Python`, carpeta `ex`), y da exactamente los mismos datos. Lo que cambia en la mía:
- `main()` está separado en ENTRADA / PROCESO / SALIDA, con `pedir_carpeta`, `leer_ticket`, `escribir_sql` y `mostrar_resumen` aparte.
- Lee los tickets en orden con `sorted`.
- El SQL está separado por tabla y los importes salen con 2 decimales, como en el ticket.
- Lleva docstrings con la línea de ejemplo que lee cada función, y los mensajes van con voseo.
