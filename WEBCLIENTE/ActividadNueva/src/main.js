import './style.css'

// Elementos del HTML
const cuerpoTabla = document.querySelector('#cuerpoTabla')
const mensaje = document.querySelector('#mensaje')

// Pide el JSON (está en public/data) y devuelve el array de clientes
async function obtenerClientes() {
  const respuesta = await fetch('/data/data.json')

  if (!respuesta.ok) {
    throw new Error(`Error ${respuesta.status} al cargar los datos`)
  }

  const data = await respuesta.json()
  return data.clientes
}

// Carga los clientes y rellena el tbody de la tabla
async function mostrarClientes() {
  try {
    const clientes = await obtenerClientes()

    cuerpoTabla.innerHTML = clientes.map(cliente => `
      <tr>
        <td>${cliente.id_cliente}</td>
        <td>${cliente.nombre}</td>
        <td>${cliente.apellido}</td>
        <td>${cliente.correo}</td>
        <td>${cliente.telefono}</td>
        <td>${cliente.direccion}</td>
      </tr>
    `).join('')

    mensaje.textContent = `${clientes.length} clientes cargados`
  } catch (error) {
    mensaje.textContent = error.message
    mensaje.classList.add('error')
    console.error(error)
  }
}

mostrarClientes()
