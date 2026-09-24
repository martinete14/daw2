#Martin Villagra DAW 2
'''
Prog. N°10 - Ticket de una tienda informática
'''
nombre_cliente = input("Nombre del cliente: ")
producto = input("Producto: ")
precio_unitario = float(input("Precio por unidad: "))
cant_comprada = int(input("Unidades compradas: "))
porcentaje_descuento = float(input("Descuento a aplicar (%): "))
porcentaje_iva = float(input("IVA a aplicar (%): "))

subtotal = precio_unitario * cant_comprada
importe_descuento = subtotal * porcentaje_descuento/100
precio_despues_descuento = subtotal - importe_descuento
importe_iva = precio_despues_descuento * porcentaje_iva/100
total_de_pago = precio_despues_descuento + importe_iva

print(f"Cliente:   {nombre_cliente:>20}")
print(f"Producto:  {producto:>20}")
print(f"Cantidad:  {cant_comprada:>20}")
print(f"Subtotal:  {subtotal:>18.2f} €")
print(f"Descuento: {importe_descuento:>18.2f} €")
print(f"IVA:       {importe_iva:>18.2f} €")
print(f"TOTAL:     {total_de_pago:>18.2f} €")
