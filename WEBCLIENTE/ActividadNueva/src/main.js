import './style.css'

// Elementos del HTML
const tabla = document.querySelector('#tablaJugadores')
const cuerpoTabla = document.querySelector('#cuerpoTabla')
const contenedorCards = document.querySelector('#contenedorCards')
const btnVista = document.querySelector('#btnVista')
const mensaje = document.querySelector('#mensaje')

// Pide el JSON (está en public/data) y devuelve el array de jugadores
async function obtenerJugadores() {
  const respuesta = await fetch('/data/data.json')

  if (!respuesta.ok) {
    throw new Error(`Error ${respuesta.status} al cargar los datos`)
  }

  const data = await respuesta.json()
  return data.jugadores
}

// Arma las filas de la tabla (vista LISTA)
function pintarLista(jugadores) {
  cuerpoTabla.innerHTML = jugadores.map(jugador => `
    <tr>
      <td>${jugador.id_jugador}</td>
      <td>${jugador.nombre}</td>
      <td>${jugador.apellido}</td>
      <td>${jugador.club}</td>
      <td>${jugador.posicion}</td>
      <td>${jugador.nacionalidad}</td>
    </tr>
  `).join('')
}

// Arma una card por jugador (vista CARDS)
function pintarCards(jugadores) {
  contenedorCards.innerHTML = jugadores.map(jugador => `
    <article class="card">
      <span class="card-numero">${jugador.id_jugador}</span>
      <h2>${jugador.nombre} ${jugador.apellido}</h2>
      <p class="card-club">${jugador.club}</p>
      <p>${jugador.posicion} · ${jugador.nacionalidad}</p>
    </article>
  `).join('')
}

// Carga los jugadores y pinta las dos vistas
async function mostrarJugadores() {
  try {
    const jugadores = await obtenerJugadores()

    pintarLista(jugadores)
    pintarCards(jugadores)

    mensaje.textContent = `${jugadores.length} jugadores cargados`
  } catch (error) {
    mensaje.textContent = error.message
    mensaje.classList.add('error')
    console.error(error)
  }
}

// El switch alterna entre la tabla y las cards
btnVista.addEventListener('click', () => {
  const enCards = btnVista.classList.toggle('activo')
  tabla.hidden = enCards
  contenedorCards.hidden = !enCards
})

mostrarJugadores()
