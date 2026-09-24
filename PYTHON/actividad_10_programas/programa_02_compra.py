#Martin Villagra DAW 2
'''
Prog. N°2 - Presupuesto de una compra con IVA
'''

nombre_producto = input("Nombre del producto: ")
precio_producto = float(input("Precio por unidad: "))
und_producto = int(input("Unidades a comprar: "))
iva = float(input("Porcentaje de IVA a aplicar: "))
importe_producto_sin_iva = precio_producto * und_producto
iva_del_producto = importe_producto_sin_iva * (iva/100)
importe_producto_con_iva = importe_producto_sin_iva + iva_del_producto
print(f"Importe de {nombre_producto} sin IVA: {importe_producto_sin_iva:.2f} euros")
print(f"IVA aplicado: {iva_del_producto:.2f} euros")
print(f"Precio final con IVA: {importe_producto_con_iva:.2f} euros")
