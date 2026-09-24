#Martin Villagra DAW 2
'''
Prog. N°3 - Conversor de Celsius a Fahrenheit y Kelvin
'''
grados_celsius = float(input("Temperatura en grados Celsius: "))
grados_fahrenheit = grados_celsius * 9 / 5 + 32
grados_kelvin = grados_celsius + 273.15
print(f"{grados_celsius} grados Celsius equivalen a\n Fahrenheit: {grados_fahrenheit:.2f}\n Kelvin: {grados_kelvin:.2f}")
