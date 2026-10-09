// Pantalla 3 - Resultados de Tower Defense

document.addEventListener('DOMContentLoaded', function () {

    // Leer los resultados guardados por la pantalla 2
    const datosGuardados = localStorage.getItem('resultadoTowerDefense');

    if (datosGuardados) {

        const resultado = JSON.parse(datosGuardados);

        // Mostrar el nombre del jugador
        document.getElementById('nombreJugador').textContent =
            'Jugador: ' + (resultado.jugador || 'Jugador');

        // Mostrar los datos de la partida
        document.getElementById('puntos').textContent =
            resultado.puntos ?? 0;

        document.getElementById('oleada').textContent =
            resultado.oleada ?? 0;

        document.getElementById('enemigosEliminados').textContent =
            resultado.enemigosEliminados ?? 0;

        document.getElementById('monedas').textContent =
            resultado.monedas ?? 0;

        // Mostrar si el jugador ganó o perdió
        document.getElementById('estadoPartida').textContent =
            resultado.gano
                ? '¡Victoria! Defendiste la base.'
                : 'Fin del juego. ¡Inténtalo de nuevo!';

    } else {

        // Mensaje si todavía no hay resultados
        document.getElementById('estadoPartida').textContent =
            'Todavía no hay resultados. Juega una partida primero.';
    }

    // Botón para volver a jugar
    document.getElementById('jugarOtraVez').addEventListener('click', function () {

        window.location.href = '../Pantalla2-(Juego2D)/pantalla2.html';

    });

    // Botón para volver al formulario inicial
    document.getElementById('volverMenu').addEventListener('click', function () {

        window.location.href = '../Pantalla1-(Formulario)/Pantalla1.html';

    });

});