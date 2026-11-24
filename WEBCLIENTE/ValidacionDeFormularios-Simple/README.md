# Examen WebCliente: validación simple de formularios

Martin Villagra Tejerina - DAW 2

## Análisis del problema

- **Qué resuelve:** valida con JavaScript el formulario de inscripción al gimnasio que nos dio el profe, y le avisa al usuario, debajo de cada campo, qué está mal y por qué.
- **Entrada:** lo que el usuario escribe o elige en cada campo.
- **Salida:** un mensaje de error debajo del campo que está mal (borde rojo) o el borde azul si está bien. Al enviar, un `alert` dice si el formulario se envió o no.
- **Criterio:** cada campo se valida al salir de él (`blur`) o al cambiarlo (`change`). Al pulsar **Enviar** se validan todos de nuevo y, si queda algún error, no se envía. **Limpiar** borra los mensajes y los bordes.

## Archivos

- `index.html`: el formulario del profe (6 bloques). Tiene `novalidate` en el `<form>`, así que el navegador no muestra sus globos: los errores los pone el JS.
- `js/formValidation.js`: toda la validación, en un solo archivo y sin módulos.
- `css/styles.css`: los estilos del profe y, al final, los de validación (`aria-invalid`, `data-valid` y `.error-msg`).

## Estructura del script

| Parte | Qué hace |
|---|---|
| Elementos | Un `const` por campo con `getElementById` o `querySelector`. Para los radios y checkbox se guarda su grupo `.chips`, que es donde va el mensaje |
| Eventos | `blur` en los campos de texto y `change` en los select, radios y checkbox. `submit` y `reset` en el formulario |
| `handleValidar...` | Una función por campo: lee el valor con `.trim()`, lo comprueba y llama a `showError` o a `clearError` |
| `handleEnviar` | `preventDefault()`, llama a todas las `handleValidar...` y cuenta los `.error-msg`: si hay alguno, `alert` de no enviado |
| `handleLimpiar` | Borra los `.error-msg`, pone `aria-invalid="false"` y quita `data-valid` |
| `showError` / `clearError` | Los dos helpers que tocan el DOM |

### Los helpers

- `showError(input, message)`: si el campo todavía no tenía error, le pone `aria-invalid="true"`, le quita `data-valid` y crea un `<p class="error-msg">` con el mensaje en el contenedor del campo. Si ya tenía error, solo le cambia el texto, así no se repiten mensajes.
- `clearError(input)`: le pone `data-valid="true"` y, si tenía error, pone `aria-invalid="false"` y borra el mensaje.

El CSS pinta de rojo los `input[aria-invalid="true"]` y de azul los `input[data-valid="true"]`.

## Validaciones

| Campo | Obligatorio | Regla | Mensaje |
|---|---|---|---|
| Nombre / Apellidos | Sí | Al menos 3 caracteres | `El nombre debe tener al menos 3 caracteres` |
| DNI | Sí | `/^[A-Za-z0-9]{5,15}$/` | `El DNI no es válido, debe tener entre 5 y 15 caracteres alfanuméricos` |
| Fecha de nacimiento | Sí | No futura, entre 15 y 120 años | `Debes tener al menos 15 años` |
| Sexo / Estado civil / Nivel | No | Una de las opciones del select | `El sexo seleccionado no es válido` |
| Email | Sí | `/^[^\s@]+@[^\s@]+\.[^\s@]+$/` | `El email no es válido` |
| Teléfono | Sí | `/^[0-9\s+()-]{9,20}$/` | `El teléfono no es válido, usa entre 9 y 20 caracteres: ...` |
| Preferencia de contacto | Sí (viene marcado Email) | Un radio marcado | `Elige una preferencia de contacto` |
| Dirección | Sí | Al menos 5 caracteres | `La dirección debe tener al menos 5 caracteres` |
| Ciudad | Sí | Al menos 3 caracteres | `La ciudad debe tener al menos 3 caracteres` |
| Código postal | Sí | `/^[0-9]{5}$/` | `El código postal no es válido, debe tener 5 dígitos` |
| Altura | Sí | Número entre 120 y 230 | `La altura debe estar entre 120 y 230 cm` |
| Peso | Sí | Número entre 35 y 250 | `El peso debe estar entre 35 y 250 kg` |
| Objetivos | No | Máximo 500 caracteres | `Los objetivos no pueden superar los 500 caracteres` |
| Condiciones médicas | No | «Ninguna» no va con otras | `Si marcas «Ninguna» no puedes marcar otras condiciones` |
| Plan | Sí | Elegir uno | `El plan es obligatorio` |
| Días preferidos | Sí | Al menos un día | `Elige al menos un día` |
| Franja horaria | Siempre tiene una elegida | Una de las 5 franjas | `Elige una franja horaria válida` |
| Clases grupales | No | Máximo 3 | `Puedes elegir como máximo 3 clases` |
| Referido | No | 3 a 30 letras o números | `El referido debe tener entre 3 y 30 letras o números` |
| NIF/NIE factura | No | `/^[A-Za-z0-9]{8,15}$/` | `El NIF/NIE debe tener entre 8 y 15 caracteres alfanuméricos` |
| Dirección de facturación | No | Al menos 5 caracteres | `La dirección de facturación debe tener al menos 5 caracteres` |
| IBAN (4 últimos) | Sí | `/^[0-9]{4}$/` | `Escribe solo los 4 últimos dígitos del IBAN` |
| Términos y privacidad | Sí | Las dos casillas marcadas | `Debes aceptar los términos y condiciones` / `Debes autorizar el tratamiento de tus datos` |

Los campos obligatorios vacíos dan `El ... es obligatorio`. Los opcionales vacíos están bien; si se escriben, se validan.

En **Clases grupales**, `handleMarcarClase` hace que un clic marque o desmarque la clase sin mantener Ctrl.

## Ejecución

Abrir `index.html` con Live Server (o con doble clic). Como el script no es un módulo, funciona igual abriéndolo como archivo.

## Pruebas

Probado en Chrome tecleando en los campos:

| Prueba | Resultado |
|---|---|
| Nombre vacío y salir | `El nombre es obligatorio` |
| Apellido `Pe` | `El apellido debe tener al menos 3 caracteres` |
| DNI `12-34` | `El DNI no es válido, ...` |
| Fecha 01/01/2015 | `Debes tener al menos 15 años` |
| Email `martin@correo` | `El email no es válido` |
| Teléfono `600 12` | `El teléfono no es válido, ...` |
| CP `123` | `El código postal no es válido, debe tener 5 dígitos` |
| Altura `100` | `La altura debe estar entre 120 y 230 cm` |
| Nombre `Ma` después de vacío | Cambia el texto del mensaje, no agrega otro |
| Enviar con errores | `alert`: `Formulario no enviado. Revisa los campos marcados en rojo.` y 16 campos marcados |
| «Ninguna» + «Lesiones recientes» | `Si marcas «Ninguna» no puedes marcar otras condiciones` |
| Todo bien y Enviar | `alert`: `Formulario enviado` |
| Limpiar | Sin mensajes ni bordes |
