// CASO 1 - El robo en el museo
// Este archivo maneja las pantallas, preguntas, pistas y finales.
$(document).ready(function () {
    var caso, sospechosos, pistas, dialogos, finales;
    var encontradas = JSON.parse(localStorage.getItem('pistasMuseo') || '[]');

    // Mostrar una pantalla y ocultar las demás.
    function mostrar(pantalla) {
        $('.pantalla').addClass('oculta');
        $('#' + pantalla).removeClass('oculta');
    }

    // Guardar las pistas del jugador.
    function guardar() {
        localStorage.setItem('pistasMuseo', JSON.stringify(encontradas));
    }

    // Agregar una pista, sin repetirla.
    function agregarPista(id) {
        if (encontradas.includes(id)) {
            alert('Ya encontraste esa pista.');
            return;
        }
        encontradas.push(id);
        guardar();
        actualizarPistas();
        alert('¡Encontraste una pista!');
    }

    // Mostrar el avance y el inventario.
    function actualizarPistas() {
        $('#pistas-contador').text(encontradas.length);
        $('#pistas-total').text(pistas.length);
        $('#progreso-barra').css('width', (encontradas.length * 100 / pistas.length) + '%');
        $('#inventario').empty();
        $('#pistas-escena').empty();

        $.each(pistas, function (i, pista) {
            var hallada = encontradas.includes(pista.id);
            var tarjeta = $('<div class="evidencia">');
            if (!hallada) tarjeta.addClass('bloqueada');
            tarjeta.append($('<div class="foto">').append($('<img>').attr('src', pista.imagen).attr('alt', pista.nombre)));
            tarjeta.append($('<h4>').text(pista.nombre));
            tarjeta.append($('<p>').text(hallada ? pista.descripcion : 'Sin hallar'));
            $('#inventario').append(tarjeta);

            if (pista.fuente === 'escena') {
                var boton = $('<button class="secundario">').text(hallada ? '✓ ' + pista.nombre : 'Examinar ' + pista.nombre);
                boton.click(function () { agregarPista(pista.id); });
                $('#pistas-escena').append(boton);
            }
        });
    }

    // Preparar las tarjetas de los sospechosos.
    function mostrarSospechosos() {
        $('#lista-sospechosos').empty();
        $('#lista-acusacion').empty();
        $.each(sospechosos, function (i, persona) {
            var tarjeta = $('<button class="sospechoso">');
            tarjeta.append($('<div class="foto">').append($('<img>').attr('src', persona.imagen).attr('alt', persona.nombre)));
            tarjeta.append($('<h4>').text(persona.nombre));
            tarjeta.append($('<p>').text(persona.descripcion));
            tarjeta.click(function () { interrogar(persona); });
            $('#lista-sospechosos').append(tarjeta);

            var acusar = $('<button class="sospechoso">').text(persona.nombre);
            acusar.click(function () { hacerAcusacion(persona.id); });
            $('#lista-acusacion').append(acusar);
        });
    }

    // Hacer preguntas al personaje elegido.
    function interrogar(persona) {
        $('#interrogado-nombre').text(persona.nombre);
        $('#interrogado-foto').attr('src', persona.imagen).attr('alt', persona.nombre);
        $('#dialogo-texto').text(persona.inicio);
        $('#dialogo-opciones').empty();
        $.each(dialogos[persona.id], function (i, pregunta) {
            var boton = $('<button class="secundario">').text(pregunta.pregunta);
            boton.click(function () {
                $('#dialogo-texto').text(pregunta.respuesta);
                if (pregunta.pista) agregarPista(pregunta.pista);
            });
            $('#dialogo-opciones').append(boton);
        });
        mostrar('pantalla-interrogatorio');
    }

    // Elegir entre los tres finales.
    function hacerAcusacion(personaId) {
        var tipo = 'incorrecto';
        if (personaId === caso.culpable) {
            tipo = 'correcto';
            $.each(caso.pistas_necesarias, function (i, id) {
                if (!encontradas.includes(id)) tipo = 'insuficiente';
            });
        }
        $('#resultado-titulo').text(finales[tipo].titulo);
        $('#resultado-texto').text(finales[tipo].texto);
        mostrar('pantalla-resultado');
    }

    // Poner los datos en el juego, sin importar cómo se cargaron.
    function prepararJuego(datos) {
        caso = datos.data;
        sospechosos = datos.sospechosos;
        pistas = datos.pistas;
        dialogos = datos.dialogos;
        finales = datos.finales;

        encontradas = encontradas.filter(function (id) {
            return pistas.some(function (pista) { return pista.id === id; });
        });
        $('#intro-texto').text(caso.introduccion);
        $('#escena-texto').text(caso.escena);
        mostrarSospechosos();
        actualizarPistas();
        $('#btn-iniciar').prop('disabled', false);
    }

    $('#btn-iniciar').prop('disabled', true);

    // Con doble clic, el navegador abre file:// y no permite leer JSON con AJAX.
    // En ese caso, usamos una copia de los datos dentro de datos-locales.js.
    if (window.location.protocol === 'file:') {
        prepararJuego(DATOS_LOCALES);
    } else {
        // AJAX real: 5 solicitudes a archivos JSON, para cumplir con la clase.
        $.when(
            $.getJSON('aso-1/data.json'),
            $.getJSON('aso-1/sospechosos.json'),
            $.getJSON('aso-1/pistas.json'),
            $.getJSON('aso-1/dialogos.json'),
            $.getJSON('aso-1/finales.json')
        ).done(function (a, b, c, d, e) {
            prepararJuego({
                data: a[0],
                sospechosos: b[0],
                pistas: c[0],
                dialogos: d[0],
                finales: e[0]
            });
        }).fail(function () {
            // Si alguna petición falla, el juego sigue siendo utilizable.
            prepararJuego(DATOS_LOCALES);
        });
    }

    // Botones de navegación (eventos jQuery).
    $('#btn-iniciar').click(function () { mostrar('pantalla-sospechosos'); });
    $('#btn-escena').click(function () { mostrar('pantalla-escena'); });
    $('#btn-libreta').click(function () { mostrar('pantalla-libreta'); });
    $('#btn-acusar').click(function () { mostrar('pantalla-acusacion'); });
    $('#btn-volver-sospechosos, #btn-volver-escena, #btn-cerrar-libreta, #btn-cancelar-acusacion').click(function () { mostrar('pantalla-sospechosos'); });
    $('#btn-reiniciar').click(function () { mostrar('pantalla-menu'); });
    $('#btn-ayuda').click(function () { alert('Interrogá a los personajes, examiná la escena, buscá las 3 pistas y elegí al culpable.'); });
    $('#btn-nueva-partida').click(function () {
        if (confirm('¿Empezar una investigación nueva?')) {
            encontradas = [];
            guardar();
            actualizarPistas();
            mostrar('pantalla-menu');
        }
    });
    $('#btn-menu-principal').click(function () {
            window.location.href = 'index1.html';
            encontradas = [];
            guardar();
            actualizarPistas();
    });   
    $('#btn-inicio').click(function () {
        window.location.href = '../index0.html';
        encontradas = [];
        guardar();
        actualizarPistas();
    });
});
