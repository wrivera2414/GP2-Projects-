const personajes = [
  { id: 1, nombre: "Caballero", emoji: "🛡️" },
  { id: 2, nombre: "Mago", emoji: "🧙" },
  { id: 3, nombre: "Arquero", emoji: "🏹" },
];

let elegido = null;
const lista = document.getElementById("listaPersonajes");

lista.innerHTML = personajes
  .map(
    (p) =>
      `<div class="col-4"><div class="personaje" data-id="${p.id}">${p.emoji}<br>${p.nombre}</div></div>`,
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
  window.open("../Pantalla2-(Juego2D)/Pantalla2.html", "blank");
  const nombre = document.getElementById("nombre").value.trim();

  if (nombre === "" || elegido === null) {
    alert("Escribe tu nombre y elige un personaje");
    return;
  }

  const jugador = { nombre: nombre, personaje: elegido };
  localStorage.setItem("jugador", JSON.stringify(jugador));
  // window.location.href = "../Pantalla2-(Juego2D)/Pantalla2.html";
});
