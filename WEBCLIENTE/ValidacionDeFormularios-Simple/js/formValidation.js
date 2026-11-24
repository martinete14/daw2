//Martin Villagra Tejerina DAW 2
/*
Examen WebCliente: validación simple del formulario de inscripción al gimnasio

Análisis del problema:
- Qué resuelve: revisa con JavaScript los datos del formulario y le avisa al usuario,
  debajo de cada campo, qué está mal y por qué.
- Entrada: lo que el usuario escribe o elige en cada campo del formulario.
- Salida: un mensaje de error debajo del campo que está mal (borde rojo) o el borde
  azul si está bien. Al enviar, un alert dice si el formulario se envió o no.
- Criterio: cada campo se valida al salir de él (blur) o al cambiarlo (change).
  Al pulsar "Enviar" se validan todos de nuevo y, si queda algún error, no se envía.
  "Limpiar" borra los mensajes de error y los bordes.
*/

// ---------- Elementos del formulario ----------

const formulario = document.getElementById("form-inscripcion")

// 1) Datos personales
const nombreInput = document.getElementById("nombre")
const apellidoInput = document.getElementById("apellidos")
const dniInput = document.getElementById("dni")
const fechaNacimientoInput = document.getElementById("fecha-nac")
const sexoInput = document.getElementById("sexo")
const estadoCivilInput = document.getElementById("estado-civil")

// 2) Contacto y dirección
const emailInput = document.getElementById("email")
const telefonoInput = document.getElementById("telefono")
const contactoInputs = document.querySelectorAll('input[name="contacto_pref"]')
const contactoChips = contactoInputs[0].closest(".chips")
const direccionInput = document.getElementById("direccion")
const ciudadInput = document.getElementById("ciudad")
const codigoPostalInput = document.getElementById("cp")

// 3) Salud y objetivos
const alturaInput = document.getElementById("altura")
const pesoInput = document.getElementById("peso")
const nivelInput = document.getElementById("nivel")
const objetivosInput = document.getElementById("objetivos")
const condicionesInputs = document.querySelectorAll('input[name="condiciones[]"]')
const condicionesChips = condicionesInputs[0].closest(".chips")

// 4) Plan y horarios
const planInput = document.getElementById("plan")
const diasInputs = document.querySelectorAll('input[name="dias[]"]')
const diasChips = diasInputs[0].closest(".chips")
const horaInput = document.getElementById("hora")
const clasesInput = document.getElementById("clases")
const referidoInput = document.getElementById("referido")

// 5) Facturación
const nifFacturaInput = document.getElementById("nif-fac")
const direccionFacturaInput = document.getElementById("dir-fac")
const ibanInput = document.getElementById("iban")

// 6) Consentimientos
const tosInput = document.querySelector('input[name="tos"]')
const rgpdInput = document.querySelector('input[name="rgpd"]')
const tosLabel = tosInput.parentElement
const rgpdLabel = rgpdInput.parentElement

// ---------- Eventos ----------
// Los campos de texto se validan al salir (blur); los select, radios y checkbox al cambiar (change)

formulario.addEventListener("submit", handleEnviar)
formulario.addEventListener("reset", handleLimpiar)

// 1) Datos personales
nombreInput.addEventListener("blur", handleValidarNombre)
apellidoInput.addEventListener("blur", handleValidarApellido)
dniInput.addEventListener("blur", handleValidarDNI)
fechaNacimientoInput.addEventListener("blur", handleValidarFechaNacimiento)
sexoInput.addEventListener("change", handleValidarSexo)
estadoCivilInput.addEventListener("change", handleValidarEstadoCivil)

// 2) Contacto y dirección
emailInput.addEventListener("blur", handleValidarEmail)
telefonoInput.addEventListener("blur", handleValidarTelefono)
contactoInputs.forEach(input => input.addEventListener("change", handleValidarContacto))
direccionInput.addEventListener("blur", handleValidarDireccion)
ciudadInput.addEventListener("blur", handleValidarCiudad)
codigoPostalInput.addEventListener("blur", handleValidarCodigoPostal)

// 3) Salud y objetivos
alturaInput.addEventListener("blur", handleValidarAltura)
pesoInput.addEventListener("blur", handleValidarPeso)
nivelInput.addEventListener("change", handleValidarNivel)
objetivosInput.addEventListener("blur", handleValidarObjetivos)
condicionesInputs.forEach(input => input.addEventListener("change", handleValidarCondiciones))

// 4) Plan y horarios
planInput.addEventListener("change", handleValidarPlan)
diasInputs.forEach(input => input.addEventListener("change", handleValidarDias))
horaInput.addEventListener("change", handleValidarHora)
clasesInput.addEventListener("change", handleValidarClases)
clasesInput.addEventListener("mousedown", handleMarcarClase)
referidoInput.addEventListener("blur", handleValidarReferido)

// 5) Facturación
nifFacturaInput.addEventListener("blur", handleValidarNifFactura)
direccionFacturaInput.addEventListener("blur", handleValidarDireccionFactura)
ibanInput.addEventListener("blur", handleValidarIBAN)

// 6) Consentimientos
tosInput.addEventListener("change", handleValidarTos)
rgpdInput.addEventListener("change", handleValidarRgpd)

// ---------- Enviar y limpiar ----------

// Valida todos los campos y, si queda algún mensaje de error, avisa que no se envía
function handleEnviar(event){
    event.preventDefault()
    handleValidarNombre()
    handleValidarApellido()
    handleValidarDNI()
    handleValidarFechaNacimiento()
    handleValidarSexo()
    handleValidarEstadoCivil()
    handleValidarEmail()
    handleValidarTelefono()
    handleValidarContacto()
    handleValidarDireccion()
    handleValidarCiudad()
    handleValidarCodigoPostal()
    handleValidarAltura()
    handleValidarPeso()
    handleValidarNivel()
    handleValidarObjetivos()
    handleValidarCondiciones()
    handleValidarPlan()
    handleValidarDias()
    handleValidarHora()
    handleValidarClases()
    handleValidarReferido()
    handleValidarNifFactura()
    handleValidarDireccionFactura()
    handleValidarIBAN()
    handleValidarTos()
    handleValidarRgpd()

    const errores = formulario.querySelectorAll(".error-msg")
    if(errores.length > 0){
        alert("Formulario no enviado. Revisa los campos marcados en rojo.")
    }
    else{
        alert("Formulario enviado")
    }
}

// Borra los mensajes de error y deja los campos sin marcar
function handleLimpiar(event){
    formulario.querySelectorAll(".error-msg").forEach(error => error.remove())
    formulario.querySelectorAll('[aria-invalid="true"]').forEach(campo => campo.setAttribute("aria-invalid", "false"))
    formulario.querySelectorAll('[data-valid="true"]').forEach(campo => campo.removeAttribute("data-valid"))
}

// ---------- 1) Datos personales ----------

function handleValidarNombre(event){
    const valor = nombreInput.value.trim()
    if(valor === ""){
        showError(nombreInput, "El nombre es obligatorio")
    }
    else if(valor.length < 3){
        showError(nombreInput, "El nombre debe tener al menos 3 caracteres")
    }
    else{
        clearError(nombreInput)
    }
}
function handleValidarApellido(event){
    const valor = apellidoInput.value.trim()
    if(valor === ""){
        showError(apellidoInput, "El apellido es obligatorio")
    }
    else if(valor.length < 3){
        showError(apellidoInput, "El apellido debe tener al menos 3 caracteres")
    }
    else{
        clearError(apellidoInput)
    }
}
function handleValidarDNI(event){
    const valor = dniInput.value.trim()
    const regexDNI = /^[A-Za-z0-9]{5,15}$/
    if(valor === ""){
        showError(dniInput, "El DNI es obligatorio")
    }
    else if(!regexDNI.test(valor)){
        showError(dniInput, "El DNI no es válido, debe tener entre 5 y 15 caracteres alfanuméricos")
    }
    else{
        clearError(dniInput)
    }
}
// Calcula la edad con año, mes y día: si este año todavía no cumplió, resta uno
function handleValidarFechaNacimiento(event){
    const valor = fechaNacimientoInput.value.trim()
    const fecha = new Date(valor + "T00:00")
    const hoy = new Date()
    let edad = hoy.getFullYear() - fecha.getFullYear()
    const meses = hoy.getMonth() - fecha.getMonth()
    if(meses < 0 || (meses === 0 && hoy.getDate() < fecha.getDate())){
        edad--
    }
    if(valor === ""){
        showError(fechaNacimientoInput, "La fecha de nacimiento es obligatoria")
    }
    else if(fecha > hoy){
        showError(fechaNacimientoInput, "La fecha de nacimiento no puede ser futura")
    }
    else if(edad < 15){
        showError(fechaNacimientoInput, "Debes tener al menos 15 años")
    }
    else if(edad > 120){
        showError(fechaNacimientoInput, "La edad no puede superar los 120 años")
    }
    else{
        clearError(fechaNacimientoInput)
    }
}
// Los select opcionales: el valor tiene que ser una de sus opciones ("" = sin elegir)
function handleValidarSexo(event){
    const valor = sexoInput.value
    const sexosValidos = ["", "f", "m", "x"]
    if(!sexosValidos.includes(valor)){
        showError(sexoInput, "El sexo seleccionado no es válido")
    }
    else{
        clearError(sexoInput)
    }
}
function handleValidarEstadoCivil(event){
    const valor = estadoCivilInput.value
    const estadosValidos = ["", "Soltero/a", "Casado/a", "Pareja de hecho", "Divorciado/a", "Viudo/a"]
    if(!estadosValidos.includes(valor)){
        showError(estadoCivilInput, "El estado civil seleccionado no es válido")
    }
    else{
        clearError(estadoCivilInput)
    }
}

// ---------- 2) Contacto y dirección ----------

function handleValidarEmail(event){
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const valor = emailInput.value.trim()
    if(valor === ""){
        showError(emailInput, "El email es obligatorio")
    }
    else if(!regexEmail.test(valor)){
        showError(emailInput, "El email no es válido")
    }
    else{
        clearError(emailInput)
    }
}
function handleValidarTelefono(event){
    const valor = telefonoInput.value.trim()
    const regexTelefono = /^[0-9\s+()-]{9,20}$/
    if(valor === ""){
        showError(telefonoInput, "El teléfono es obligatorio")
    }
    else if(!regexTelefono.test(valor)){
        showError(telefonoInput, "El teléfono no es válido, usa entre 9 y 20 caracteres: números, espacios, +, ( ) o -")
    }
    else{
        clearError(telefonoInput)
    }
}
function handleValidarContacto(event){
    const marcado = document.querySelector('input[name="contacto_pref"]:checked')
    if(marcado === null){
        showError(contactoChips, "Elige una preferencia de contacto")
    }
    else{
        clearError(contactoChips)
    }
}
function handleValidarDireccion(event){
    const valor = direccionInput.value.trim()
    if(valor === ""){
        showError(direccionInput, "La dirección es obligatoria")
    }
    else if(valor.length < 5){
        showError(direccionInput, "La dirección debe tener al menos 5 caracteres")
    }
    else{
        clearError(direccionInput)
    }
}
function handleValidarCiudad(event){
    const valor = ciudadInput.value.trim()
    if(valor === ""){
        showError(ciudadInput, "La ciudad es obligatoria")
    }
    else if(valor.length < 3){
        showError(ciudadInput, "La ciudad debe tener al menos 3 caracteres")
    }
    else{
        clearError(ciudadInput)
    }
}
function handleValidarCodigoPostal(event){
    const valor = codigoPostalInput.value.trim()
    const regexCodigoPostal = /^[0-9]{5}$/
    if(valor === ""){
        showError(codigoPostalInput, "El código postal es obligatorio")
    }
    else if(!regexCodigoPostal.test(valor)){
        showError(codigoPostalInput, "El código postal no es válido, debe tener 5 dígitos")
    }
    else{
        clearError(codigoPostalInput)
    }
}

// ---------- 3) Salud y objetivos ----------

// Primero se comprueba que sea un número (con decimales opcionales) y después el rango
function handleValidarAltura(event){
    const valor = alturaInput.value.trim()
    const regexAltura = /^[0-9]+(\.[0-9]+)?$/
    if(valor === ""){
        showError(alturaInput, "La altura es obligatoria")
    }
    else if(!regexAltura.test(valor)){
        showError(alturaInput, "La altura no es válida")
    }
    else if(Number(valor) < 120 || Number(valor) > 230){
        showError(alturaInput, "La altura debe estar entre 120 y 230 cm")
    }
    else{
        clearError(alturaInput)
    }
}
function handleValidarPeso(event){
    const valor = pesoInput.value.trim()
    const regexPeso = /^[0-9]+(\.[0-9]+)?$/
    if(valor === ""){
        showError(pesoInput, "El peso es obligatorio")
    }
    else if(!regexPeso.test(valor)){
        showError(pesoInput, "El peso no es válido")
    }
    else if(Number(valor) < 35 || Number(valor) > 250){
        showError(pesoInput, "El peso debe estar entre 35 y 250 kg")
    }
    else{
        clearError(pesoInput)
    }
}
function handleValidarNivel(event){
    const valor = nivelInput.value
    const nivelesValidos = ["", "Sedentario", "Ligero (1–2 días/sem)", "Moderado (3–4 días/sem)", "Intenso (5–6 días/sem)", "Atleta"]
    if(!nivelesValidos.includes(valor)){
        showError(nivelInput, "El nivel de actividad no es válido")
    }
    else{
        clearError(nivelInput)
    }
}
function handleValidarObjetivos(event){
    const valor = objetivosInput.value.trim()
    if(valor.length > 500){
        showError(objetivosInput, "Los objetivos no pueden superar los 500 caracteres")
    }
    else{
        clearError(objetivosInput)
    }
}
// "Ninguna" no se puede marcar junto con otra condición
function handleValidarCondiciones(event){
    const marcadas = document.querySelectorAll('input[name="condiciones[]"]:checked')
    const ninguna = document.querySelector('input[name="condiciones[]"][value="ninguna"]')
    if(ninguna.checked && marcadas.length > 1){
        showError(condicionesChips, "Si marcas «Ninguna» no puedes marcar otras condiciones")
    }
    else{
        clearError(condicionesChips)
    }
}

// ---------- 4) Plan y horarios ----------

function handleValidarPlan(event){
    const valor = planInput.value.trim()
    if(valor === ""){
        showError(planInput, "El plan es obligatorio")
    }
    else{
        clearError(planInput)
    }
}
function handleValidarDias(event){
    const marcados = document.querySelectorAll('input[name="dias[]"]:checked')
    if(marcados.length === 0){
        showError(diasChips, "Elige al menos un día")
    }
    else{
        clearError(diasChips)
    }
}
function handleValidarHora(event){
    const valor = horaInput.value
    const horasValidas = ["6:00–9:00", "9:00–12:00", "12:00–16:00", "16:00–19:00", "19:00–22:00"]
    if(!horasValidas.includes(valor)){
        showError(horaInput, "Elige una franja horaria válida")
    }
    else{
        clearError(horaInput)
    }
}
function handleValidarClases(event){
    const seleccionadas = clasesInput.selectedOptions.length
    if(seleccionadas > 3){
        showError(clasesInput, "Puedes elegir como máximo 3 clases")
    }
    else{
        clearError(clasesInput)
    }
}
// Con un clic se marca o desmarca la clase, sin tener que mantener Ctrl
function handleMarcarClase(event){
    if(event.target.tagName === "OPTION"){
        event.preventDefault()
        event.target.selected = !event.target.selected
        handleValidarClases()
    }
}
// Los campos opcionales: vacíos están bien; si se escriben, se validan
function handleValidarReferido(event){
    const valor = referidoInput.value.trim()
    const regexReferido = /^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9\s]{3,30}$/
    if(valor === ""){
        clearError(referidoInput)
    }
    else if(!regexReferido.test(valor)){
        showError(referidoInput, "El referido debe tener entre 3 y 30 letras o números")
    }
    else{
        clearError(referidoInput)
    }
}

// ---------- 5) Facturación ----------

function handleValidarNifFactura(event){
    const valor = nifFacturaInput.value.trim()
    const regexNif = /^[A-Za-z0-9]{8,15}$/
    if(valor === ""){
        clearError(nifFacturaInput)
    }
    else if(!regexNif.test(valor)){
        showError(nifFacturaInput, "El NIF/NIE debe tener entre 8 y 15 caracteres alfanuméricos")
    }
    else{
        clearError(nifFacturaInput)
    }
}
function handleValidarDireccionFactura(event){
    const valor = direccionFacturaInput.value.trim()
    if(valor === ""){
        clearError(direccionFacturaInput)
    }
    else if(valor.length < 5){
        showError(direccionFacturaInput, "La dirección de facturación debe tener al menos 5 caracteres")
    }
    else{
        clearError(direccionFacturaInput)
    }
}
function handleValidarIBAN(event){
    const valor = ibanInput.value.trim()
    const regexIBAN = /^[0-9]{4}$/
    if(valor === ""){
        showError(ibanInput, "El IBAN es obligatorio")
    }
    else if(!regexIBAN.test(valor)){
        showError(ibanInput, "Escribe solo los 4 últimos dígitos del IBAN")
    }
    else{
        clearError(ibanInput)
    }
}

// ---------- 6) Consentimientos ----------

function handleValidarTos(event){
    if(!tosInput.checked){
        showError(tosLabel, "Debes aceptar los términos y condiciones")
    }
    else{
        clearError(tosLabel)
    }
}
function handleValidarRgpd(event){
    if(!rgpdInput.checked){
        showError(rgpdLabel, "Debes autorizar el tratamiento de tus datos")
    }
    else{
        clearError(rgpdLabel)
    }
}

// ---------- Helpers: mostrar y quitar el error ----------

// Marca el campo como inválido y pone el mensaje debajo.
// Si ya tenía un error, no crea otro: solo le cambia el texto.
function showError(input, message){
    if(input.getAttribute("aria-invalid") !== "true"){
        input.setAttribute("aria-invalid", "true")
        input.removeAttribute("data-valid")
        const error = document.createElement("p")
        error.classList.add("error-msg")
        error.innerText = message
        input.parentElement.appendChild(error)
    }
    else{
        const error = input.parentElement.querySelector(".error-msg")
        error.innerText = message
    }
}
// Marca el campo como válido y, si tenía un error, lo borra
function clearError(input){
    input.setAttribute("data-valid", "true")
    if(input.getAttribute("aria-invalid") === "true"){
        input.setAttribute("aria-invalid", "false")
        const error = input.parentElement.querySelector(".error-msg")
        error.remove()
    }
}
