#Martin Villagra DAW 2
'''
Prog. N°8 - Reparto de entradas entre grupos
'''
entradas_disponibles = int(input("Entradas disponibles en total: "))
grupos_presentes = int(input("Cantidad de grupos: "))
entradas_entregadas = entradas_disponibles // grupos_presentes
entradas_sin_repartir = entradas_disponibles % grupos_presentes
print(f"A cada grupo le tocan {entradas_entregadas} entradas")
print(f"Sobran {entradas_sin_repartir} entradas sin repartir")
