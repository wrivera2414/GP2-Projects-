// Pantalla 3 - Resultados de Tower Defense

document.addEventListener('DOMContentLoaded', function () {

    // Leer los resultados guardados por la pantalla 2
    const datosGuardados = localStorage.getItem('resultadoTowerDefense');

    if (datosGuardados) {
        
        // Mostrar icono del personaje
        document.getElementById('avatarJugador').textContent =
        resultado.personajeIcono || resultado.avatar || '🛡️';
        const resultado = JSON.parse(datosGuardados);
        
        // Mostrar duración de la partida
        const duracion = document.getElementById('duracionPartida');

        if (resultado.duracionSegundos != null) {
         const total = Math.floor(Number(resultado.duracionSegundos));
        const minutos = Math.floor(total / 60);
        const segundos = total % 60;

        duracion.textContent =
            String(minutos).padStart(2, '0') + ':' +
            String(segundos).padStart(2, '0');
            } else {
                duracion.textContent = '--:--';
            }
        
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
