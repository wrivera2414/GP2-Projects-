$(function () {

  //Selectores
  const $form        = $('#formProducto');
  const $inputNombre = $('#inputNombre');
  const $inputPrecio = $('#inputPrecio');
  const $error       = $('#mensajeError');
  const $lista       = $('#listaProductos');
  const $vacio       = $('#estadoVacio');

  function formatearPrecio(valor) {
    return 'L ' + Number(valor).toLocaleString('es-HN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }

  function mostrarError(mensaje) {
    $error.text(mensaje).prop('hidden', false);
  }

  function ocultarError() {
    $error.prop('hidden', true).text('');
  }

  function crearProducto(nombre, precio) {
    const $item = $('<li class="producto nuevo"></li>')
      .attr('data-precio', precio)  
      .attr('data-estado', 'disponible');

    const $info = $('<div class="info"></div>');
    $info.append($('<span class="nombre"></span>').text(nombre));
    $info.append(
      $('<div class="meta"></div>').append(
        $('<span class="precio"></span>').text(formatearPrecio(precio)),
        $('<span class="etiqueta-estado"></span>').text('Disponible')
      )
    );

    const $acciones = $('<div class="acciones"></div>').append(
      $('<button type="button" class="btn btn-suave btn-estado">Marcar agotado</button>'),
      $('<button type="button" class="btn btn-suave btn-editar">Editar</button>'),
      $('<button type="button" class="btn btn-suave btn-peligro btn-eliminar">Eliminar</button>')
    );

    return $item.append($info, $acciones);
  }

  function actualizarResumen() {
    const $productos    = $lista.children('.producto');
    const $disponibles  = $productos.filter('[data-estado="disponible"]');
    let valorTotal = 0;

    $disponibles.each(function () {
      valorTotal += parseFloat($(this).attr('data-precio'));
    });

    $('#statTotal').text($productos.length);
    $('#statDisponibles').text($disponibles.length);
    $('#statValor').text(formatearPrecio(valorTotal));

    $vacio.prop('hidden', $productos.length > 0);
  }

  $form.on('submit', function (e) {
    e.preventDefault();

    const nombre = $inputNombre.val().trim(); 
    const precio = parseFloat($inputPrecio.val());

    if (nombre === '') {
      mostrarError('Escribe el nombre del producto.');
      $inputNombre.trigger('focus');
      return;
    }
    if (isNaN(precio) || precio <= 0) {
      mostrarError('Ingresa un precio mayor que 0.');
      $inputPrecio.trigger('focus');
      return;
    }

    ocultarError();
    $lista.prepend(crearProducto(nombre, precio));

    $inputNombre.val('');
    $inputPrecio.val('');
    $inputNombre.trigger('focus');
    actualizarResumen();
  });

  $lista.on('click', '.btn-estado', function () {
    const $item = $(this).closest('.producto');
    const nuevoEstado = $item.attr('data-estado') === 'disponible'
      ? 'agotado'
      : 'disponible';

    $item.attr('data-estado', nuevoEstado);

    $item.find('.etiqueta-estado')
      .text(nuevoEstado === 'disponible' ? 'Disponible' : 'Agotado');
    $(this).text(nuevoEstado === 'disponible' ? 'Marcar agotado' : 'Marcar disponible');

    actualizarResumen();
  });

  $lista.on('click', '.btn-editar', function () {
    const $item   = $(this).closest('.producto');
    const $nombre = $item.find('.nombre');

    if ($item.find('.editor-nombre').length) {
      guardarNombre($item);
      return;
    }

    const $editor = $('<input type="text" class="editor-nombre" maxlength="60">')
      .val($nombre.text());

    $nombre.hide().after($editor);
    $editor.trigger('focus').trigger('select');
    $(this).text('Guardar');
  });

  function guardarNombre($item) {
    const $editor = $item.find('.editor-nombre');
    const nuevo   = $editor.val().trim();

    if (nuevo !== '') {
      $item.find('.nombre').text(nuevo);
    }
    $editor.remove();
    $item.find('.nombre').show();
    $item.find('.btn-editar').text('Editar');
  }

  $lista.on('keydown', '.editor-nombre', function (e) {
    const $item = $(this).closest('.producto');
    if (e.key === 'Enter') {
      e.preventDefault();
      guardarNombre($item);
    } else if (e.key === 'Escape') {
      $(this).val($item.find('.nombre').text());
      guardarNombre($item);
    }
  });

  $lista.on('click', '.btn-eliminar', function () {
    $(this).closest('.producto').fadeOut(180, function () {
      $(this).remove();
      actualizarResumen();
    });
  });

  [
    ['Café de altura 500 g', 185],
    ['Miel de abeja 350 ml', 120.5],
    ['Panela artesanal', 45]
  ].reverse().forEach(function (p) {
    $lista.prepend(crearProducto(p[0], p[1]).removeClass('nuevo'));
  });

  $lista.children('.producto').last()
    .attr('data-estado', 'agotado')
    .find('.etiqueta-estado').text('Agotado').end()
    .find('.btn-estado').text('Marcar disponible');

  actualizarResumen();
});