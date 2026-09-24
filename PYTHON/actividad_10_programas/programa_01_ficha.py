#Martin Villagra DAW 2
'''
Prog. N°1 - Ficha personal con los datos del usuario
'''

nombre = input("Escriba su nombre completo: ")
edad = int(input("Escriba su edad: "))
altura = float(input("Escriba su altura en metros: "))
residencia = input("Escriba su ciudad de residencia: ")
exp_programacion = input("¿Tiene experiencia programando? (Sí/No): ")
print(f"¡Bienvenido, {nombre}! Con {edad} años, mides {altura} metros y resides en {residencia} // Experiencia programando: {exp_programacion}")
print(f"La edad es de tipo {type(edad)} y la altura de tipo {type(altura)}")
