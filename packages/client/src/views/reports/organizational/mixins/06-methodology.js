
import pdfUtils from '../../utils/pdf'

export default {
  data () {
    return {
      heatMapMeaning: [
        { value: '0.00 - 0.39', meaning: 'Franja Baja', color: '#CF6463' },
        { value: '0.40 - 0.69', meaning: 'Franja Media', color: '#FFd87C' },
        { value: '0.70 - 1.00', meaning: 'Franja Alta', color: '#93D379' }
      ],
      deipIndexMeaning: [
        { value: '1.00 - 1.99', meaning: 'Básico' },
        { value: '2.00 - 2.99', meaning: 'Emergente' },
        { value: '3.00 - 3.99', meaning: 'En Evolución' },
        { value: '4.00 - 5.00', meaning: 'Referente' }
      ],
      questionItems: [
        '9 preguntas sociodemográﬁcas para conocer el perﬁl del encuestado(a) (anónima y 100% conﬁdencial)',
        '5 dimensiones, con un total de 31 atributos y 56 preguntas (promedio de 11 preguntas especíﬁcas por atributo); de las cuales, 23 de ellas son descriptivas.',
        '12 preguntas adicionales para Líderes de Equipos, de las cuales 5 preguntas son descriptivas.'
      ],
      levelNamesBg: '#9cd3ef',
      levelNames: [
        'Descripción Nivel\nBásico',
        'Descripción Nivel\nEmergente',
        'Descripción Nivel\nEn Evolución',
        'Descripción Nivel\nReferente'
      ],
      levelDescriptions: [
        // Básico
        [
          'Bajo nivel de conciencia y poco conocimiento.',
          'Acciones incipientes y esporádicas.',
          'No involucramiento directo de los(as) líderes.',
          'Mínima representación de talento diverso.'
        ],
        // Emergente
        [
          'Despertando consciencia y ampliando conocimiento.',
          'Baja representación de talento diverso.',
          'Inicio sensibilización y educación.',
          'Involucramiento limitado de los(as) líderes.',
          'Enfoque sólo en una arista de la diversidad.',
          'Acciones y comunicación aisladas y tácticas.',
          'Monitoreo y métricas DEIP incipientes.',
          'Existencia de Comités desarticulados.',
          'Presupuesto incipiente.'
        ],
        // En Evolución
        [
          'Evolucionando en nivel de consciencia y conocimiento.',
          'Representación visible de talento diverso (orgánico).',
          'Articulación con la estrategia de sostenibilidad.',
          'Líderes corresponsables y sensibilizados (Sponsors - Champions).',
          'Declaración de compromiso y política inicial.',
          'Enfoque diferencial DEIP.',
          'Articulación con la estrategia de comunicación.',
          'Plan de sensibilización y formación (audiencias claves).',
          'Comités oficiales con hoja de ruta.',
          'Medición y monitoreo cualitativo.'
        ],
        // Referente
        [
          'Mayor nivel de conocimiento, madurez y conciencia.',
          'DEIP como manifestación estratégica del Propósito Superior.',
          'Representación visible de talento diverso (intencional).',
          'Líderes movilizadores del ecosistema (Sponsors Champions influencers).',
          'Evidencia de Ciclo de Talento CSI*.',
          'Declaración de compromiso y política/protocolos con enfoque diferencial.',
          'Enfoque diferencial/interseccional DEIP.',
          'Estrategia de comunicación CSI (Interna y Externa).',
          'Plan de sensibilización y formación (toda la organización).',
          'Comités/ERGs oficiales y equipados.',
          'Medición y monitoreo cualitativo y cuantitativo (KPIs).',
          'Presupuesto estratégico multidimensional.',
          'Articulación de ecosistemas.'
        ]
      ]
    }
  },
  methods: {
    getEvolutionIndex (score) {
      let text, width
      switch (true) {
        case (score >= 1 && score < 2):
          text = 'Básico'
          width = 42
          break
        case (score >= 2 && score < 3):
          text = 'Emergente'
          width = 71
          break
        case (score >= 3 && score < 4):
          text = 'En Evolución'
          width = 82
          break
        case (score >= 4 && score <= 5):
          text = 'Referente'
          width = 62.5
          break
      }

      return { text, width }
    },
    getFillColor (score) { // Heat Map colors
      score = Number(parseFloat(score).toFixed(2))
      let color
      switch (true) {
        case (score >= 0 && score < 0.4):
          color = '#CF6463'
          break
        case (score >= 0.4 && score < 0.7):
          color = '#FFd87C'
          break
        case (score >= 0.7 && score <= 1):
          color = '#93D379'
          break
        default:
          color = '#FF6600'
          break
      }

      return color
    },
    assembleHeatMapMeaningTable () {
      const rows = []
      for (const item of this.heatMapMeaning) {
        rows.push([
          {
            text: '                      .',
            color: item.color,
            background: item.color,
            preserveLeadingSpaces: true,
            lineHeight: 0.95,
            margin: [1.84, 2.8, 0, 0.5]
          },
          {
            text: item.value,
            margin: [2, 2.8, 0, 0.5],
            color: '#222222'
          },
          {
            text: item.meaning,
            margin: [2, 2.8, 0, 0.5],
            color: '#222222'
          }
        ])
      }
      return rows
    },
    assembleDeipIndexMeaningTable () {
      const rows = []
      for (const item of this.deipIndexMeaning) {
        rows.push([
          {
            text: item.value,
            margin: [7, 2.8, 0, 0.5],
            color: '#222222'
          },
          {
            text: item.meaning,
            margin: [2, 2.8, 0, 0.5],
            color: '#222222'
          }
        ])
      }
      return rows
    },
    $generateMethodology () {
      const fontSize = 9.5
      return [
        pdfUtils.generateTitle(this.$t('Views.Evaluations.report.toc.methodology'), [0, 0], 'before'),
        {
          text: 'Cuestionario:',
          margin: [0, 35, 0, 0],
          fontSize: 11,
          bold: true
        },
        {
          text: 'La herramienta Índice de Evolución DEIP, se estructura de la siguiente manera:',
          margin: [0, 2, 0, 0],
          fontSize
        },
        {
          text: 'Opciones de respuesta:',
          margin: [0, 14, 0, 0],
          fontSize: 11,
          bold: true
        },
        {
          text: 'Escala Likert, cerradas sí - no - no sabe/preﬁere no contestar, opción múltiple con varias respuestas.',
          margin: [0, 2, 0, 0],
          fontSize
        },
        {
          text: 'Número de preguntas:',
          margin: [0, 14, 0, 0],
          fontSize: 11,
          bold: true
        },
        {
          ul: this.questionItems,
          margin: [10, 2, 30, 0],
          fontSize
        },
        {
          text: 'Puntuación de las preguntas:',
          margin: [0, 14, 0, 0],
          fontSize: 11,
          bold: true
        },
        {
          text: 'Las preguntas cerradas y likert cuentan con un promedio simple.',
          margin: [0, 2, 0, 0],
          fontSize
        },
        {
          text: 'De acuerdo a este promedio, cada dimensión es clasiﬁcada dentro de una franja baja (0.00 - 0.39), media (0.40 - 0.69), alta (0.70 - 1.00), según su resultado. (ver tabla 1)',
          margin: [0, 10, 30, 0],
          fontSize
        },
        {
          text: 'La suma de los promedios de las 5 principales dimensiones, brinda un Índice de Evolución DEIP. Este resultado estará ubicado en un nivel de madurez que va desde Básico hasta Referente. (ver tabla 2)',
          margin: [0, 10, 30, 0],
          fontSize
        },
        // TABLE 1
        {
          text: 'Índice por Dimensión (tabla 1)',
          margin: [0, 25, 0, 0],
          fontSize,
          bold: true
        },
        {
          margin: [0, 5, 0, 0],
          table: {
            widths: ['12%', '18%', '*'],
            body: [
              // Headers
              [
                {
                  text: 'Color',
                  margin: [2, 3.4, 0, 0.8],
                  color: '#111111',
                  fillColor: '#DDDDF2',
                  bold: true
                },
                {
                  text: 'Valores',
                  margin: [2, 3.4, 0, 0.8],
                  color: '#111111',
                  fillColor: '#DDDDF2',
                  bold: true
                },
                {
                  text: 'Significado',
                  margin: [2, 3.4, 0, 0.8],
                  color: '#111111',
                  fillColor: '#DDDDF2',
                  bold: true
                }
              ],
              // Body
              ...this.assembleHeatMapMeaningTable()
            ]
          },
          layout: {
            hLineWidth: () => {
              return 1
            },
            vLineWidth: () => {
              return 1
            },
            hLineColor: () => {
              return '#BBBBBB'
            },
            vLineColor: () => {
              return '#BBBBBB'
            }
          }
        },
        // TABLE 2
        {
          text: 'Índice de Evolución DEIP (tabla 2)',
          margin: [0, 25, 0, 0],
          fontSize,
          bold: true
        },
        {
          margin: [0, 5, 0, 0],
          table: {
            widths: ['17%', '*'],
            body: [
              // Headers
              [
                {
                  text: 'Valores',
                  margin: [7, 3.4, 0, 0.8],
                  color: '#111111',
                  fillColor: '#DDDDF2',
                  bold: true
                },
                {
                  text: 'Significado',
                  margin: [2, 3.4, 0, 0.8],
                  color: '#111111',
                  fillColor: '#DDDDF2',
                  bold: true
                }
              ],
              // Body
              ...this.assembleDeipIndexMeaningTable()
            ]
          },
          layout: {
            hLineWidth: () => {
              return 1
            },
            vLineWidth: () => {
              return 1
            },
            hLineColor: () => {
              return '#BBBBBB'
            },
            vLineColor: () => {
              return '#BBBBBB'
            }
          }
        }
      ]
    }
  }
}
