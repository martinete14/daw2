#Martin Villagra DAW 2
'''
Prog. N°4 - Conversor de segundos a formato hh:mm:ss
'''
segundos = int(input("¿Cuántos segundos quieres convertir?: "))
horas = segundos // 3600
resto_tras_horas = segundos % 3600
minutos = resto_tras_horas // 60
segundos_restantes = resto_tras_horas % 60
print(f"Resultado: {horas:02}:{minutos:02}:{segundos_restantes:02}")
