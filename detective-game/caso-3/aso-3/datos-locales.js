// Datos de respaldo para abrir el juego con doble clic (file://).
// Por HTTP, el juego lee casos.json y los 5 JSON de cada caso con AJAX.
var DATOS_LOCALES = {
  "casos": [
    {
      "id": "laboratorio",
      "etiqueta": "Caso 001",
      "corto": "Secuestro en laboratorio",
      "titulo": "El secuestro en el laboratorio",
      "resumen": "Un científico desaparece de una habitación cerrada por dentro.",
      "carpeta": "aso-3",
      "imagen": "escena.jpg",
      "clave": "pistasLaboratorio"
    },
    {
      "id": "escuela",
      "etiqueta": "Caso 002",
      "corto": "Secuestro en la escuela",
      "titulo": "El secuestro en la escuela",
      "resumen": "El hijo de un multimillonario desaparece del colegio y llega una petición de dinero.",
      "carpeta": "aso-4",
      "imagen": "img/escuela/escena.jpg",
      "clave": "pistasEscuela"
    }
  ],
  "laboratorio": {
    "data": {
      "id": "caso-3",
      "caso": "El secuestro en el laboratorio",
      "introduccion": "El doctor Elías Montero, creador de una fórmula que vale millones, desapareció de su laboratorio cerrado por dentro. Solo quedan una taza de café y un teléfono que sonó antes de la medianoche. Investigá antes de acusar.",
      "escena": "La puerta del laboratorio estaba cerrada con llave desde adentro y las ventanas selladas. Sobre el escritorio quedó una taza de café a medio beber, y el teléfono recibió una llamada de número oculto a las 22:40. Las cámaras del edificio no registraron la salida del doctor.",
      "culpable": "socio",
      "pistas_necesarias": [
        "somnifero",
        "nota",
        "camaras"
      ]
    },
    "sospechosos": [
      {
        "id": "socio",
        "nombre": "El socio",
        "descripcion": "Financia la investigación y quiere la patente.",
        "imagen": "img/socio.jpg",
        "inicio": "Estoy destrozado. Elías es como un hermano para mí. Yo estaba en una cena con inversionistas."
      },
      {
        "id": "asistente",
        "nombre": "La asistente",
        "descripcion": "Última persona que vio al doctor.",
        "imagen": "img/asistente.jpg",
        "inicio": "Me fui a las diez. El doctor se veía cansado, pero tranquilo. No puedo creer lo que pasó."
      },
      {
        "id": "tecnico",
        "nombre": "El técnico",
        "descripcion": "Encargado de las cámaras y la red.",
        "imagen": "img/tecnico.jpg",
        "inicio": "Mantengo los sistemas del edificio. Esa noche no estaba de turno, pero me avisaron de una falla."
      }
    ],
    "pistas": [
      {
        "id": "somnifero",
        "nombre": "Rastros de somnífero",
        "descripcion": "El análisis de la taza revela un potente somnífero: el doctor fue drogado antes de desaparecer.",
        "imagen": "img/somnifero.jpg",
        "fuente": "escena"
      },
      {
        "id": "nota",
        "nombre": "Nota de rescate",
        "descripcion": "Está escrita en papel con la marca de agua de Salazar & Asociados, la empresa del socio.",
        "imagen": "img/nota.jpg",
        "fuente": "asistente"
      },
      {
        "id": "camaras",
        "nombre": "Cámaras hackeadas",
        "descripcion": "El video de 22:30 a 23:10 es un bucle falso, activado con la clave de administrador del socio.",
        "imagen": "img/camaras.jpg",
        "fuente": "tecnico"
      }
    ],
    "dialogos": {
      "socio": [
        {
          "id": "horario",
          "pregunta": "¿Dónde estaba anoche?",
          "respuesta": "En una cena con inversionistas en el centro. Salí tarde, cerca de las once y media."
        },
        {
          "id": "patente",
          "pregunta": "¿Qué pasará con la patente de la fórmula?",
          "respuesta": "Sin Elías, los derechos pasan a mi empresa. Sé cómo suena, pero yo quería a mi amigo."
        },
        {
          "id": "llamada",
          "pregunta": "¿Los secuestradores lo llamaron?",
          "respuesta": "Una llamada de número oculto pidiendo dinero. Colgaron antes de decir dónde entregarlo."
        }
      ],
      "asistente": [
        {
          "id": "salida",
          "pregunta": "¿Qué pasó antes de que se fuera?",
          "respuesta": "Dejé al doctor con su café. El señor Salazar se lo había enviado en un termo, como un detalle."
        },
        {
          "id": "medicinas",
          "pregunta": "¿El doctor tomaba algo para dormir?",
          "respuesta": "Jamás. Odiaba los medicamentos; ni siquiera tomaba pastillas para el dolor de cabeza."
        },
        {
          "id": "nota",
          "pregunta": "¿Encontró alguna nota?",
          "respuesta": "Sí, estaba debajo de la puerta del laboratorio al llegar. Aquí la tiene. Fíjese bien en el papel.",
          "pista": "nota"
        }
      ],
      "tecnico": [
        {
          "id": "aviso",
          "pregunta": "¿Qué falla le avisaron?",
          "respuesta": "A las 22:25 una llamada de número oculto me pidió revisar el servidor del sótano. Estuve allí media hora."
        },
        {
          "id": "registro",
          "pregunta": "¿Qué muestra el registro de las cámaras?",
          "respuesta": "Alguien entró con una clave de administrador y dejó un bucle de video. La clave es del socio. Aquí tiene la impresión.",
          "pista": "camaras"
        },
        {
          "id": "claves",
          "pregunta": "¿Quién tiene claves de administrador?",
          "respuesta": "Yo y el socio, porque financió la instalación. Yo nunca presto la mía."
        }
      ]
    },
    "finales": {
      "correcto": {
        "titulo": "Caso resuelto",
        "texto": "Reuniste las tres pruebas y acusaste al socio. El somnífero, la nota y las cámaras intervenidas demuestran que drogó al doctor y organizó el secuestro. El doctor Montero fue encontrado con vida."
      },
      "insuficiente": {
        "titulo": "Investigación incompleta",
        "texto": "Tu sospecha puede ser acertada, pero presentaste la acusación sin reunir las tres pruebas esenciales. El caso queda abierto por falta de evidencia."
      },
      "incorrecto": {
        "titulo": "Acusación equivocada",
        "texto": "Acusaste a una persona inocente. Las pruebas disponibles no respaldan tu decisión y el verdadero secuestrador sigue libre mientras el doctor continúa desaparecido."
      }
    }
  },
  "escuela": {
    "data": {
      "id": "caso-4",
      "caso": "El secuestro en la escuela",
      "introduccion": "Mateo Valdés, de nueve años, hijo del multimillonario Rodrigo Valdés, desapareció del colegio San Gabriel durante el recreo. Minutos después llegó una llamada: piden dinero a cambio de su regreso. Investigá antes de acusar.",
      "escena": "El portón lateral del colegio quedó entreabierto y la mochila de Mateo apareció en el patio trasero. En el suelo había un pase de salida con la firma del padre, pero el señor Valdés jura que nunca lo firmó. El timbre del recreo sonó a las 10:15.",
      "culpable": "secretaria",
      "pistas_necesarias": [
        "pase",
        "llave",
        "llamada"
      ]
    },
    "sospechosos": [
      {
        "id": "secretaria",
        "nombre": "La secretaria",
        "descripcion": "Lleva el registro de entradas y salidas.",
        "imagen": "img/escuela/secretaria.jpg",
        "inicio": "Esto es horrible. Mateo es un niño tan dulce. Yo estaba en mi oficina."
      },
      {
        "id": "conserje",
        "nombre": "El conserje",
        "descripcion": "Cuida los portones y las llaves.",
        "imagen": "img/escuela/conserje.jpg",
        "inicio": "Llevo veinte años en este colegio y nunca había pasado algo así."
      },
      {
        "id": "chofer",
        "nombre": "El chofer",
        "descripcion": "Lleva a Mateo al colegio todos los días.",
        "imagen": "img/escuela/chofer.jpg",
        "inicio": "Lo dejé en la puerta a las siete y media, como siempre. Ahora solo espero noticias."
      }
    ],
    "pistas": [
      {
        "id": "pase",
        "nombre": "Pase de salida falso",
        "descripcion": "Lleva la firma del padre, pero el sello es el de la secretaría del colegio.",
        "imagen": "img/escuela/pase.jpg",
        "fuente": "escena"
      },
      {
        "id": "llave",
        "nombre": "Llave del portón lateral",
        "descripcion": "El registro marca que el portón se abrió a las 10:12 con la llave de la dirección, que solo la secretaria tiene a mano.",
        "imagen": "img/escuela/llave.jpg",
        "fuente": "conserje"
      },
      {
        "id": "llamada",
        "nombre": "Llamada de extorsión grabada",
        "descripcion": "Al fondo de la grabación suena el timbre del colegio: la llamada se hizo desde adentro, a las 10:50.",
        "imagen": "img/escuela/llamada.jpg",
        "fuente": "chofer"
      }
    ],
    "dialogos": {
      "secretaria": [
        {
          "id": "horario",
          "pregunta": "¿Dónde estaba durante el recreo?",
          "respuesta": "En mi oficina, con papeles atrasados. No salí en toda la mañana."
        },
        {
          "id": "salidas",
          "pregunta": "¿Quién autoriza las salidas de los niños?",
          "respuesta": "Yo reviso cada pase y lo sello. Por eso me duele tanto que esto haya pasado."
        },
        {
          "id": "padre",
          "pregunta": "¿Qué opina del señor Valdés?",
          "respuesta": "Es muy generoso con el colegio. Dicen que su fortuna no tiene fondo, pero yo nunca me fijé en eso."
        }
      ],
      "conserje": [
        {
          "id": "ronda",
          "pregunta": "¿Qué hacía a las diez y cuarto?",
          "respuesta": "Cambiaba una bombilla en la cancha. El profesor de deportes puede confirmarlo."
        },
        {
          "id": "llaves",
          "pregunta": "¿Quién abre el portón lateral?",
          "respuesta": "Solo se abre con la llave de la dirección. Yo no la tengo: la guarda la secretaria. Mire el registro que imprimí.",
          "pista": "llave"
        },
        {
          "id": "auto",
          "pregunta": "¿Vio algo raro afuera?",
          "respuesta": "Un auto gris esperaba frente al colegio, pero se fue vacío. No me pareció importante."
        }
      ],
      "chofer": [
        {
          "id": "recreo",
          "pregunta": "¿Dónde estaba durante el recreo?",
          "respuesta": "Estacionado frente al colegio, esperando. Hay una cámara que me enfoca."
        },
        {
          "id": "llamada",
          "pregunta": "¿Los secuestradores llamaron?",
          "respuesta": "Al celular del señor Valdés, a las 10:50. Grabé la llamada. Escuche bien el fondo.",
          "pista": "llamada"
        },
        {
          "id": "rutina",
          "pregunta": "¿Quién conocía la rutina de Mateo?",
          "respuesta": "Todo el colegio. Se sabe quién es su padre y a qué hora sale al recreo."
        }
      ]
    },
    "finales": {
      "correcto": {
        "titulo": "Caso resuelto",
        "texto": "Reuniste las tres pruebas y acusaste a la secretaria. Falsificó el pase con el sello del colegio, abrió el portón con la llave de la dirección y llamó desde adentro para pedir dinero. Mateo fue encontrado sano y salvo."
      },
      "insuficiente": {
        "titulo": "Investigación incompleta",
        "texto": "Tu sospecha puede ser acertada, pero presentaste la acusación sin reunir las tres pruebas esenciales. El caso queda abierto por falta de evidencia."
      },
      "incorrecto": {
        "titulo": "Acusación equivocada",
        "texto": "Acusaste a una persona inocente. Las pruebas no respaldan tu decisión y quien planeó el secuestro sigue libre mientras Mateo continúa desaparecido."
      }
    }
  }
};
