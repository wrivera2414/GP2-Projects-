// ============================================
// PANTALLA 2 - TOWER DEFENSE
// ============================================

const canvas = document.getElementById("lienzo");
const ctx = canvas ? canvas.getContext("2d") : null;

if (!canvas || !ctx) {
  throw new Error("No se encontró el canvas #lienzo. Revisa pantalla2.html.");
}

const tamano = 40;
const VIDA_BASE_ENEMIGO = 50;
const VIDA_EXTRA_POR_OLEADA = 25;
const INTERVALO_DISPARO = 700;
const COSTO_TORRE = 50;

// CAMINO 1 (Superior)
const camino1 = [
  [0, 2],
  [1, 2],
  [2, 2],
  [3, 2],
  [3, 3],
  [3, 4],
  [4, 4],
  [5, 4],
  [6, 4],
  [6, 3],
  [6, 2],
  [7, 2],
  [8, 2],
  [9, 2],
  [9, 3],
  [9, 4],
  [10, 4],
  [11, 4],
  [12, 4],
  [12, 5],
  [12, 6],
  [13, 6],
  [14, 6],
  [15, 6],
  [16, 6],
  [17, 6],
  [18, 6],
  [19, 6],
];

// NUEVO CAMINO 2 (Inferior)
const camino2 = [
  [0, 9],
  [1, 9],
  [2, 9],
  [3, 9],
  [4, 9],
  [5, 9],
  [5, 8],
  [5, 7],
  [6, 7],
  [7, 7],
  [8, 7],
  [9, 7],
  [10, 7],
  [10, 8],
  [10, 9],
  [11, 9],
  [12, 9],
  [13, 9],
  [14, 9],
  [14, 8],
  [14, 7],
  [15, 7],
  [16, 7],
  [17, 7],
  [18, 6],
  [19, 6],
];

let torres = [];
let enemigos = [];
let disparos = [];

let vidas = 10;
let monedas = 150;
let puntos = 0;
let oleada = 0;

let generados = 0;
let totalEnemigos = 0;
let tiempoAparicion = 0;
let jugando = false;
let terminado = false;
let eliminados = 0;
let fotogramaAnterior = 0;
let pausado = false;

// ============================================
// DATOS DEL JUGADOR Y PERSONAJE
// ============================================

const parametros = new URLSearchParams(window.location.search);
let datosJugador = null;

try {
  datosJugador = JSON.parse(localStorage.getItem("jugador") || "null");
} catch (error) {
  console.error("No se pudieron leer los datos del jugador:", error);
}

// Configura TOTAL_OLEADAS según el nivel elegido (entre 3 y 6, por defecto 3)
const TOTAL_OLEADAS =
  datosJugador && datosJugador.nivel ? parseInt(datosJugador.nivel, 10) : 3;

// Multiplicador según dificultad elegida
const multiplicadorDificultad = {
  facil: 0.8,
  medio: 1.0,
  dificil: 1.3,
}[(datosJugador && datosJugador.dificultad) || "medio"];

const nombre =
  parametros.get("jugador") ||
  (datosJugador && datosJugador.nombre) ||
  localStorage.getItem("nombreJugador") ||
  "Invitado";

const personaje = datosJugador && datosJugador.personaje;
const imagenesPersonajes = {
  Caballero: "../Pantalla1-(Formulario)/imagenes/caballero.jpg",
  Mago: "../Pantalla1-(Formulario)/imagenes/mago.jpg",
  Arquero: "../Pantalla1-(Formulario)/imagenes/arquero.jpg",
};

// Obtener la dificultad desde los datos del jugador (por defecto "medio" si no existe)
const dificultadSeleccionada =
  (datosJugador && datosJugador.dificultad) || "medio";

// Diccionario para mostrar el nombre con la primera letra en mayúscula / formato legible
const nombresDificultad = {
  facil: "Fácil",
  medio: "Medio",
  dificil: "Difícil",
};

// Mostrar en el DOM la dificultad seleccionada
const elementoDificultad = document.getElementById("dificultadJugador");
if (elementoDificultad) {
  elementoDificultad.textContent =
    "Dificultad: " + (nombresDificultad[dificultadSeleccionada] || "Medio");
}

// Color De Disparo Según Personaje
// Determinar el color de los disparos según el personaje seleccionado
let colorDisparo = "#1767a5"; // Azul por defecto

if (personaje && personaje.nombre) {
  if (personaje.nombre === "Mago") {
    colorDisparo = "#00bcff"; // Azul
  } else if (personaje.nombre === "Arquero") {
    colorDisparo = "#2ec4b6"; // Verde
  } else if (personaje.nombre === "Caballero") {
    colorDisparo = "#e63946"; // Rojo
  }
}

// Capturabdo elementos del DOM para mostrar el nombre del jugador y el personaje seleccionado
const elementoJugador = document.getElementById("jugador");
if (elementoJugador) {
  elementoJugador.textContent = "Jugador: " + nombre;
}

const imagenPersonaje = document.getElementById("imagenPersonaje");
const nombrePersonaje = document.getElementById("nombrePersonaje");

if (personaje && imagenesPersonajes[personaje.nombre]) {
  if (imagenPersonaje) {
    imagenPersonaje.src = imagenesPersonajes[personaje.nombre];
    imagenPersonaje.alt = personaje.nombre;
    imagenPersonaje.style.display = "block";
  }

  if (nombrePersonaje) {
    nombrePersonaje.textContent = "Personaje: " + personaje.nombre;
  }
} else if (nombrePersonaje) {
  nombrePersonaje.textContent = "Personaje: No seleccionado";
}

// ============================================
// MARCADOR Y MENSAJES
// ============================================

function actualizarMarcador() {
  document.getElementById("vidas").textContent = vidas;
  document.getElementById("monedas").textContent = monedas;
  document.getElementById("puntos").textContent = puntos;
  document.getElementById("oleada").textContent =
    oleada + " / " + TOTAL_OLEADAS;

  document.getElementById("iniciar").disabled =
    jugando || terminado || oleada >= TOTAL_OLEADAS;

  document.getElementById("pausar").disabled = !jugando || terminado;
  document.getElementById("pausar").textContent = pausado
    ? "▶ Continuar"
    : "⏸ Pausar";
}

function mensaje(texto) {
  document.getElementById("mensaje").textContent = texto;
}

// ============================================
// REINICIAR PARTIDA
// ============================================

function reiniciar() {
  torres = [];
  enemigos = [];
  disparos = [];

  vidas = 10;
  monedas = 150;
  puntos = 0;
  oleada = 0;

  generados = 0;
  totalEnemigos = 0;
  tiempoAparicion = 0;
  jugando = false;
  terminado = false;
  pausado = false;
  eliminados = 0;
  fotogramaAnterior = 0;

  mensaje("Coloca torres y presiona «Iniciar oleada».");
  actualizarMarcador();
  dibujar();
}

// ============================================
// CONSTRUIR TORRES
// ============================================

canvas.addEventListener("click", function (evento) {
  if (terminado) return;

  const rect = canvas.getBoundingClientRect();

  const columna = Math.floor(
    ((evento.clientX - rect.left) * canvas.width) / rect.width / tamano,
  );

  const fila = Math.floor(
    ((evento.clientY - rect.top) * canvas.height) / rect.height / tamano,
  );

  const fueraDelTablero =
    columna < 0 || columna >= 20 || fila < 0 || fila >= 12;

  // Validación actualizada para bloquear AMBOS caminos
  const estaEnCamino1 = camino1.some(
    (casilla) => casilla[0] === columna && casilla[1] === fila,
  );
  const estaEnCamino2 = camino2.some(
    (casilla) => casilla[0] === columna && casilla[1] === fila,
  );

  const hayTorre = torres.some(
    (torre) => torre.columna === columna && torre.fila === fila,
  );

  if (fueraDelTablero || estaEnCamino1 || estaEnCamino2 || hayTorre) {
    mensaje("No puedes colocar una torre en ese lugar.");
    return;
  }

  if (monedas < COSTO_TORRE) {
    mensaje("Necesitas 50 monedas para comprar otra torre.");
    return;
  }

  torres.push({
    columna: columna,
    fila: fila,
    alcance: 110,
    dano: 25,
    espera: 0,
  });

  monedas -= COSTO_TORRE;
  mensaje("¡Torre construida!");
  actualizarMarcador();
  dibujar();
});

// ============================================
// INICIAR OLEADA
// ============================================

function iniciarOleada() {
  if (jugando || terminado || oleada >= TOTAL_OLEADAS) return;

  oleada++;

  // Nos aseguramos de tener un multiplicador válido (1 por defecto si no existe)
  const mult =
    typeof multiplicadorDificultad !== "undefined" &&
    !isNaN(multiplicadorDificultad)
      ? multiplicadorDificultad
      : 1;

  // Escala progresiva de cantidad de enemigos según la oleada
  totalEnemigos = Math.floor((10 + (oleada - 1) * 10) * mult);

  generados = 0;
  tiempoAparicion = 0;
  jugando = true;
  pausado = false;

  mensaje("¡Oleada " + oleada + " de " + TOTAL_OLEADAS + " en marcha!");
  actualizarMarcador();
}

// ============================================
// CREAR Y MOVER ENEMIGOS
// ============================================

function posicion(casilla) {
  return {
    x: casilla[0] * tamano + 20,
    y: casilla[1] * tamano + 20,
  };
}

function crearEnemigo() {
  // Alterna caminos entre enemigos pares e impares
  const caminoAsignado = Math.random() < 0.5 ? camino1 : camino2;
  const inicio = posicion(caminoAsignado[0]);

  // Escala progresiva dinámica sin importar la cantidad de oleadas
  const vidaCalculada = (50 + oleada * 30) * multiplicadorDificultad;
  const velocidadCalculada = 50 + oleada * 10;

  enemigos.push({
    x: inicio.x,
    y: inicio.y,
    paso: 1,
    camino: caminoAsignado,
    vida: vidaCalculada,
    velocidad: velocidadCalculada,
    escapo: false,
    muerto: false,
  });
}

// ============================================
// FINALIZAR PARTIDA
// ============================================
function finalizar(gano) {
  if (terminado) return;

  terminado = true;
  jugando = false;
  pausado = false;

  // 1. Crear el objeto con la partida actual
  const resultado = {
    jugador: nombre.slice(0, 10), // Limitar a máximo 10 caracteres
    personaje:
      personaje && personaje.nombre
        ? personaje.nombre
        : personaje || "Sin personaje",
    puntos: puntos,
    oleada: oleada,
    enemigosEliminados: eliminados,
    monedas: monedas,
    gano: gano,
    fecha: new Date().toLocaleDateString(),
  };

  // 2. Guardar el resultado individual para la Pantalla 3
  localStorage.setItem("resultadoTowerDefense", JSON.stringify(resultado));

  // 3. Obtener el ranking global guardado (o crear una lista vacía)
  let ranking = [];
  try {
    ranking = JSON.parse(localStorage.getItem("rankingTowerDefense") || "[]");
  } catch (e) {
    ranking = [];
  }

  // 4. Agregar la partida actual al historial
  ranking.push(resultado);

  // 5. Ordenar de mayor a menor punto
  ranking.sort((a, b) => b.puntos - a.puntos);

  // 6. Conservar únicamente el Top 10
  ranking = ranking.slice(0, 10);

  // 7. Guardar el ranking actualizado para la Pantalla 4
  localStorage.setItem("rankingTowerDefense", JSON.stringify(ranking));

  mensaje(
    gano
      ? "🏆 ¡Ganaste! Defendiste la base."
      : "💔 Fin del juego: la base fue destruida.",
  );

  actualizarMarcador();

  setTimeout(function () {
    window.location.href = "../Pantalla3-(Resultado)/pantalla3.html";
  }, 1500);
}

// ============================================
// ACTUALIZAR LÓGICA DEL JUEGO
// ============================================

function actualizar(delta) {
  if (!jugando || pausado || terminado) return;

  tiempoAparicion += delta;

  // Generar enemigos a intervalos de tiempo (cada 1000 ms = 1 segundo)
  if (generados < totalEnemigos && tiempoAparicion >= 1000) {
    crearEnemigo();
    generados++;
    tiempoAparicion = 0;
  }

  // Mover enemigos por su camino correspondiente
  enemigos.forEach(function (enemigo) {
    if (enemigo.escapo || enemigo.muerto) return;

    const destino = posicion(enemigo.camino[enemigo.paso]);
    const dx = destino.x - enemigo.x;
    const dy = destino.y - enemigo.y;
    const distancia = Math.hypot(dx, dy);
    const avance = (enemigo.velocidad * delta) / 1000;

    if (distancia <= avance) {
      enemigo.x = destino.x;
      enemigo.y = destino.y;
      enemigo.paso++;

      if (enemigo.paso >= enemigo.camino.length) {
        enemigo.escapo = true;
        vidas--;
      }
    } else if (distancia > 0) {
      enemigo.x += (dx / distancia) * avance;
      enemigo.y += (dy / distancia) * avance;
    }
  });

  // Las torres atacan a enemigos vivos dentro de su alcance
  torres.forEach(function (torre) {
    torre.espera -= delta;

    if (torre.espera > 0) return;

    const x = torre.columna * tamano + 20;
    const y = torre.fila * tamano + 20;

    const objetivo = enemigos.find(function (enemigo) {
      return (
        !enemigo.escapo &&
        !enemigo.muerto &&
        enemigo.vida > 0 &&
        Math.hypot(enemigo.x - x, enemigo.y - y) < torre.alcance
      );
    });

    if (!objetivo) return;

    objetivo.vida -= torre.dano;

    torre.espera = INTERVALO_DISPARO;

    if (objetivo.vida <= 0) {
      objetivo.muerto = true;
      monedas += 25;
      puntos += 100;
      eliminados++;
    }

    // Registrar disparo con color único según el personaje
    disparos.push({
      x1: x,
      y1: y,
      x2: objetivo.x,
      y2: objetivo.y,
      color: colorDisparo,
      tiempo: 120,
    });
  });

  // Actualizar los efectos de los disparos
  disparos.forEach(function (disparo) {
    disparo.tiempo -= delta;
  });

  disparos = disparos.filter((disparo) => disparo.tiempo > 0);

  // Retirar enemigos muertos o que llegaron a la base
  enemigos = enemigos.filter(
    (enemigo) => !enemigo.escapo && !enemigo.muerto && enemigo.vida > 0,
  );

  actualizarMarcador();

  // Comprobar derrota
  if (vidas <= 0) {
    vidas = 0;
    finalizar(false);
    return;
  }

  // Comprobar si la oleada ha terminado
  if (generados === totalEnemigos && enemigos.length === 0) {
    jugando = false;

    if (oleada >= TOTAL_OLEADAS) {
      finalizar(true);
    } else {
      mensaje(
        "¡Oleada " +
          oleada +
          " de " +
          TOTAL_OLEADAS +
          " superada! Prepara tus defensas para la siguiente.",
      );
    }

    actualizarMarcador();
  }
}

// ============================================
// DIBUJAR TERRENO, TORRES Y ENEMIGOS
// ============================================

function dibujar() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Césped
  ctx.fillStyle = "#9ed39c";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Cuadrícula
  ctx.strokeStyle = "#85bd83";
  ctx.lineWidth = 1;

  for (let x = 0; x <= canvas.width; x += tamano) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }

  for (let y = 0; y <= canvas.height; y += tamano) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }

  // Dibujar Camino 1
  camino1.forEach(function (casilla) {
    ctx.fillStyle = "#e9c779";
    ctx.fillRect(casilla[0] * tamano, casilla[1] * tamano, tamano, tamano);
  });

  // Dibujar Camino 2
  camino2.forEach(function (casilla) {
    ctx.fillStyle = "#e9c779";
    ctx.fillRect(casilla[0] * tamano, casilla[1] * tamano, tamano, tamano);
  });

  // Base
  ctx.font = "27px Arial";
  ctx.fillText("🏰", 752, 258);

  // Torres
  torres.forEach(function (torre) {
    const x = torre.columna * tamano + 20;
    const y = torre.fila * tamano + 20;

    ctx.fillStyle = "#2376bc";
    ctx.fillRect(x - 13, y - 13, 26, 26);

    ctx.fillStyle = "#e7f5ff";
    ctx.fillRect(x - 4, y - 20, 8, 13);
  });

  // Enemigos
  enemigos.forEach(function (enemigo) {
    if (enemigo.muerto || enemigo.escapo) return;

    ctx.fillStyle = "#c8504b";
    ctx.beginPath();
    ctx.arc(enemigo.x, enemigo.y, 12, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "white";
    ctx.font = "13px Arial";
    ctx.textAlign = "center";
    ctx.fillText("👾", enemigo.x, enemigo.y + 5);
    ctx.textAlign = "start";
  });

  // Líneas de disparo
  disparos.forEach(function (disparo) {
    ctx.strokeStyle = "#1767a5";
    ctx.lineWidth = 3;

    ctx.beginPath();
    ctx.moveTo(disparo.x1, disparo.y1);
    ctx.lineTo(disparo.x2, disparo.y2);
    ctx.stroke();
  });

  ctx.lineWidth = 1;
}

// ============================================
// PAUSAR Y REANUDAR
// ============================================

function alternarPausa() {
  if (!jugando || terminado) return;

  pausado = !pausado;

  mensaje(pausado ? "Juego en pausa." : "¡Continúa defendiendo!");

  actualizarMarcador();
}

// ============================================
// BUCLE DE ANIMACIÓN
// ============================================

function animar(tiempo) {
  const delta = fotogramaAnterior
    ? Math.min(tiempo - fotogramaAnterior, 50)
    : 0;

  fotogramaAnterior = tiempo;

  actualizar(delta);
  dibujar();

  requestAnimationFrame(animar);
}

// ============================================
// CONECTAR BOTONES Y ARRANCAR
// ============================================

document.getElementById("iniciar").addEventListener("click", iniciarOleada);
document.getElementById("pausar").addEventListener("click", alternarPausa);
document.getElementById("reiniciar").addEventListener("click", reiniciar);
document.getElementById("volver").addEventListener("click", function () {
  window.location.href = "../Pantalla1-(Formulario)/pantalla1.html";
});

reiniciar();
requestAnimationFrame(animar);
