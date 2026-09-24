#Martin Villagra DAW 2
'''
Prog. N°5 - Nómina básica de un trabajador
'''
nombre_trabajador = input("Nombre del trabajador: ")
#float y no int porque se pueden trabajar medias horas (ej: 40.5)
horas_trabajadas = float(input("Horas trabajadas: "))
precio_hora = float(input("Precio de la hora: "))
retencion_porcentaje = float(input("Porcentaje de retención: "))

salario_bruto = horas_trabajadas * precio_hora
importe_retencion = salario_bruto * (retencion_porcentaje/100)
salario_neto = salario_bruto - importe_retencion

print(f"Trabajador: {nombre_trabajador}\n Bruto: {salario_bruto:.2f}\n Retención: {importe_retencion:.2f}\n Neto a cobrar: {salario_neto:.2f}")
