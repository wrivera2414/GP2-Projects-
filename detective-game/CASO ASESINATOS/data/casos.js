
window.CASOS = [
    {
        "id": "TREN-001",
        "codigo": "CASO 001",
        "titulo": "Crimen en el tren",
        "subtitulo": "Una muerte en el último recorrido del Estrella del Norte.",
        "tipo": "Tren",
        "escenario": "Tren nocturno Estrella del Norte",
        "imagen": "img/tren/interior-vagon.jpg",
        "descripcion": "Ernesto Valdés, dueño de una empresa de importaciones, aparece muerto en el compartimento 06. La puerta no fue forzada y desapareció un sobre con documentos de la empresa.",
        "victima": {
            "nombre": "Ernesto Valdés",
            "edad": 52,
            "ocupacion": "Empresario",
            "resumen": "Había descubierto que alguien estaba desviando dinero de su empresa. Esa noche llevaba un sobre con los comprobantes."
        },
        "cronologia": [
            [
                "20:10",
                "El tren sale de Puerto Claro."
            ],
            [
                "20:40",
                "Ernesto cena en el vagón comedor con los pasajeros."
            ],
            [
                "21:05",
                "El jefe de seguridad revisa el pasillo del vagón."
            ],
            [
                "21:20",
                "Marcos Vidal pide prestada la tarjeta de acceso de servicio."
            ],
            [
                "21:32",
                "La tarjeta abre el compartimento 06."
            ],
            [
                "21:50",
                "El tren llega a la siguiente estación."
            ],
            [
                "22:00",
                "El personal encuentra a Ernesto sin vida."
            ]
        ],
        "sospechosos": [
            {
                "id": "tr-s1",
                "nombre": "Marcos Vidal",
                "rol": "Socio comercial",
                "foto": "img/sospechosos/perfil-01.jpg",
                "motivo": "Ernesto descubrió que Marcos había retirado dinero de la empresa sin autorización.",
                "declaracion": "Dije que no entré al compartimento. Solo pedí la tarjeta para revisar una puerta del vagón.",
                "contradiccion": "El registro demuestra que la tarjeta que pidió abrió precisamente el compartimento de Ernesto a las 21:32."
            },
            {
                "id": "tr-s2",
                "nombre": "Esteban Ríos",
                "rol": "Jefe de seguridad",
                "foto": "img/sospechosos/perfil-02.jpg",
                "motivo": "Tenía acceso a las tarjetas y conocía todos los compartimentos.",
                "declaracion": "A las 21:30 estaba en el puesto de seguridad revisando las cámaras.",
                "contradiccion": "La cámara del puesto y el libro de rondas confirman que permaneció allí durante la hora del crimen."
            },
            {
                "id": "tr-s3",
                "nombre": "Daniel Ponce",
                "rol": "Pasajero y antiguo empleado",
                "foto": "img/sospechosos/perfil-03.jpg",
                "motivo": "Había sido despedido por Ernesto meses atrás.",
                "declaracion": "Estuve en el vagón comedor desde las 21:15 hasta que el tren llegó a la estación.",
                "contradiccion": "Dos pasajeros y el registro de consumo confirman que permaneció en el comedor."
            }
        ],
        "evidencias": [
            {
                "id": "TR-E01",
                "nombre": "Sobre de documentos desaparecido",
                "tipo": "Documental",
                "imagen": "img/evidencias/tren/compartimento.jpg",
                "descripcion": "Ernesto llevaba un sobre con comprobantes de retiros no autorizados. El sobre no aparece en la habitación.",
                "analisis": "El móvil del crimen está relacionado con el dinero que faltaba en la empresa."
            },
            {
                "id": "TR-E02",
                "nombre": "Registro de tarjeta",
                "tipo": "Digital",
                "imagen": "img/evidencias/tren/pasillo-vagon.jpg",
                "descripcion": "La tarjeta de servicio abrió el compartimento 06 a las 21:32.",
                "analisis": "Marcos había pedido esa misma tarjeta diez minutos antes. Esteban tenía otra tarjeta y Daniel no tenía acceso."
            },
            {
                "id": "TR-E03",
                "nombre": "Cámara del puesto de seguridad",
                "tipo": "Digital",
                "imagen": "img/evidencias/tren/estacion.jpg",
                "descripcion": "La cámara muestra a Esteban en su puesto entre las 21:20 y las 21:45.",
                "analisis": "Esteban no pudo usar la tarjeta para entrar al compartimento durante la hora del crimen."
            },
            {
                "id": "TR-E04",
                "nombre": "Testigos del vagón comedor",
                "tipo": "Testimonial",
                "imagen": "img/evidencias/tren/anden.jpg",
                "descripcion": "Dos pasajeros recuerdan que Daniel permaneció en el comedor durante el intervalo clave.",
                "analisis": "El testimonio coincide con el registro de consumo y respalda su coartada."
            },
            {
                "id": "TR-E05",
                "nombre": "Comprobante bancario",
                "tipo": "Documental",
                "imagen": "img/evidencias/tren/registro-digital.jpg",
                "descripcion": "Un comprobante encontrado entre los papeles de Ernesto muestra una transferencia de la empresa a una cuenta de Marcos.",
                "analisis": "Demuestra que Marcos tenía un motivo concreto para impedir que Ernesto entregara los documentos."
            },
            {
                "id": "TR-E06",
                "nombre": "Declaración de Marcos",
                "tipo": "Testimonial",
                "imagen": "img/evidencias/tren/tarjeta-acceso.jpg",
                "descripcion": "Marcos negó haber pedido o utilizado la tarjeta de servicio.",
                "analisis": "El registro de entrega contradice su declaración. Mintió sobre un dato que lo sitúa con acceso directo a la habitación."
            }
        ],
        "interrogatorios": [
            {
                "sospechoso": "tr-s1",
                "pregunta": "¿Para qué pidió la tarjeta de servicio?",
                "respuesta": "Para revisar una puerta que, según me dijeron, no cerraba bien.",
                "observacion": "No existe reporte de una puerta averiada. El registro muestra que la tarjeta abrió el compartimento de Ernesto."
            },
            {
                "sospechoso": "tr-s2",
                "pregunta": "¿Dónde estaba a las 21:32?",
                "respuesta": "En el puesto de seguridad, frente a las cámaras.",
                "observacion": "La grabación confirma su ubicación y descarta que utilizara la tarjeta."
            },
            {
                "sospechoso": "tr-s3",
                "pregunta": "¿Salió del vagón comedor antes de las 21:45?",
                "respuesta": "No, permanecí allí todo ese tiempo.",
                "observacion": "Los testigos y el registro de consumo respaldan su versión."
            }
        ],
        "solucion": {
            "culpable": "tr-s1",
            "nombre": "Marcos Vidal",
            "explicacion": "La clave está en combinar tres datos: Marcos tenía un motivo económico, pidió la tarjeta de servicio poco antes del crimen y mintió al negar que la había utilizado. El registro confirma que esa tarjeta abrió la habitación de Ernesto a las 21:32. Las pruebas también respaldan las coartadas de Esteban y Daniel.",
            "secuencia": [
                "Ernesto descubre retiros de dinero hechos por Marcos.",
                "Marcos pide la tarjeta de servicio a las 21:20.",
                "A las 21:32 la tarjeta abre el compartimento de Ernesto.",
                "Marcos niega haber pedido la tarjeta, pero el registro lo contradice.",
                "El motivo, la oportunidad y la mentira señalan a Marcos Vidal."
            ]
        },
        "categoria": "asesinatos",
        "categoriaNombre": "ASESINATOS"
    },
    {
        "id": "HOT-002",
        "codigo": "CASO 002",
        "categoria": "asesinatos",
        "categoriaNombre": "ASESINATOS",
        "titulo": "El último brindis",
        "subtitulo": "Una cena privada termina en una muerte inexplicable.",
        "tipo": "Asesinato",
        "escenario": "Hotel Mirador · Lounge privado",
        "imagen": "img/hotel/lounge-privado.jpg",
        "descripcion": "Adrián Montoya, socio principal de una firma de inversiones, aparece muerto después de una cena privada en el Hotel Mirador. Una copa rota, una discusión que nadie quiere reconocer y un cambio reciente en el contrato de sociedad apuntan a que su muerte no fue accidental.",
        "victima": {
            "nombre": "Adrián Montoya",
            "edad": 45,
            "ocupacion": "Inversionista y socio fundador",
            "resumen": "Había decidido modificar el contrato de sociedad y retirar a uno de sus socios por irregularidades financieras. Esa noche convocó a una reunión privada para comunicar su decisión."
        },
        "cronologia": [
            [
                "19:40",
                "Adrián Montoya llega al Hotel Mirador y solicita una mesa privada en el lounge."
            ],
            [
                "20:05",
                "Llegan los tres invitados: Ricardo Méndez, Esteban Cálix y Mauricio Pineda."
            ],
            [
                "20:25",
                "El personal sirve la cena y registra una botella solicitada por Ricardo."
            ],
            [
                "20:42",
                "La cámara registra a Ricardo junto a la mesa de Adrián mientras los otros invitados están fuera del salón."
            ],
            [
                "21:00",
                "Se escucha una discusión breve; Adrián pide que la reunión termine."
            ],
            [
                "21:18",
                "Adrián se desploma. El personal solicita asistencia médica."
            ],
            [
                "21:46",
                "El médico confirma el fallecimiento y solicita preservar la escena."
            ],
            [
                "22:10",
                "La policía asegura la mesa y recoge los objetos para análisis."
            ]
        ],
        "sospechosos": [
            {
                "id": "hot-s1",
                "nombre": "Ricardo Méndez",
                "rol": "Socio de inversiones",
                "foto": "img/hotel/sospechosos/ricardo.jpg",
                "motivo": "Adrián había decidido retirarle poderes de firma y reducir su participación después de detectar movimientos financieros no autorizados.",
                "declaracion": "Solo conversé con Adrián unos minutos. No toqué su copa y me retiré antes de que se sintiera mal.",
                "contradiccion": "La cámara lo sitúa junto a la mesa después de que los demás invitados salieron y el registro de servicio confirma que pidió la botella que quedó en la mesa."
            },
            {
                "id": "hot-s2",
                "nombre": "Esteban Cálix",
                "rol": "Gerente del Hotel Mirador",
                "foto": "img/hotel/sospechosos/esteban.jpg",
                "motivo": "Tenía acceso al lounge y conocía los procedimientos del servicio. Adrián había reclamado por una factura del hotel.",
                "declaracion": "Estuve en recepción atendiendo una queja de otro huésped durante el intervalo crítico.",
                "contradiccion": "El registro de recepción y dos empleados confirman que permaneció allí entre las 20:35 y las 21:05."
            },
            {
                "id": "hot-s3",
                "nombre": "Mauricio Pineda",
                "rol": "Sommelier del hotel",
                "foto": "img/hotel/sospechosos/mauricio.jpg",
                "motivo": "Fue quien recomendó el vino y tuvo contacto con la mesa antes de que comenzara la reunión.",
                "declaracion": "Serví la botella y me retiré. No regresé a la mesa durante la conversación privada.",
                "contradiccion": "La cámara del área de servicio y la bitácora muestran que permaneció en la estación de bebidas durante el intervalo clave."
            }
        ],
        "evidencias": [
            {
                "id": "HOT-E01",
                "nombre": "Copa de Adrián",
                "tipo": "Pericial",
                "imagen": "img/evidencias/hotel/copa.jpg",
                "descripcion": "La copa que utilizó Adrián presenta residuos que no corresponden a los componentes normales de la bebida.",
                "analisis": "El informe toxicológico confirma la presencia de una sustancia ajena a la bebida. La muerte no fue accidental."
            },
            {
                "id": "HOT-E02",
                "nombre": "Grabación del lounge",
                "tipo": "Digital",
                "imagen": "img/evidencias/hotel/camara.jpg",
                "descripcion": "La cámara muestra a Ricardo junto a la mesa de Adrián cuando los otros invitados ya habían salido del salón.",
                "analisis": "Sitúa a Ricardo en la mesa durante el intervalo en que pudo intervenir en la bebida."
            },
            {
                "id": "HOT-E03",
                "nombre": "Contrato de sociedad",
                "tipo": "Documental",
                "imagen": "img/evidencias/hotel/contrato.jpg",
                "descripcion": "El documento preparado por Adrián establece la revocación de los poderes de firma de Ricardo y una reducción de su participación.",
                "analisis": "Aporta un motivo concreto: Ricardo perdería control y beneficios económicos."
            },
            {
                "id": "HOT-E04",
                "nombre": "Mensaje de Adrián",
                "tipo": "Digital",
                "imagen": "img/evidencias/hotel/mensaje.jpg",
                "descripcion": "En su teléfono, Adrián escribió a su abogado que anunciaría esa noche un cambio definitivo en la sociedad.",
                "analisis": "Confirma que la reunión tenía un propósito delicado y que Ricardo conocía la decisión."
            },
            {
                "id": "HOT-E05",
                "nombre": "Memoria de seguridad",
                "tipo": "Digital",
                "imagen": "img/evidencias/hotel/memoria.jpg",
                "descripcion": "La copia de respaldo conserva el registro de video del lounge y permite reconstruir los movimientos de cada invitado.",
                "analisis": "Corrobora que Esteban y Mauricio permanecieron en sus áreas de trabajo mientras Ricardo estuvo junto a la mesa."
            },
            {
                "id": "HOT-E06",
                "nombre": "Informe de laboratorio",
                "tipo": "Pericial",
                "imagen": "img/evidencias/hotel/analisis.jpg",
                "descripcion": "El laboratorio descarta una causa natural y confirma que la copa contenía una sustancia tóxica.",
                "analisis": "Junto con el video, la oportunidad y el motivo económico, permite descartar un accidente."
            }
        ],
        "interrogatorios": [
            {
                "sospechoso": "hot-s1",
                "pregunta": "¿Por qué permaneció junto a la mesa después de que los demás invitados salieron?",
                "respuesta": "Adrián quería hablar conmigo a solas sobre asuntos de la sociedad.",
                "observacion": "La grabación confirma que tuvo un momento a solas con la víctima y contradice su afirmación de que se retiró antes del incidente."
            },
            {
                "sospechoso": "hot-s2",
                "pregunta": "¿Dónde se encontraba entre las 20:35 y las 21:05?",
                "respuesta": "En recepción, atendiendo a un huésped.",
                "observacion": "El registro y los testimonios del personal respaldan su coartada."
            },
            {
                "sospechoso": "hot-s3",
                "pregunta": "¿Volvió a la mesa después de servir la botella?",
                "respuesta": "No. Permanecí en la estación de bebidas.",
                "observacion": "La cámara del área de servicio confirma su ubicación durante el intervalo crítico."
            }
        ],
        "solucion": {
            "culpable": "hot-s1",
            "nombre": "Ricardo Méndez",
            "explicacion": "Ricardo tenía un motivo económico directo: Adrián iba a retirarle poderes de firma y reducir su participación en la empresa. La grabación lo ubica a solas junto a la mesa durante el intervalo crítico. La copa y el informe de laboratorio demuestran que la muerte no fue accidental. Esteban y Mauricio tienen coartadas respaldadas por registros y testimonios. La combinación de motivo, oportunidad y evidencia pericial señala a Ricardo Méndez.",
            "secuencia": [
                "Adrián convoca a sus socios para anunciar cambios en el contrato.",
                "Ricardo conoce que perderá poderes de firma y parte de su participación.",
                "Los registros muestran que Ricardo permanece junto a la mesa cuando los demás invitados salen.",
                "El análisis de la copa confirma que la muerte no fue natural.",
                "Las coartadas de Esteban y Mauricio son corroboradas por registros independientes.",
                "El motivo y la oportunidad identifican a Ricardo Méndez como responsable."
            ]
        }
    }
];
