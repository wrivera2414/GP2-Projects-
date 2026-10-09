// Pantalla 2 - Tower Defense. Todo funciona en el navegador.
const canvas = document.getElementById('lienzo');
const ctx = canvas.getContext('2d');
const tamano = 40;

// Camino: cada número representa una columna y una fila de la cuadrícula.
const camino = [
  [0, 2], [1, 2], [2, 2], [3, 2], [3, 3], [3, 4],
  [4, 4], [5, 4], [6, 4], [6, 3], [6, 2], [7, 2],
  [8, 2], [9, 2], [9, 3], [9, 4], [10, 4], [11, 4],
  [12, 4], [12, 5], [12, 6], [13, 6], [14, 6],
  [15, 6], [16, 6], [17, 6], [18, 6], [19, 6]
];

let torres, enemigos, disparos, vidas, monedas, puntos, oleada;
let generados, totalEnemigos, tiempoAparicion, jugando, terminado;
let eliminados, fotogramaAnterior, pausado;

// Lee el nombre que puede enviar la Pantalla 1: ?jugador=Ana
const parametros = new URLSearchParams(window.location.search);
const datosJugador = JSON.parse(localStorage.getItem('jugador') || 'null');
const nombre = parametros.get('jugador') || (datosJugador && datosJugador.nombre) || localStorage.getItem('nombreJugador') || 'Invitado';
document.getElementById('jugador').textContent = 'Jugador: ' + nombre;

function actualizarMarcador() {
  document.getElementById('vidas').textContent = vidas;
  document.getElementById('monedas').textContent = monedas;
  document.getElementById('puntos').textContent = puntos;
  document.getElementById('oleada').textContent = oleada + ' / 3';
  document.getElementById('iniciar').disabled = jugando || terminado || oleada >= 3;
  document.getElementById('pausar').disabled = !jugando || terminado;
  document.getElementById('pausar').textContent = pausado ? '▶ Continuar' : '⏸ Pausar';
}

function mensaje(texto) {
  document.getElementById('mensaje').textContent = texto;
}

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
}

// Permite construir una torre con un clic.
canvas.addEventListener('click', function(evento) {
  if (terminado) return;
  const rect = canvas.getBoundingClientRect();
  const columna = Math.floor((evento.clientX - rect.left) * canvas.width / rect.width / tamano);
  const fila = Math.floor((evento.clientY - rect.top) * canvas.height / rect.height / tamano);
  const estaEnCamino = camino.some(c => c[0] === columna && c[1] === fila);
  const hayTorre = torres.find(t => t.columna === columna && t.fila === fila);
  if (columna < 0 || columna >= 20 || fila < 0 || fila >= 12 || estaEnCamino || hayTorre) {
    mensaje('No puedes colocar una torre en ese lugar.');
    return;
  }
  if (monedas < 50) {
    mensaje('Necesitas 50 monedas para comprar otra torre.');
    return;
  }
  torres.push({ columna, fila, alcance: 110, dano: 25, espera: 0 });
  monedas -= 50;
  mensaje('¡Torre construida!');
  actualizarMarcador();
});

function iniciarOleada() {
  if (jugando || terminado || oleada >= 3) return;
  oleada++;
  totalEnemigos = 3 + oleada * 2;
  generados = 0;
  tiempoAparicion = 0;
  jugando = true;
  pausado = false;
  mensaje('¡Oleada ' + oleada + ' en marcha!');
  actualizarMarcador();
}

// Convierte una casilla del camino a la coordenada central en píxeles.
function posicion(casilla) {
  return { x: casilla[0] * tamano + 20, y: casilla[1] * tamano + 20 };
}

function crearEnemigo() {
  const inicio = posicion(camino[0]);
  enemigos.push({ x: inicio.x, y: inicio.y, paso: 1, vida: 50 + oleada * 25, velocidad: 45 + oleada * 8 });
}

function finalizar(gano) {
  terminado = true;
  jugando = false;
  const resultado = {
    jugador: nombre,
    puntos: puntos,
    oleada: oleada,
    enemigosEliminados: eliminados,
    monedas: monedas,
    gano: gano
  };
  // JSON es el formato para compartir los datos con otro archivo.
  // La Pantalla 3 puede leer: JSON.parse(localStorage.getItem('resultadoTowerDefense'))
  localStorage.setItem('resultadoTowerDefense', JSON.stringify(resultado));
  mensaje(gano ? '🏆 ¡Ganaste! Defendiste la base.' : '💔 Fin del juego: la base fue destruida.');
  actualizarMarcador();
  
setTimeout(function () {
    window.location.href = '../Pantalla3-(Resultado)/pantalla3.html';
}, 1500);
}

function actualizar(delta) {
  if (!jugando || pausado) return;
  tiempoAparicion += delta;
  if (generados < totalEnemigos && tiempoAparicion >= 1100) {
    crearEnemigo();
    generados++;
    tiempoAparicion = 0;
  }

  // Mover enemigos siguiendo las casillas del camino.
  enemigos.forEach(enemigo => {
    const destino = posicion(camino[enemigo.paso]);
    const dx = destino.x - enemigo.x;
    const dy = destino.y - enemigo.y;
    const distancia = Math.hypot(dx, dy);
    const avance = enemigo.velocidad * delta / 1000;
    if (distancia <= avance) {
      enemigo.x = destino.x;
      enemigo.y = destino.y;
      enemigo.paso++;
      if (enemigo.paso === camino.length) {
        enemigo.escapo = true;
        vidas--;
      }
    } else {
      enemigo.x += dx / distancia * avance;
      enemigo.y += dy / distancia * avance;
    }
  });

  // Las torres buscan al primer enemigo dentro del alcance.
  torres.forEach(torre => {
    torre.espera -= delta;
    if (torre.espera > 0) return;
    const x = torre.columna * tamano + 20;
    const y = torre.fila * tamano + 20;
    const objetivo = enemigos.find(e => !e.escapo && e.vida > 0 && Math.hypot(e.x - x, e.y - y) < torre.alcance);
    if (objetivo) {
      objetivo.vida -= torre.dano;
      disparos.push({ x1: x, y1: y, x2: objetivo.x, y2: objetivo.y, tiempo: 120 });
      torre.espera = 700;
      if (objetivo.vida <= 0) {
        monedas += 25;
        puntos += 100;
        eliminados++;
      }
    }
  });

  disparos.forEach(d => d.tiempo -= delta);
  disparos = disparos.filter(d => d.tiempo > 0);
  enemigos = enemigos.filter(e => !e.escapo && e.vida > 0);
  actualizarMarcador();

  if (vidas <= 0) { vidas = 0; finalizar(false); return; }
  if (generados === totalEnemigos && enemigos.length === 0) {
    jugando = false;
    if (oleada === 3) finalizar(true);
    else mensaje('¡Oleada superada! Construye más torres y comienza la siguiente.');
    actualizarMarcador();
  }
}

function dibujar() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#9ed39c';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = '#85bd83';
  for (let x = 0; x <= canvas.width; x += tamano) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
  }
  for (let y = 0; y <= canvas.height; y += tamano) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
  }
  const cuadrosCamino = camino.map(casilla => ({ x: casilla[0] * tamano, y: casilla[1] * tamano }));
  cuadrosCamino.forEach(cuadro => {
    ctx.fillStyle = '#e9c779';
    ctx.fillRect(cuadro.x, cuadro.y, tamano, tamano);
  });
  ctx.font = '27px Arial';
  ctx.fillText('🏰', 752, 258);

  torres.forEach(t => {
    const x = t.columna * tamano + 20;
    const y = t.fila * tamano + 20;
    ctx.fillStyle = '#2376bc';
    ctx.fillRect(x - 13, y - 13, 26, 26);
    ctx.fillStyle = '#e7f5ff';
    ctx.fillRect(x - 4, y - 20, 8, 13);
  });
  enemigos.forEach(e => {
    ctx.fillStyle = '#c8504b';
    ctx.beginPath(); ctx.arc(e.x, e.y, 12, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = 'white';
    ctx.font = '13px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('👾', e.x, e.y + 5);
    ctx.textAlign = 'start';
  });
  disparos.forEach(d => {
    ctx.strokeStyle = '#1767a5';
    ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(d.x1, d.y1); ctx.lineTo(d.x2, d.y2); ctx.stroke();
    ctx.lineWidth = 1;
  });
}

function alternarPausa() {
  if (!jugando || terminado) return;
  pausado = !pausado;
  mensaje(pausado ? 'Juego en pausa.' : '¡Continúa defendiendo!');
  actualizarMarcador();
}

function animar(tiempo) {
  const delta = fotogramaAnterior ? Math.min(tiempo - fotogramaAnterior, 50) : 0;
  fotogramaAnterior = tiempo;
  actualizar(delta);
  dibujar();
  requestAnimationFrame(animar);
}

document.getElementById('iniciar').addEventListener('click', iniciarOleada);
document.getElementById('pausar').addEventListener('click', alternarPausa);
document.getElementById('reiniciar').addEventListener('click', reiniciar);
reiniciar();
requestAnimationFrame(animar);
