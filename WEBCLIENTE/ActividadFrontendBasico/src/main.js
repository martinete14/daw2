import "./style.css";

const tabla = document.getElementById("tabla-jugadores");
const cuerpoTabla = document.getElementById("cuerpo-tabla");
const cards = document.getElementById("cards");
const mensaje = document.getElementById("mensaje");
const botonLista = document.getElementById("vista-lista");
const botonCards = document.getElementById("vista-cards");
const cargando = document.getElementById("cargando");

// trae los jugadores del json que está en public/data
async function obtenerJugadores() {
  const respuesta = await fetch("/data/data.json");
  const datos = await respuesta.json();
  return datos.jugadores;
}

// una fila de la tabla por cada jugador
function mostrarLista(jugadores) {
  cuerpoTabla.innerHTML = "";
  jugadores.forEach((jugador) => {
    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td>${jugador.id_jugador}</td>
      <td>${jugador.nombre}</td>
      <td>${jugador.apellido}</td>
      <td>${jugador.club}</td>
      <td>${jugador.posicion}</td>
      <td>${jugador.nacionalidad}</td>
    `;
    cuerpoTabla.appendChild(fila);
  });
}

// una card por cada jugador
function mostrarCards(jugadores) {
  cards.innerHTML = "";
  jugadores.forEach((jugador) => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <span class="numero">${jugador.id_jugador}</span>
      <h3>${jugador.nombre} ${jugador.apellido}</h3>
      <p class="club">${jugador.club}</p>
      <p>${jugador.posicion} · ${jugador.nacionalidad}</p>
    `;
    cards.appendChild(card);
  });
}

// muestra la tabla o las cards según el botón que se tocó,
// con la pelota picando un ratito en el medio
function cambiarVista(vista) {
  botonLista.classList.toggle("activa", vista === "lista");
  botonCards.classList.toggle("activa", vista === "cards");
  tabla.hidden = true;
  cards.hidden = true;
  cargando.hidden = false;

  setTimeout(() => {
    cargando.hidden = true;
    tabla.hidden = vista !== "lista";
    cards.hidden = vista !== "cards";
  }, 1200);
}

async function mostrarJugadores() {
  try {
    const jugadores = await obtenerJugadores();
    mostrarLista(jugadores);
    mostrarCards(jugadores);
    mensaje.textContent = jugadores.length + " jugadores cargados";
  } catch (e) {
    mensaje.textContent = "No se pudieron cargar los jugadores.";
    mensaje.className = "error";
  }
}

botonLista.addEventListener("click", () => cambiarVista("lista"));
botonCards.addEventListener("click", () => cambiarVista("cards"));

mostrarJugadores();
