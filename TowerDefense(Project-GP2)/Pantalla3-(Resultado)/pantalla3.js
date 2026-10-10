// Pantalla 3 - Resultados de Tower Defense

document.addEventListener('DOMContentLoaded', function () {

    const datosGuardados = localStorage.getItem('resultadoTowerDefense');

    const nombreJugador = document.getElementById('nombreJugador');
    const avatarJugador = document.getElementById('avatarJugador');
    const duracion = document.getElementById('duracionPartida');
    const estadoPartida = document.getElementById('estadoPartida');

    if (datosGuardados) {
        try {
            // PRIMERO leer los datos; después utilizarlos
            const resultado = JSON.parse(datosGuardados);

            // Nombre del jugador
            nombreJugador.textContent =
                'Jugador: ' + (resultado.jugador || 'Jugador');

            // Icono según el personaje seleccionado
            const iconos = {
                'Caballero': '🛡️',
                'Mago': '🧙',
                'Arquero': '🏹',
                'Sin personaje': '🎮'
            };

            const personaje = resultado.personaje;
            const nombrePersonaje =
                typeof personaje === 'object'
                    ? personaje?.nombre
                    : personaje;

            avatarJugador.textContent =
                resultado.personajeIcono ||
                resultado.avatar ||
                iconos[nombrePersonaje] ||
                '🛡️';

            // Estadísticas
            document.getElementById('puntos').textContent =
                resultado.puntos ?? 0;

            document.getElementById('oleada').textContent =
                resultado.oleada ?? 0;

            document.getElementById('enemigosEliminados').textContent =
                resultado.enemigosEliminados ?? 0;

            document.getElementById('monedas').textContent =
                resultado.monedas ?? 0;

            // Duración en minutos y segundos
            if (duracion) {
                const total = Number(resultado.duracionSegundos);

                if (
                    resultado.duracionSegundos != null &&
                    Number.isFinite(total) &&
                    total >= 0
                ) {
                    const minutos = Math.floor(total / 60);
                    const segundos = Math.floor(total % 60);

                    duracion.textContent =
                        String(minutos).padStart(2, '0') + ':' +
                        String(segundos).padStart(2, '0');
                } else {
                    duracion.textContent = '--:--';
                }
            }

            // Victoria o derrota
            if (resultado.gano) {
                estadoPartida.textContent =
                    '🏆 ¡Victoria! Defendiste la base.';
                estadoPartida.classList.add('victoria');
                estadoPartida.classList.remove('derrota');
            } else {
                estadoPartida.textContent =
                    '💥 Fin del juego. ¡Inténtalo de nuevo!';
                estadoPartida.classList.add('derrota');
                estadoPartida.classList.remove('victoria');
            }

        } catch (error) {
            console.error('Error al cargar los resultados:', error);
            estadoPartida.textContent =
                'Error al leer los resultados guardados.';
        }

    } else {
        nombreJugador.textContent = 'Jugador: sin resultados';
        avatarJugador.textContent = '🛡️';

        if (duracion) {
            duracion.textContent = '--:--';
        }

        estadoPartida.textContent =
            'Todavía no hay resultados. Termina una partida primero.';
    }

    // Botón para volver a jugar
    document.getElementById('jugarOtraVez')
        .addEventListener('click', function () {
            window.location.href =
                '../Pantalla2-(Juego2D)/pantalla2.html';
        });

    // Botón para volver al menú
    document.getElementById('volverMenu')
        .addEventListener('click', function () {
            window.location.href =
                '../Pantalla1-(Formulario)/Pantalla1.html';
        });

});
