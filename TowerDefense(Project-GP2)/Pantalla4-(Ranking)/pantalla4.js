document.addEventListener("DOMContentLoaded", function () {
  const tabla = document.getElementById("tablaRanking");
  const btnLimpiar = document.getElementById("btnLimpiarRanking");

  // Leer el ranking guardado en localStorage
  const ranking = JSON.parse(
    localStorage.getItem("rankingTowerDefense") || "[]",
  );

  function renderizarTabla() {
    if (!tabla) return;

    if (ranking.length === 0) {
      tabla.innerHTML = `<tr><td colspan="5">Aún no hay partidas registradas. ¡Sé el primero en jugar!</td></tr>`;
      return;
    }

    tabla.innerHTML = ranking
      .map((partida, index) => {
        let posicion = `${index + 1}º`;
        if (index === 0) posicion = "🥇 1º";
        if (index === 1) posicion = "🥈 2º";
        if (index === 2) posicion = "🥉 3º";

        return `
          <tr>
            <td>${posicion}</td>
            <td><strong>${partida.jugador}</strong></td>
            <td>${partida.personaje}</td>
            <td>${partida.puntos} pts</td>
            <td>${partida.gano ? "🏆 Victoria" : "💔 Derrota"}</td>
          </tr>
        `;
      })
      .join("");
  }

  // Renderizar al cargar la pantalla
  renderizarTabla();

  // Opción para resetear/limpiar las puntuaciones acumuladas
  if (btnLimpiar) {
    btnLimpiar.addEventListener("click", function () {
      if (
        confirm(
          "¿Estás seguro de que deseas borrar todas las puntuaciones registradas?",
        )
      ) {
        localStorage.removeItem("rankingTowerDefense");
        location.reload();
      }
    });
  }
});
