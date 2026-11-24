#Martin Villagra Tejerina DAW 2
'''
Examen Python: generador de INSERT a partir de tickets

Análisis del problema:
- Qué resuelve: pasa los tickets de compra de SUPERMERCADOS EL AHORRO (archivos .txt)
  a sentencias INSERT para cargarlos en la base de datos tickets_db (schema.sql).
- Entrada: la carpeta con los tickets, como argumento al ejecutar el script:
  python build_insert_from_tickets.py data_tickets
- Salida: el archivo insert_ticket.sql con los INSERT de las 6 tablas, y por pantalla
  un resumen con cuántos tickets, empleados, productos y formas de pago quedaron.
- Criterio: cada sucursal, empleado, forma de pago y producto se guarda una sola vez
  aunque aparezca en muchos tickets. Si un ticket tiene algún dato mal, se avisa,
  se descarta y se sigue con el siguiente.
'''

import os
import sys
from datetime import datetime

FICHERO_SALIDA = "insert_ticket.sql"


# ---------- Entrada: la carpeta que se pasa al ejecutar ----------

def pedir_carpeta() -> str:
    """Devuelve la carpeta de los tickets que viene en sys.argv."""
    if len(sys.argv) < 2:
        print("Pasá la carpeta de los tickets: python build_insert_from_tickets.py data_tickets")
        sys.exit(1)
    carpeta = sys.argv[1]
    if not os.path.isdir(carpeta):
        print(f"No existe la carpeta '{carpeta}'")
        sys.exit(1)
    return carpeta


def leer_ticket(ruta: str) -> list[str]:
    """Abre un ticket y devuelve sus líneas."""
    with open(ruta, "r", encoding="utf-8") as archivo:
        return archivo.read().splitlines()


# ---------- Parseo: cada función se fija solo en su línea ----------

def parsear_sucursal(lineas: list[str], ticket: dict) -> None:
    """Las 3 primeras líneas: nombre, dirección, CIF y teléfono."""
    ticket["sucursal_nombre"] = lineas[0].strip()
    ticket["sucursal_direccion"] = lineas[1].strip()
    partes = lineas[2].split()  # ['CIF:', 'B12345678', 'Tel:', '910123456']
    ticket["cif"] = partes[1]
    ticket["telefono"] = partes[3]
    if len(ticket["cif"]) != 9:
        raise ValueError(f"CIF incorrecto: {ticket['cif']}")


def parsear_fecha(linea: str, ticket: dict) -> None:
    """Fecha: 11/09/2025        Hora: 17:01"""
    if linea.startswith("Fecha:"):
        partes = linea.split()  # ['Fecha:', '11/09/2025', 'Hora:', '17:01']
        ticket["fecha"] = datetime.strptime(f"{partes[1]} {partes[3]}", "%d/%m/%Y %H:%M")


def parsear_cajero(linea: str, ticket: dict) -> None:
    """Cajero: 015 - Juan Pérez"""
    if linea.startswith("Cajero:"):
        codigo, nombre = linea.removeprefix("Cajero:").split(" - ")
        codigo = codigo.strip()
        if not codigo.isdigit():
            raise ValueError(f"código de cajero incorrecto: {codigo}")
        ticket["cajero"] = (int(codigo), nombre.strip())


def parsear_numero(linea: str, ticket: dict) -> None:
    """Ticket: 20010001"""
    if linea.startswith("Ticket:"):
        numero = linea.removeprefix("Ticket:").strip()
        if not numero.isdigit():
            raise ValueError(f"número de ticket incorrecto: {numero}")
        ticket["numero"] = int(numero)


def parsear_producto(linea: str, ticket: dict) -> None:
    """  2   Pasta Spaghetti 500g              1.70 €"""
    partes = linea.split()
    if linea.startswith(" ") and partes and partes[0][0].isdigit():
        cantidad = float(partes[0])
        importe = float(partes[-2])  # el último es el €
        descripcion = " ".join(partes[1:-2])
        if cantidad <= 0 or importe <= 0:
            raise ValueError(f"cantidad o importe incorrecto: {linea.strip()}")
        ticket["lineas"].append((cantidad, descripcion, importe))


def parsear_totales(linea: str, ticket: dict) -> None:
    """SUBTOTAL, IVA (21%) y TOTAL A PAGAR: el importe es el anteúltimo dato."""
    if linea.startswith("SUBTOTAL"):
        ticket["subtotal"] = float(linea.split()[-2])
    elif linea.startswith("IVA"):
        ticket["iva"] = float(linea.split()[-2])
    elif linea.startswith("TOTAL"):
        ticket["total"] = float(linea.split()[-2])


def parsear_pago(linea: str, ticket: dict) -> None:
    """FORMA DE PAGO: TARJETA  /  Autorización: 741486 (solo con tarjeta)"""
    if linea.startswith("FORMA DE PAGO:"):
        ticket["forma_pago"] = linea.removeprefix("FORMA DE PAGO:").strip()
    elif linea.startswith("Autorización:"):
        ticket["autorizacion"] = linea.removeprefix("Autorización:").strip()


def validar_ticket(ticket: dict) -> None:
    """Comprueba que no falte nada y que las cuentas den."""
    for campo in ("numero", "cajero", "fecha", "forma_pago", "subtotal", "iva", "total"):
        if campo not in ticket:
            raise ValueError(f"falta el campo {campo}")
    if not ticket["lineas"]:
        raise ValueError("ticket sin productos")
    if round(ticket["subtotal"] + ticket["iva"], 2) != ticket["total"]:
        raise ValueError("subtotal + IVA no coincide con el total")
    suma = sum(importe for cantidad, descripcion, importe in ticket["lineas"])
    if round(suma, 2) != ticket["subtotal"]:
        raise ValueError("la suma de productos no coincide con el subtotal")


def parsear_lineas(lineas: list[str]) -> dict:
    """Arma el diccionario de un ticket pasando cada línea por todas las funciones."""
    ticket = {"autorizacion": None, "lineas": []}
    parsear_sucursal(lineas, ticket)
    for linea in lineas:
        parsear_fecha(linea, ticket)
        parsear_cajero(linea, ticket)
        parsear_numero(linea, ticket)
        parsear_producto(linea, ticket)
        parsear_totales(linea, ticket)
        parsear_pago(linea, ticket)
    validar_ticket(ticket)
    return ticket


# ---------- Proceso: juntar los tickets sin repetir datos ----------

def guardar_ticket(ticket: dict, datos: dict) -> None:
    """Guarda el ticket y, con setdefault, cada sucursal, empleado, pago y producto una sola vez."""
    if ticket["numero"] in datos["ticket"]:
        raise ValueError(f"ticket repetido: {ticket['numero']}")

    sucursal = datos["sucursal"].setdefault(ticket["cif"], {
        "id": len(datos["sucursal"]) + 1,
        "nombre": ticket["sucursal_nombre"],
        "direccion": ticket["sucursal_direccion"],
        "telefono": ticket["telefono"],
    })

    codigo, nombre = ticket["cajero"]
    datos["empleado"].setdefault(codigo, {"nombre": nombre, "sucursal_id": sucursal["id"]})

    datos["forma_pago"].setdefault(ticket["forma_pago"], len(datos["forma_pago"]) + 1)

    for cantidad, descripcion, importe in ticket["lineas"]:
        datos["producto"].setdefault(descripcion, {
            "id": len(datos["producto"]) + 1,
            "precio": round(importe / cantidad, 2),
        })

    datos["ticket"][ticket["numero"]] = ticket


def procesar_carpeta(carpeta: str) -> dict:
    """Lee todos los .txt de la carpeta, en orden, y descarta los que tengan errores."""
    datos = {"sucursal": {}, "empleado": {}, "forma_pago": {}, "producto": {}, "ticket": {}}
    for nombre in sorted(os.listdir(carpeta)):
        if not nombre.endswith(".txt"):
            continue
        try:
            ticket = parsear_lineas(leer_ticket(os.path.join(carpeta, nombre)))
            guardar_ticket(ticket, datos)
        except Exception as error:
            print(f"Descarto '{nombre}': {error}")
    return datos


def generar_sql(datos: dict) -> list[str]:
    """Arma un INSERT por registro, en orden para que cada clave foránea ya exista."""
    sql = ["USE tickets_db;", "", "-- sucursal"]
    for cif, s in datos["sucursal"].items():
        sql.append(f"INSERT INTO sucursal (id, cif, nombre, direccion, telefono) "
                   f"VALUES ({s['id']}, '{cif}', '{s['nombre']}', '{s['direccion']}', '{s['telefono']}');")

    sql += ["", "-- empleado"]
    for codigo, e in datos["empleado"].items():
        sql.append(f"INSERT INTO empleado (id, nombre, sucursal_id) "
                   f"VALUES ({codigo}, '{e['nombre']}', {e['sucursal_id']});")

    sql += ["", "-- forma_pago"]
    for nombre, id_pago in datos["forma_pago"].items():
        sql.append(f"INSERT INTO forma_pago (id, nombre) VALUES ({id_pago}, '{nombre}');")

    sql += ["", "-- producto"]
    for descripcion, p in datos["producto"].items():
        sql.append(f"INSERT INTO producto (id, descripcion, precio) "
                   f"VALUES ({p['id']}, '{descripcion}', {p['precio']:.2f});")

    sql += ["", "-- ticket y ticket_linea"]
    for numero, t in datos["ticket"].items():
        autorizacion = f"'{t['autorizacion']}'" if t["autorizacion"] else "NULL"
        sql.append(f"INSERT INTO ticket (numero, fecha_hora, empleado_id, subtotal, iva, total, forma_pago_id, autorizacion) "
                   f"VALUES ({numero}, '{t['fecha']}', {t['cajero'][0]}, {t['subtotal']:.2f}, {t['iva']:.2f}, "
                   f"{t['total']:.2f}, {datos['forma_pago'][t['forma_pago']]}, {autorizacion});")
        for cantidad, descripcion, importe in t["lineas"]:
            sql.append(f"INSERT INTO ticket_linea (ticket_numero, producto_id, cantidad, importe) "
                       f"VALUES ({numero}, {datos['producto'][descripcion]['id']}, {cantidad:g}, {importe:.2f});")
    return sql


# ---------- Salida ----------

def escribir_sql(sql: list[str], fichero: str) -> None:
    """Guarda los INSERT en el fichero, uno por línea."""
    with open(fichero, "w", encoding="utf-8") as archivo:
        archivo.write("\n".join(sql) + "\n")


def mostrar_resumen(datos: dict) -> None:
    """Muestra cuántos registros quedaron de cada cosa."""
    print("=" * 34)
    print("  RESUMEN DE LA CARGA")
    print("=" * 34)
    print(f"  {'Tickets':<16}{len(datos['ticket']):>6}")
    print(f"  {'Empleados':<16}{len(datos['empleado']):>6}")
    print(f"  {'Productos':<16}{len(datos['producto']):>6}")
    print(f"  {'Formas de pago':<16}{len(datos['forma_pago']):>6}")
    print("-" * 34)
    print(f"  SQL listo en {FICHERO_SALIDA}")


def main():
    # ENTRADA
    carpeta = pedir_carpeta()

    # PROCESO
    datos = procesar_carpeta(carpeta)
    sql = generar_sql(datos)

    # SALIDA
    escribir_sql(sql, FICHERO_SALIDA)
    mostrar_resumen(datos)


if __name__ == "__main__":
    main()
