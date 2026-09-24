#Martin Villagra DAW 2
'''
Prog. N°7 - Área, perímetro y diagonal de un rectángulo
'''
base = float(input("Base del rectángulo: "))
altura = float(input("Altura del rectángulo: "))
area = base*altura
perimetro = 2*(base+altura)
diagonal = ((base**2)+(altura**2))**0.5
print(f"Área: {area:.2f}\n Perímetro: {perimetro:.2f}\n Diagonal: {diagonal:.2f}")
