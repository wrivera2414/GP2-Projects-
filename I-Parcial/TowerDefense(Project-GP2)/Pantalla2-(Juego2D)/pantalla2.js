// ============================================
// PANTALLA 2 - TOWER DEFENSE
// ============================================

const canvas = document.getElementById("lienzo");
const ctx = canvas ? canvas.getContext("2d") : null;

if (!canvas || !ctx) {
  throw new Error("No se encontró el canvas #lienzo. Revisa pantalla2.html.");
}

// ============================================
// CONFIGURACIÓN DE BALANCE
// Todo lo que afecta la dificultad vive en este bloque.
// Si quieres ajustar el juego, toca SOLO estos números.
// ============================================

const tamano = 40;
const INTERVALO_DISPARO = 700;

// --- Torres ---
const COSTO_TORRE = 35; // Precio de la primera torre
const COSTO_EXTRA_POR_TORRE = 4; // Cada torre en pie encarece la siguiente (evita el efecto bola de nieve)

// --- Enemigos y oleadas ---
const VIDA_BASE_ENEMIGO = 70;
const CRECIMIENTO_VIDA = 0.65; // +65% de vida base por cada oleada (crecimiento lineal, no exponencial)
const ENEMIGOS_BASE = 12; // Enemigos de la oleada 1 (antes del multiplicador de dificultad)
const ENEMIGOS_EXTRA_POR_OLEADA = 5;
const VELOCIDAD_BASE = 30;
const VELOCIDAD_EXTRA_POR_OLEADA = 3;
const INTERVALO_APARICION = 900; // ms entre enemigos en la oleada 1
const REDUCCION_INTERVALO_POR_OLEADA = 40; // Cada oleada los enemigos salen más seguidos
const INTERVALO_APARICION_MINIMO = 500;

// --- Dificultad elegida en la pantalla 1 ---
// mulVida / mulCantidad: escalan la vida y la cantidad de enemigos.
// atacanTorres: en Difícil los enemigos se detienen a destruir torres cercanas.
// mulPuntos: premia jugar en dificultades altas para que el ranking sea justo.
// (Difícil tiene multiplicadores menores que Medio a propósito: ya suma el ataque a torres.)
const CONFIG_DIFICULTAD = {
  facil: {
    vidas: 8,
    monedas: 160,
    recompensa: 10,
    mulVida: 1.0,
    mulCantidad: 1.0,
    atacanTorres: false,
    mulPuntos: 1,
  },
  medio: {
    vidas: 6,
    monedas: 140,
    recompensa: 10,
    mulVida: 1.3,
    mulCantidad: 1.3,
    atacanTorres: false,
    mulPuntos: 1.5,
  },
  dificil: {
    vidas: 7,
    monedas: 140,
    recompensa: 10,
    mulVida: 1.0,
    mulCantidad: 1.0,
    atacanTorres: true,
    mulPuntos: 2,
  },
};

// --- Tipos de enemigo ---
// vida / velocidad / recompensa son multiplicadores sobre el enemigo normal.
// dano: cuántas vidas te quita si llega a la base.
const TIPOS_ENEMIGO = {
  normal: {
    vida: 1,
    velocidad: 1,
    recompensa: 1,
    dano: 1,
    puntos: 100,
    radio: 12,
    color: "#c8504b",
    emoji: "👾",
  },
  rapido: {
    vida: 0.55,
    velocidad: 1.7,
    recompensa: 1.3,
    dano: 1,
    puntos: 150,
    radio: 10,
    color: "#e9a23b",
    emoji: "⚡",
  },
  tanque: {
    vida: 3,
    velocidad: 0.7,
    recompensa: 3,
    dano: 2,
    puntos: 300,
    radio: 16,
    color: "#6a4c93",
    emoji: "🛡️",
  },
  jefe: {
    vida: 10,
    velocidad: 0.55,
    recompensa: 15,
    dano: 3,
    puntos: 1000,
    radio: 20,
    color: "#8b0000",
    emoji: "👹",
  },
};

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

// ============================================
// DATOS DEL JUGADOR Y DIFICULTAD
// (se leen antes del estado del juego porque la dificultad define vidas y monedas)
// ============================================

const parametros = new URLSearchParams(window.location.search);
let datosJugador = null;

try {
  datosJugador = JSON.parse(localStorage.getItem("jugador") || "null");
} catch (error) {
  console.error("No se pudieron leer los datos del jugador:", error);
}

// Configura TOTAL_OLEADAS según el nivel elegido (entre 3 y 6, por defecto 3)
const nivelElegido =
  datosJugador && datosJugador.nivel ? parseInt(datosJugador.nivel, 10) : 3;
const TOTAL_OLEADAS = Number.isNaN(nivelElegido) ? 3 : nivelElegido;

// Dificultad elegida (por defecto "medio" si no existe o no es válida)
const dificultadSeleccionada =
  datosJugador && CONFIG_DIFICULTAD[datosJugador.dificultad]
    ? datosJugador.dificultad
    : "medio";
const configDificultad = CONFIG_DIFICULTAD[dificultadSeleccionada];

// ============================================
// ESTADO DEL JUEGO
// ============================================

let torres = [];
let enemigos = [];
let disparos = [];

let vidas = configDificultad.vidas;
let monedas = configDificultad.monedas;
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

let inicioPartida = null;

let intervaloCronometro = null;

function actualizarCronometro() {
  const elemento = document.getElementById("cronometro");
  if (!elemento || inicioPartida === null) return;

  const total = Math.floor((Date.now() - inicioPartida) / 1000);
  const minutos = String(Math.floor(total / 60)).padStart(2, "0");
  const segundos = String(total % 60).padStart(2, "0");

  elemento.textContent = `⏱️ Tiempo: ${minutos}:${segundos}`;
}

function iniciarCronometro() {
  if (inicioPartida !== null) return;

  inicioPartida = Date.now();
  actualizarCronometro();

  intervaloCronometro = setInterval(actualizarCronometro, 1000);
}

function detenerCronometro() {
  actualizarCronometro();

  if (intervaloCronometro !== null) {
    clearInterval(intervaloCronometro);
    intervaloCronometro = null;
  }
}

// ============================================
// PERSONAJE EN PANTALLA
// ============================================

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
    "Dificultad: " + nombresDificultad[dificultadSeleccionada];
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

// Cada torre en pie encarece la siguiente
function costoSiguienteTorre() {
  return COSTO_TORRE + COSTO_EXTRA_POR_TORRE * torres.length;
}

function actualizarMarcador() {
  document.getElementById("vidas").textContent = vidas;
  document.getElementById("monedas").textContent = monedas;
  document.getElementById("puntos").textContent = puntos;
  document.getElementById("oleada").textContent =
    oleada + " / " + TOTAL_OLEADAS;

  // Opcional: si agregas <span id="costoTorre"></span> en el HTML, se rellena solo
  const elementoCosto = document.getElementById("costoTorre");
  if (elementoCosto) {
    elementoCosto.textContent = costoSiguienteTorre();
  }

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

  vidas = configDificultad.vidas;
  monedas = configDificultad.monedas;
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

  // Detener el cronómetro anterior para no acumular intervalos duplicados
  if (intervaloCronometro !== null) {
    clearInterval(intervaloCronometro);
    intervaloCronometro = null;
  }
  inicioPartida = null;

  const elementoCronometro = document.getElementById("cronometro");
  if (elementoCronometro) {
    elementoCronometro.textContent = "⏱️ Tiempo: 00:00";
  }

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

  // Cada torre en pie encarece la siguiente
  const costo = costoSiguienteTorre();

  if (monedas < costo) {
    mensaje("Necesitas " + costo + " monedas para comprar otra torre.");
    return;
  }

  torres.push({
    columna: columna,
    fila: fila,
    alcance: 110,
    dano: 20,
    espera: 0,
    vida: 120,
    vidaMax: 120,
  });

  monedas -= costo;
  mensaje(
    "¡Torre construida! La siguiente cuesta " + costoSiguienteTorre() + ".",
  );
  actualizarMarcador();
  dibujar();
});

// ============================================
// INICIAR OLEADA
// ============================================

function iniciarOleada() {
  if (jugando || terminado || oleada >= TOTAL_OLEADAS) return;

  iniciarCronometro();

  oleada++;

  // Cantidad de enemigos: crece por oleada y se escala según la dificultad.
  // En la oleada final se suma 1 enemigo extra: el jefe.
  const esOleadaFinal = oleada === TOTAL_OLEADAS;
  totalEnemigos =
    Math.round(
      (ENEMIGOS_BASE + (oleada - 1) * ENEMIGOS_EXTRA_POR_OLEADA) *
        configDificultad.mulCantidad,
    ) + (esOleadaFinal ? 1 : 0);

  generados = 0;
  tiempoAparicion = 0;
  jugando = true;
  pausado = false;

  mensaje(
    esOleadaFinal
      ? "⚠️ ¡Oleada final (" +
          oleada +
          " de " +
          TOTAL_OLEADAS +
          ")! Se acerca un jefe."
      : "¡Oleada " + oleada + " de " + TOTAL_OLEADAS + " en marcha!",
  );
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

// Decide qué tipo de enemigo sale:
// - El último de la oleada final es el jefe.
// - Los rápidos aparecen desde la oleada 2 y los tanques desde la 3.
function elegirTipoEnemigo(esUltimoDeLaOleada) {
  if (oleada === TOTAL_OLEADAS && esUltimoDeLaOleada) return "jefe";

  const azar = Math.random();

  if (oleada >= 3 && azar < 0.1 + 0.02 * oleada) return "tanque";
  if (oleada >= 2 && azar < 0.35) return "rapido";
  return "normal";
}

//Camino por el que iran los enemigos, se elige aleatoriamente entre camino1 y camino2
function crearEnemigo(nombreTipo) {
  const tipo = TIPOS_ENEMIGO[nombreTipo];
  const caminoAsignado = Math.random() < 0.5 ? camino1 : camino2;
  const inicio = posicion(caminoAsignado[0]);

  // Vida: crece de forma lineal por oleada, según dificultad y según el tipo
  const vidaCalculada = Math.floor(
    VIDA_BASE_ENEMIGO *
      (1 + CRECIMIENTO_VIDA * (oleada - 1)) *
      configDificultad.mulVida *
      tipo.vida,
  );

  const velocidadCalculada =
    (VELOCIDAD_BASE + (oleada - 1) * VELOCIDAD_EXTRA_POR_OLEADA) *
    tipo.velocidad;

  enemigos.push({
    x: inicio.x,
    y: inicio.y,
    paso: 1,
    camino: caminoAsignado,
    tipo: tipo,
    vida: vidaCalculada,
    vidaMax: vidaCalculada,
    velocidad: velocidadCalculada,
    recompensa: Math.round(configDificultad.recompensa * tipo.recompensa),
    escapo: false,
    muerto: false,
    // Propiedades de combate contra torres (Solo activas en Difícil)
    puedeAtacarTorres: configDificultad.atacanTorres,
    rangoAtaque: 40, // Distancia a la que se detiene para golpear la torre
    danoTorre: 10, // Cuánta vida le baja a la torre por golpe
    esperaAtaque: 0, // Cooldown entre ataques
    atacandoTorre: null, // Referencia a la torre que está golpeando
  });
}

// ============================================
// FINALIZAR PARTIDA
// ============================================
function finalizar(gano) {
  detenerCronometro();
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
    duracionSegundos:
      inicioPartida === null
        ? 0
        : Math.floor((Date.now() - inicioPartida) / 1000),
    gano: gano,
    dificultad: dificultadSeleccionada,
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

  // Los enemigos salen cada vez más seguidos a medida que avanzan las oleadas
  const intervaloActual = Math.max(
    INTERVALO_APARICION_MINIMO,
    INTERVALO_APARICION - REDUCCION_INTERVALO_POR_OLEADA * (oleada - 1),
  );

  // Generar enemigos a intervalos de tiempo
  if (generados < totalEnemigos && tiempoAparicion >= intervaloActual) {
    const esUltimo = generados === totalEnemigos - 1;
    const tipoElegido = elegirTipoEnemigo(esUltimo);

    crearEnemigo(tipoElegido);

    if (tipoElegido === "jefe") {
      mensaje("👹 ¡El jefe ha entrado al camino!");
    }

    generados++;
    tiempoAparicion = 0;
  }

  // Mover enemigos o hacer que ataquen torres
  enemigos.forEach(function (enemigo) {
    if (enemigo.escapo || enemigo.muerto) return;

    // SI ESTÁ EN DIFÍCIL Y PUEDE ATACAR TORRES: Buscar torre cercana
    if (enemigo.puedeAtacarTorres) {
      // Buscar si hay alguna torre dentro de su rango de ataque
      const torreCercana = torres.find(function (torre) {
        const tx = torre.columna * tamano + 20;
        const ty = torre.fila * tamano + 20;
        return (
          Math.hypot(enemigo.x - tx, enemigo.y - ty) <= enemigo.rangoAtaque
        );
      });

      if (torreCercana) {
        // El enemigo se detiene a atacar la torre
        enemigo.esperaAtaque -= delta;
        if (enemigo.esperaAtaque <= 0) {
          torreCercana.vida -= enemigo.danoTorre;
          enemigo.esperaAtaque = 1000; // Ataca una vez por segundo (1000ms)
        }
        return; // Detiene el movimiento mientras ataca
      }
    }

    // Movimiento normal por el camino si no hay torre cerca
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
        vidas -= enemigo.tipo.dano; // Los tanques y el jefe quitan más de 1 vida
      }
    } else if (distancia > 0) {
      enemigo.x += (dx / distancia) * avance;
      enemigo.y += (dy / distancia) * avance;
    }
  });

  // Eliminar torres cuya vida llegue a 0
  torres = torres.filter(function (torre) {
    return torre.vida > 0;
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
      monedas += objetivo.recompensa;
      puntos += Math.round(objetivo.tipo.puntos * configDificultad.mulPuntos);
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
    ctx.fillStyle = "#c9155d";
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

    // Barra de vida de la torre (solo se muestra si ha recibido daño)
    if (torre.vida < torre.vidaMax) {
      const proporcionTorre = Math.max(0, torre.vida / torre.vidaMax);
      ctx.fillStyle = "#333";
      ctx.fillRect(x - 13, y + 15, 26, 4);
      ctx.fillStyle = proporcionTorre > 0.5 ? "#3cb043" : "#d64545";
      ctx.fillRect(x - 13, y + 15, 26 * proporcionTorre, 4);
    }
  });

  // Enemigos
  enemigos.forEach(function (enemigo) {
    if (enemigo.muerto || enemigo.escapo) return;

    const tipo = enemigo.tipo;

    ctx.fillStyle = tipo.color;
    ctx.beginPath();
    ctx.arc(enemigo.x, enemigo.y, tipo.radio, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "white";
    ctx.font = Math.round(tipo.radio * 1.1) + "px Arial";
    ctx.textAlign = "center";
    ctx.fillText(
      tipo.emoji,
      enemigo.x,
      enemigo.y + Math.round(tipo.radio * 0.4),
    );
    ctx.textAlign = "start";

    // Barra de vida del enemigo
    const anchoBarra = tipo.radio * 2;
    const proporcion = Math.max(0, enemigo.vida / enemigo.vidaMax);
    const xBarra = enemigo.x - anchoBarra / 2;
    const yBarra = enemigo.y - tipo.radio - 8;

    ctx.fillStyle = "#333";
    ctx.fillRect(xBarra, yBarra, anchoBarra, 4);
    ctx.fillStyle =
      proporcion > 0.5 ? "#3cb043" : proporcion > 0.25 ? "#e9a23b" : "#d64545";
    ctx.fillRect(xBarra, yBarra, anchoBarra * proporcion, 4);
  });

  // Líneas de disparo (ahora usan el color del personaje elegido)
  disparos.forEach(function (disparo) {
    ctx.strokeStyle = disparo.color;
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
