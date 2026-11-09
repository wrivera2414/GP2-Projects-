// Datos de respaldo para abrir el juego con doble clic (file://).
// Por HTTP, el juego intenta primero leer los 5 archivos JSON con AJAX.
var DATOS_LOCALES = {
  "data": {
    "id": "caso-1",
    "caso": "El robo en el museo",
    "introduccion": "La Esmeralda del Valle desapareció durante la gala del museo. La vitrina está rota, pero alguien pudo usar una tarjeta de acceso. Investigá antes de acusar.",
    "escena": "La vitrina fue golpeada desde afuera. El registro de accesos indica una entrada nocturna y la cámara del pasillo dejó de grabar durante siete minutos.",
    "culpable": "director",
    "pistas_necesarias": [
      "vidrio",
      "tarjeta",
      "grabacion"
    ]
  },
  "sospechosos": [
    {
      "id": "director",
      "nombre": "El director",
      "descripcion": "Administra la colección y tiene deudas.",
      "imagen": "img/director.png.jpeg",
      "inicio": "Yo estaba preparando el informe anual. No sé quién entró a la sala."
    },
    {
      "id": "estudiante",
      "nombre": "El estudiante",
      "descripcion": "Becario con acceso al archivo.",
      "imagen": "img/estudiante.png.jpeg",
      "inicio": "Salí antes del cierre, aunque vi a alguien discutir con el guardia."
    },
    {
      "id": "guardia",
      "nombre": "El guardia",
      "descripcion": "Responsable de la ronda nocturna.",
      "imagen": "img/guardia.png.jpeg",
      "inicio": "Hice mi ronda habitual, pero la cámara falló unos minutos."
    }
  ],
  "pistas": [
    {
      "id": "vidrio",
      "nombre": "Vidrio roto",
      "descripcion": "Los fragmentos cayeron dentro de la vitrina: parece un golpe desde afuera.",
      "imagen": "img/vidrio.png.jpeg",
      "fuente": "escena"
    },
    {
      "id": "tarjeta",
      "nombre": "Tarjeta de acceso",
      "descripcion": "El registro señala que se utilizó una tarjeta de administración después del cierre.",
      "imagen": "img/tarjeta.png.jpeg",
      "fuente": "guardia"
    },
    {
      "id": "grabacion",
      "nombre": "Grabación borrada",
      "descripcion": "Una copia de respaldo muestra al director entrando al corredor durante la falla.",
      "imagen": "img/grabacion.png.jpeg",
      "fuente": "estudiante"
    }
  ],
  "dialogos": {
    "director": [
      {
        "id": "horario",
        "pregunta": "¿Dónde estaba al cerrar el museo?",
        "respuesta": "En mi oficina revisando documentos. Nadie puede confirmar la hora exacta."
      },
      {
        "id": "deudas",
        "pregunta": "¿Es cierto que tiene deudas?",
        "respuesta": "Tengo problemas económicos, pero jamás dañaría el museo."
      },
      {
        "id": "tarjeta",
        "pregunta": "¿Quién usa las tarjetas administrativas?",
        "respuesta": "El guardia las custodia, aunque yo también tengo acceso autorizado."
      }
    ],
    "estudiante": [
      {
        "id": "salida",
        "pregunta": "¿A qué hora se fue?",
        "respuesta": "Poco antes del cierre. Guardé mis cosas en el archivo."
      },
      {
        "id": "discusion",
        "pregunta": "¿Qué discusión escuchó?",
        "respuesta": "El director exigió que desactivaran una alarma para revisar una vitrina."
      },
      {
        "id": "copia",
        "pregunta": "¿Hay copia de la grabación?",
        "respuesta": "Sí. Guardé una copia automática del pasillo antes de irme. Se ve al director durante el apagón.",
        "pista": "grabacion"
      }
    ],
    "guardia": [
      {
        "id": "ronda",
        "pregunta": "¿Qué ocurrió durante la ronda?",
        "respuesta": "Se apagó la cámara del corredor, así que revisé la puerta principal."
      },
      {
        "id": "registro",
        "pregunta": "¿Qué indica el registro de tarjetas?",
        "respuesta": "La tarjeta administrativa se usó después del cierre. Aquí tiene una impresión del registro.",
        "pista": "tarjeta"
      },
      {
        "id": "alarmas",
        "pregunta": "¿Quién pidió desactivar la alarma?",
        "respuesta": "El director solicitó una revisión especial. Debí dejarlo por escrito."
      }
    ]
  },
  "finales": {
    "correcto": {
      "titulo": "Caso resuelto",
      "texto": "Reuniste las tres pruebas y acusaste al director. El acceso, la grabación y la vitrina corroboran que organizó el robo. La Esmeralda del Valle fue recuperada."
    },
    "insuficiente": {
      "titulo": "Investigación incompleta",
      "texto": "Tu sospecha puede ser acertada, pero presentaste la acusación sin reunir las tres pruebas esenciales. El caso queda abierto por falta de evidencia."
    },
    "incorrecto": {
      "titulo": "Acusación equivocada",
      "texto": "Acusaste a una persona inocente. Las pruebas disponibles no respaldan tu decisión y el verdadero responsable evita ser detenido."
    }
  }
};
