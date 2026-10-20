import "./style.css";

const tabla = document.getElementById("tabla-jugadores");
const cuerpoTabla = document.getElementById("cuerpo-tabla");
const cards = document.getElementById("cards");
const error = document.getElementById("error");
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
      <h3>${jugador.nombre} ${jugador.apellido}</h3>
      <p class="club">${jugador.club}</p>
      <p>${jugador.posicion} · ${jugador.nacionalidad}</p>
    `;
    cards.appendChild(card);
  });
}

// guarda la vista en una cookie por 30 días para que no se pierda al refrescar
function guardarVista(vista) {
  document.cookie = "vista=" + vista + "; max-age=" + 60 * 60 * 24 * 30 + "; path=/";
}

// busca la cookie de la vista, si no hay arranca en lista
function leerVista() {
  const cookies = document.cookie.split("; ");
  const cookieVista = cookies.find((cookie) => cookie.startsWith("vista="));
  if (cookieVista) {
    return cookieVista.split("=")[1];
  }
  return "lista";
}

// muestra la tabla o las cards y marca el botón activo
function mostrarVista(vista) {
  botonLista.classList.toggle("activa", vista === "lista");
  botonCards.classList.toggle("activa", vista === "cards");
  tabla.hidden = vista !== "lista";
  cards.hidden = vista !== "cards";
}

// al tocar un botón: guarda la cookie y la pelota pica un ratito antes de cambiar
function cambiarVista(vista) {
  guardarVista(vista);
  cargando.hidden = false;

  setTimeout(() => {
    cargando.hidden = true;
    mostrarVista(vista);
  }, 1200);
}

async function mostrarJugadores() {
  try {
    const jugadores = await obtenerJugadores();
    mostrarLista(jugadores);
    mostrarCards(jugadores);
  } catch (e) {
    error.hidden = false;
  }
}

botonLista.addEventListener("click", () => cambiarVista("lista"));
botonCards.addEventListener("click", () => cambiarVista("cards"));

// al entrar arranca en la vista que quedó guardada en la cookie
mostrarVista(leerVista());
mostrarJugadores();
