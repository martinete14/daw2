#Martin Villagra DAW 2
'''
Prog. N°9 - Comparador lógico de acceso
'''
edad_usuario = int(input("¿Qué edad tiene?: "))
autorizacion = input("¿Cuenta con autorización? (Si/No): ")
identificacion = input("¿Tiene identificación? (Si/No): ")
#acepto "si" con y sin tilde, si no al poner "Sí" daba False
tiene_autorizacion = autorizacion.lower() == "si" or autorizacion.lower() == "sí"
tiene_identificacion = identificacion.lower() == "si" or identificacion.lower() == "sí"
es_mayor_de_edad = edad_usuario >= 18
acceso_completo = es_mayor_de_edad and tiene_autorizacion and tiene_identificacion
acceso_supervisado = tiene_autorizacion or es_mayor_de_edad
acceso_bloqueado = not tiene_identificacion
print(f"Mayor de edad: {es_mayor_de_edad}")
print(f"Acceso completo: {acceso_completo}")
print(f"Acceso supervisado: {acceso_supervisado}")
print(f"Acceso bloqueado: {acceso_bloqueado}")
