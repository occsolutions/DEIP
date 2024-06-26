
import pdfUtils from '../../utils/pdf'
import circleBase64 from '../../base64files/how-works'

export default {
  methods: {
    $generateModelDescription () {
      const fontSize = 9.5
      const lineHeight = 1.2
      const dimensions = [{
        text: [
          { text: 'Estrategia/Compromiso', bold: true },
          ': Mide el nivel de consciencia/madurez de DEI como estrategia y su conexión con el propósito superior y sostenibilidad de la organización.'
        ]
      }, {
        text: [
          { text: 'Gobernanza/Liderazgo CSI (Consciente, Sostenible e Incluyente)', bold: true },
          ': Mide el nivel de dirección estructurada y la responsabilidad/compromiso de parte del liderazgo de la organización.'
        ]
      }, {
        text: [
          { text: 'Cultura CSI (Consciente, Sostenible e Incluyente)', bold: true },
          ': Mide el color de la cultura y sus manifestaciones incluyentes en lo cotidiano.'
        ]
      }, {
        text: [
          { text: 'Ciclo de Talento Incluyente', bold: true },
          ': Mide el nivel de consciencia de la inclusión a través de todo el ciclo de desarrollo de talento, como motor de ﬂorecimiento, engagement (compromiso) y ﬁdelización.'
        ]
      }, {
        text: [
          { text: 'Ecosistema DI (Diferencial e Interseccional)', bold: true },
          ': Mide el nivel de evolución y polinización de los grupos de interés del ecosistema diverso.'
        ]
      }, {
        text: [
          { text: 'Dimensión Adicional - Líderes de Equipos', bold: true },
          ': Las preguntas de esta dimensión son respondidas por aquellas personas que gestionan equipos de trabajo y son seleccionados por el cliente.'
        ]
      }]

      const dimensions2 = [{
        name: 'Estrategia/Compromiso',
        list: [
          'Propósito Superior',
          'Conexión Sostenibilidad/ASG',
          'Caso de Negocio (aristas de la diversidad)',
          'Declaración Compromiso/Política DDHH',
          'Conciliación Vida - Trabajo',
          'Impacto Marca Empleadora'
        ]
      }, {
        name: 'Gobernanza/Liderazgo CSI',
        list: [
          'Áreas Gestoras',
          'Champions (Líderes)',
          'Comité DEIP',
          'Voluntariado Corporativo/Impacto Comunidad',
          'Líderes y Responsabilidad de Triple Impacto/DEIP',
          'Perﬁl y Atributos de Liderazgo CSI*',
          'Acciones Aﬁrmativas de los Líderes'
        ]
      }, {
        name: 'Cultura CSI',
        list: [
          'Valores Corporativos',
          'Sensibilización - Educación DEIP',
          'Estrategia de Comunicación DEIP (Interna/Externa)',
          'Comportamientos Deseados DEIP',
          'Plan de Reconocimiento',
          'Acciones Aﬁrmativas para Generar Cultura'
        ]
      }, {
        name: 'Ecosistema DI',
        list: [
          'Productos y Servicios Incluyentes',
          'Declaraciones y Políticas',
          'Protocolos de Violencias',
          'Reputación Corporativa',
          'Acciones Aﬁrmativas con los\nGrupos de Interés'
        ]
      }, {
        name: 'Ciclo de Talento Incluyente',
        list: [
          'Proceso de Atracción y Selección Incluyente',
          'Proceso de Inducción Incluyente',
          'Proceso de Desarrollo de Carrera Incluyente',
          'Compensación y Beneficios Incluyentes',
          'Momentos de la Verdad (Fidelización-Engagement)',
          'Acciones Aﬁrmativas para el Desarrollo del Talento'
        ]
      }]

      return [
        pdfUtils.generateTitle('Modelo DEIP', [0, 0, 0, 0], 'before', 38),
        {
          image: circleBase64,
          fit: [189, 188],
          absolutePosition: { x: 200, y: 460 }
        },
        {
          text: 'El modelo Índice de Evolución DEIP, se compone de 5 dimensiones y una dimensión adicional para los Líderes de Equipos:',
          margin: [0, 35, 40, 0],
          fontSize,
          lineHeight: 1.4
        },
        {
          ol: dimensions,
          margin: [0, 7, 20, 0],
          fontSize,
          lineHeight
        },
        {
          margin: [0, 30, 0, 0],
          fontSize: 9.5,
          table: {
            widths: ['48%', '*'],
            heights: [140, 100, 140],
            body: [
              [
                {
                  stack: [{ text: dimensions2[0].name, bold: true, fontSize: 11 }, { ul: dimensions2[0].list, margin: [-9.5, 0, 0, 0] }],
                  margin: [20, 44, 0, 0]
                },
                {
                  stack: [{ text: dimensions2[1].name, bold: true, fontSize: 11 }, { ul: dimensions2[1].list, margin: [-9.5, 0, 0, 0] }],
                  margin: [35, -5, 0, 0]
                }
              ],
              [
                {
                  text: ''// Empty
                },
                {
                  stack: [{ text: dimensions2[2].name, bold: true, fontSize: 11 }, { ul: dimensions2[2].list, margin: [-9.5, 0, 0, 0] }],
                  margin: [107, -14, 0, 0]
                }
              ],
              [
                {
                  stack: [{ text: dimensions2[3].name, bold: true, fontSize: 11 }, { ul: dimensions2[3].list, margin: [-9.5, 0, 0, 0] }],
                  margin: [20, -25, 0, 0]
                },
                {
                  stack: [{ text: dimensions2[4].name, bold: true, fontSize: 11 }, { ul: dimensions2[4].list, margin: [-9.5, 0, 0, 0] }],
                  margin: [-14, 30, 0, 0]
                }
              ]
            ]
          },
          layout: {
            hLineWidth: () => {
              return 0
            },
            vLineWidth: () => {
              return 0
            }
          }
        }
      ]
    }
  }
}
