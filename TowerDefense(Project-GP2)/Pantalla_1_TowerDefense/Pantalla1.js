const playerForm = document.getElementById("playerForm");

playerForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const playerName = document.getElementById("playerName").value.trim();
  const character = document.getElementById("character").value;
  const difficulty = document.getElementById("difficulty").value;
  const level = document.getElementById("level").value;

  if (playerName === "") {
    alert("Por favor, escribe tu nombre.");
    return;
  }

  const player = {
    name: playerName,
    character: character,
    difficulty: difficulty,
    level: Number(level),
  };

  console.log("Datos del jugador:");
  console.log(player);

  alert(`¡Bienvenido ${player.name}!`);
});
