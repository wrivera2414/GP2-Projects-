// DETECTIVE DIGITAL - Caso 001 (laboratorio) y Caso 002 (escuela)
// Este archivo maneja la elección del caso, las pantallas, preguntas, pistas y finales.
$(document).ready(function () {
    var casos, infoCaso, caso, sospechosos, pistas, dialogos, finales;
    var encontradas = [];

    // Mostrar una pantalla y ocultar las demás.
    function mostrar(pantalla) {
        $('.pantalla').addClass('oculta');
        $('#' + pantalla).removeClass('oculta');
    }

    // Cada caso guarda sus pistas con su propia clave.
    function leerGuardado() {
        try {
            return JSON.parse(localStorage.getItem(infoCaso.clave) || '[]');
        } catch (e) {
            return [];
        }
    }

    // Guardar las pistas del jugador.
    function guardar() {
        localStorage.setItem(infoCaso.clave, JSON.stringify(encontradas));
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

    // Poner los datos del caso elegido en el juego, sin importar cómo se cargaron.
    function prepararJuego(datos) {
        caso = datos.data;
        sospechosos = datos.sospechosos;
        pistas = datos.pistas;
        dialogos = datos.dialogos;
        finales = datos.finales;

        encontradas = leerGuardado().filter(function (id) {
            return pistas.some(function (pista) { return pista.id === id; });
        });

        // El título de la barra superior vuelve siempre a index1.html (elegir caso).
        // El título de la barra superior vuelve a la pantalla principal.
$('.barra h1').attr({ role: 'link', tabindex: '0', title: 'Volver al inicio' })
    .css('cursor', 'pointer')
    .on('click keydown', function (e) {
        if (e.type === 'click' || e.key === 'Enter') window.location.href = '../index0.html';
    });
        $('#menu-etiqueta').text(infoCaso.etiqueta);
        $('#menu-titulo').text(caso.caso);
        $('#intro-texto').text(caso.introduccion);
        $('#menu-imagen').attr('src', infoCaso.imagen);
        $('#escena-titulo').text('Escena del secuestro');
        $('#escena-foto').attr('src', infoCaso.imagen);
        $('#escena-texto').text(caso.escena);
        mostrarSospechosos();
        actualizarPistas();
        mostrar('pantalla-menu');
    }

    // Cargar los 5 JSON del caso elegido.
    function cargarCaso(info) {
        infoCaso = info;
        // Con doble clic, el navegador abre file:// y no permite leer JSON con AJAX.
        // En ese caso, usamos la copia de los datos dentro de datos-locales.js.
        if (window.location.protocol === 'file:') {
            prepararJuego(DATOS_LOCALES[info.id]);
        } else {
            // AJAX real: 5 solicitudes a archivos JSON de la carpeta del caso.
            $.when(
                $.getJSON(info.carpeta + '/data.json'),
                $.getJSON(info.carpeta + '/sospechosos.json'),
                $.getJSON(info.carpeta + '/pistas.json'),
                $.getJSON(info.carpeta + '/dialogos.json'),
                $.getJSON(info.carpeta + '/finales.json')
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
                prepararJuego(DATOS_LOCALES[info.id]);
            });
        }
    }

    // Dibujar las tarjetas para elegir el caso.
    function mostrarCasos(lista) {
        casos = lista;
        $('#lista-casos').empty();
        $.each(casos, function (i, info) {
            var tarjeta = $('<button class="caso-card">');
            tarjeta.append($('<div class="foto">').append($('<img>').attr('src', info.imagen).attr('alt', info.titulo)));
            tarjeta.append($('<span class="sobretitulo">').text(info.etiqueta));
            tarjeta.append($('<h3>').text(info.titulo));
            tarjeta.append($('<p>').text(info.resumen));
            tarjeta.click(function () { cargarCaso(info); });
            $('#lista-casos').append(tarjeta);
        });
        mostrar('pantalla-casos');
    }

    // Primera carga: la lista de casos (AJAX por HTTP, copia local con doble clic).
    if (window.location.protocol === 'file:') {
        mostrarCasos(DATOS_LOCALES.casos);
    } else {
        $.getJSON('aso-3/casos.json').done(mostrarCasos).fail(function () {
            mostrarCasos(DATOS_LOCALES.casos);
        });
    }

    // Botones de navegación (eventos jQuery).
    $('#btn-iniciar').click(function () { mostrar('pantalla-sospechosos'); });
    $('#btn-cambiar-caso').click(function () { mostrar('pantalla-casos'); });
    $('#btn-escena').click(function () { mostrar('pantalla-escena'); });
    $('#btn-libreta').click(function () { mostrar('pantalla-libreta'); });
    $('#btn-acusar').click(function () { mostrar('pantalla-acusacion'); });
    $('#btn-volver-sospechosos, #btn-volver-escena, #btn-cerrar-libreta, #btn-cancelar-acusacion').click(function () { mostrar('pantalla-sospechosos'); });
    $('#btn-reiniciar').click(function () { mostrar('pantalla-menu'); });
    $('#btn-nueva-partida').click(function () {
        if (confirm('¿Empezar una investigación nueva?')) {
            encontradas = [];
            guardar();
            actualizarPistas();
            mostrar('pantalla-menu');
        }
    });
});
