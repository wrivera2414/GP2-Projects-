
const personajes = [
  {
    id: 1,
    nombre: "Caballero",
    imagen: "imagenes/caballero.jpg"
  },
  {
    id: 2,
    nombre: "Mago",
    imagen: "imagenes/mago.jpg"
  },
  {
    id: 3,
    nombre: "Arquero",
    imagen: "imagenes/arquero.jpg"
  },
];


let elegido = null;
const lista = document.getElementById("listaPersonajes");


lista.innerHTML = personajes
  .map(
    (p) => `
      <div class="col-4">
        <div class="personaje" data-id="${p.id}">
          <img src="${p.imagen}" alt="${p.nombre}" class="imagen-personaje">
          <div>${p.nombre}</div>
        </div>
      </div>
    `,
  )
  .join("");


document.querySelectorAll(".personaje").forEach((t) => {
  t.addEventListener("click", () => {
    document
      .querySelectorAll(".personaje")
      .forEach((x) => x.classList.remove("seleccionado"));
    t.classList.add("seleccionado");
    elegido = personajes.find((p) => p.id == t.dataset.id);
  });
});

document.getElementById("formulario").addEventListener("submit", (e) => {
  e.preventDefault();

  const nombre = document.getElementById("nombre").value.trim();

  if (nombre === "" || elegido === null) {
    alert("Escribe tu nombre y elige un personaje");
    return;
  }

  const jugador = {
    nombre: nombre,
    personaje: elegido
  };

  localStorage.setItem("jugador", JSON.stringify(jugador));

  window.location.href = "../Pantalla2-(Juego2D)/Pantalla2.html";
});