// ============================================
// PANTALLA 2 - TOWER DEFENSE
// ============================================

const canvas = document.getElementById('lienzo');
const ctx = canvas ? canvas.getContext('2d') : null;

if (!canvas || !ctx) {
  throw new Error('No se encontró el canvas #lienzo. Revisa pantalla2.html.');
}

const tamano = 40;
const VIDA_BASE_ENEMIGO = 50;
const VIDA_EXTRA_POR_OLEADA = 25;
const INTERVALO_DISPARO = 700;
const TOTAL_OLEADAS = 3;
const COSTO_TORRE = 50;

const camino = [
  [0, 2], [1, 2], [2, 2], [3, 2], [3, 3], [3, 4],
  [4, 4], [5, 4], [6, 4], [6, 3], [6, 2], [7, 2],
  [8, 2], [9, 2], [9, 3], [9, 4], [10, 4], [11, 4],
  [12, 4], [12, 5], [12, 6], [13, 6], [14, 6],
  [15, 6], [16, 6], [17, 6], [18, 6], [19, 6]
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
  datosJugador = JSON.parse(localStorage.getItem('jugador') || 'null');
} catch (error) {
  console.error('No se pudieron leer los datos del jugador:', error);
}

const nombre = parametros.get('jugador') ||
  (datosJugador && datosJugador.nombre) ||
  localStorage.getItem('nombreJugador') ||
  'Invitado';

const personaje = datosJugador && datosJugador.personaje;
const imagenesPersonajes = {
  Caballero: "../Pantalla1-(Formulario)/imagenes/caballero.jpg",
  Mago: "../Pantalla1-(Formulario)/imagenes/mago.jpg",
  Arquero: "../Pantalla1-(Formulario)/imagenes/arquero.jpg"
};

const elementoJugador = document.getElementById('jugador');
const elementoPersonaje = document.getElementById('personaje');

if (elementoJugador) {
  elementoJugador.textContent = 'Jugador: ' + nombre;
}


const imagenPersonaje = document.getElementById('imagenPersonaje');
const nombrePersonaje = document.getElementById('nombrePersonaje');

if (personaje && imagenesPersonajes[personaje.nombre]) {
  if (imagenPersonaje) {
    imagenPersonaje.src = imagenesPersonajes[personaje.nombre];
    imagenPersonaje.alt = personaje.nombre;
    imagenPersonaje.style.display = 'block';
  }

  if (nombrePersonaje) {
    nombrePersonaje.textContent = 'Personaje: ' + personaje.nombre;
  }
} else if (nombrePersonaje) {
  nombrePersonaje.textContent = 'Personaje: No seleccionado';
}

// ============================================
// MARCADOR Y MENSAJES
// ============================================

function actualizarMarcador() {
  document.getElementById('vidas').textContent = vidas;
  document.getElementById('monedas').textContent = monedas;
  document.getElementById('puntos').textContent = puntos;
  document.getElementById('oleada').textContent = oleada + ' / ' + TOTAL_OLEADAS;

  document.getElementById('iniciar').disabled =
    jugando || terminado || oleada >= TOTAL_OLEADAS;

  document.getElementById('pausar').disabled = !jugando || terminado;
  document.getElementById('pausar').textContent =
    pausado ? '▶ Continuar' : '⏸ Pausar';
}

function mensaje(texto) {
  document.getElementById('mensaje').textContent = texto;
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

  mensaje('Coloca torres y presiona «Iniciar oleada».');
  actualizarMarcador();
  dibujar();
}

// ============================================
// CONSTRUIR TORRES
// ============================================

canvas.addEventListener('click', function(evento) {
  if (terminado) return;

  const rect = canvas.getBoundingClientRect();

  const columna = Math.floor(
    (evento.clientX - rect.left) * canvas.width / rect.width / tamano
  );

  const fila = Math.floor(
    (evento.clientY - rect.top) * canvas.height / rect.height / tamano
  );

  const fueraDelTablero =
    columna < 0 || columna >= 20 || fila < 0 || fila >= 12;

  const estaEnCamino = camino.some(
    casilla => casilla[0] === columna && casilla[1] === fila
  );

  const hayTorre = torres.some(
    torre => torre.columna === columna && torre.fila === fila
  );

  if (fueraDelTablero || estaEnCamino || hayTorre) {
    mensaje('No puedes colocar una torre en ese lugar.');
    return;
  }

  if (monedas < COSTO_TORRE) {
    mensaje('Necesitas 50 monedas para comprar otra torre.');
    return;
  }

  torres.push({
    columna: columna,
    fila: fila,
    alcance: 110,
    dano: 25,
    espera: 0
  });

  monedas -= COSTO_TORRE;
  mensaje('¡Torre construida!');
  actualizarMarcador();
  dibujar();
});

// ============================================
// INICIAR OLEADA
// ============================================

function iniciarOleada() {
  if (jugando || terminado || oleada >= TOTAL_OLEADAS) return;

  oleada++;
  totalEnemigos = [0, 10, 20, 35][oleada];
  generados = 0;
  tiempoAparicion = 0;
  jugando = true;
  pausado = false;

  mensaje('¡Oleada ' + oleada + ' en marcha!');
  actualizarMarcador();
}

// ============================================
// CREAR Y MOVER ENEMIGOS
// ============================================

function posicion(casilla) {
  return {
    x: casilla[0] * tamano + 20,
    y: casilla[1] * tamano + 20
  };
}


function crearEnemigo() {
  const inicio = posicion(camino[0]);

  enemigos.push({
    x: inicio.x,
    y: inicio.y,
    paso: 1,
    vida: [0, 100, 180, 280][oleada],
    velocidad: [0, 65, 90, 115][oleada],
    escapo: false,
    muerto: false
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

  const resultado = {
    jugador: nombre,
    personaje: personaje,
    puntos: puntos,
    oleada: oleada,
    enemigosEliminados: eliminados,
    monedas: monedas,
    gano: gano
  };

  localStorage.setItem(
    'resultadoTowerDefense',
    JSON.stringify(resultado)
  );

  mensaje(
    gano
      ? '🏆 ¡Ganaste! Defendiste la base.'
      : '💔 Fin del juego: la base fue destruida.'
  );

  actualizarMarcador();

  setTimeout(function() {
    window.location.href = '../Pantalla3-(Resultado)/pantalla3.html';
  }, 1500);
}

// ============================================
// ACTUALIZAR LÓGICA DEL JUEGO
// ============================================

function actualizar(delta) {
  if (!jugando || pausado || terminado) return;

  tiempoAparicion += delta;

  if (generados < totalEnemigos && tiempoAparicion >= 500) {
    crearEnemigo();
    generados++;
    tiempoAparicion = 0;
  }

  // Mover enemigos por el camino.
  enemigos.forEach(function(enemigo) {
    if (enemigo.escapo || enemigo.muerto) return;

    const destino = posicion(camino[enemigo.paso]);
    const dx = destino.x - enemigo.x;
    const dy = destino.y - enemigo.y;
    const distancia = Math.hypot(dx, dy);
    const avance = enemigo.velocidad * delta / 1000;

    if (distancia <= avance) {
      enemigo.x = destino.x;
      enemigo.y = destino.y;
      enemigo.paso++;

      if (enemigo.paso >= camino.length) {
        enemigo.escapo = true;
        vidas--;
      }
    } else if (distancia > 0) {
      enemigo.x += (dx / distancia) * avance;
      enemigo.y += (dy / distancia) * avance;
    }
  });

  // Las torres atacan a enemigos vivos dentro de su alcance.
  torres.forEach(function(torre) {
    torre.espera -= delta;

    if (torre.espera > 0) return;

    const x = torre.columna * tamano + 20;
    const y = torre.fila * tamano + 20;

    const objetivo = enemigos.find(function(enemigo) {
      return !enemigo.escapo &&
        !enemigo.muerto &&
        enemigo.vida > 0 &&
        Math.hypot(enemigo.x - x, enemigo.y - y) < torre.alcance;
    });

    if (!objetivo) return;

    objetivo.vida -= torre.dano;

    disparos.push({
      x1: x,
      y1: y,
      x2: objetivo.x,
      y2: objetivo.y,
      tiempo: 120
    });

    torre.espera = INTERVALO_DISPARO;

    if (objetivo.vida <= 0) {
      objetivo.muerto = true;
      monedas += 25;
      puntos += 100;
      eliminados++;
    }
  });

  // Actualizar los efectos de los disparos.
  disparos.forEach(function(disparo) {
    disparo.tiempo -= delta;
  });

  disparos = disparos.filter(disparo => disparo.tiempo > 0);

  // Retirar enemigos muertos o que llegaron a la base.
  enemigos = enemigos.filter(
    enemigo => !enemigo.escapo && !enemigo.muerto && enemigo.vida > 0
  );

  actualizarMarcador();

  if (vidas <= 0) {
    vidas = 0;
    finalizar(false);
    return;
  }

  if (generados === totalEnemigos && enemigos.length === 0) {
    jugando = false;

    if (oleada === TOTAL_OLEADAS) {
      finalizar(true);
    } else {
      mensaje('¡Oleada superada! Construye más torres y comienza la siguiente.');
    }

    actualizarMarcador();
  }
}

// ============================================
// DIBUJAR TERRENO, TORRES Y ENEMIGOS
// ============================================

function dibujar() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Césped.
  ctx.fillStyle = '#9ed39c';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Cuadrícula.
  ctx.strokeStyle = '#85bd83';
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

  // Camino.
  camino.forEach(function(casilla) {
    ctx.fillStyle = '#e9c779';
    ctx.fillRect(
      casilla[0] * tamano,
      casilla[1] * tamano,
      tamano,
      tamano
    );
  });

  // Base.
  ctx.font = '27px Arial';
  ctx.fillText('🏰', 752, 258);

  // Torres.
  torres.forEach(function(torre) {
    const x = torre.columna * tamano + 20;
    const y = torre.fila * tamano + 20;

    ctx.fillStyle = '#2376bc';
    ctx.fillRect(x - 13, y - 13, 26, 26);

    ctx.fillStyle = '#e7f5ff';
    ctx.fillRect(x - 4, y - 20, 8, 13);
  });

  // Enemigos.
  enemigos.forEach(function(enemigo) {
    if (enemigo.muerto || enemigo.escapo) return;

    ctx.fillStyle = '#c8504b';
    ctx.beginPath();
    ctx.arc(enemigo.x, enemigo.y, 12, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = 'white';
    ctx.font = '13px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('👾', enemigo.x, enemigo.y + 5);
    ctx.textAlign = 'start';
  });

  // Líneas de disparo.
  disparos.forEach(function(disparo) {
    ctx.strokeStyle = '#1767a5';
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

  mensaje(
    pausado ? 'Juego en pausa.' : '¡Continúa defendiendo!'
  );

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

document.getElementById('iniciar').addEventListener('click', iniciarOleada);
document.getElementById('pausar').addEventListener('click', alternarPausa);
document.getElementById('reiniciar').addEventListener('click', reiniciar);

reiniciar();
requestAnimationFrame(animar);
