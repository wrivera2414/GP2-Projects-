# Caso 1 — El robo en el museo

## Para jugar SIN servidor

1. Descomprimí todo el ZIP, sin mover los archivos de sus carpetas.
2. Abrí `index1.html` con doble clic en Finder.
3. El juego funciona con **jQuery y datos de respaldo** que están en `aso-1/datos-locales.js`.
4. No requiere internet: jQuery se encuentra en `lib/jquery.min.js` (la fuente del título puede cambiar si no hay internet).

## Para demostrar AJAX al ingeniero

AJAX no puede leer normalmente JSON desde `file://` por restricciones del navegador. Por eso, **con doble clic NO se hacen las cinco solicitudes AJAX**: se leen los datos de respaldo, aunque el código AJAX sí está implementado.

Al servir esta misma carpeta por HTTP (`http://localhost:...` mediante Live Server de VS Code o un servidor estático sencillo), `aso-1/app.js` efectúa **cinco solicitudes AJAX reales** usando `$.getJSON()` para leer:

- `aso-1/data.json`
- `aso-1/sospechosos.json`
- `aso-1/pistas.json`
- `aso-1/dialogos.json`
- `aso-1/finales.json`

Verificá las cinco peticiones en las herramientas del navegador: F12 > Network > filtro Fetch/XHR. Esto **sí** cumple la parte técnica cuando se demuestra por HTTP; la modalidad de doble clic es para practicar.

## Archivos fáciles de identificar

- `index1.html`: estructura de las pantallas.
- `aso-1/style.css`: colores y organización visual de Génesis.
- `aso-1/app.js`: acciones de botones, pistas, interrogatorios, acusaciones y carga de datos.
- `aso-1/*.json`: datos usados con AJAX por HTTP.
- `aso-1/datos-locales.js`: copia para abrir sin servidor.

**Si cambiás personajes, pistas o historia:** actualizá tanto los JSON como el contenido equivalente de `datos-locales.js`, para que los dos modos se comporten igual. No necesitás tocar código complicado para cambiar un texto o una respuesta.

## Sobre GitHub

El ZIP está separado del repositorio. No reemplaces `main` ni hagás `Push` sin revisar los cambios con Génesis. Trabajá en una rama propia cuando quieras integrarlo.

## Integrar con GitHub Desktop

1. Cambiar a `main` y hacer Fetch/Pull origin.
2. Crear rama propia desde `main` (por ejemplo `misael-programacion-caso1`).
3. Copiar **el contenido** de esta carpeta dentro de `GP2-Projects-/detective-game/caso-1/`, fusionando las subcarpetas y sustituyendo solo los archivos del Caso 1 que correspondan.
4. Revisar Changes en GitHub Desktop antes de hacer Commit y Push.
5. Solicitar a Génesis que revise la rama antes de integrarla a `main`.
