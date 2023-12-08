
import pdfUtils from '../../utils/pdf'

export default {
  data () {
    return {
      heatMapMeaning: [
        { value: '0 - 0.39', meaning: 'Franja Baja', color: '#C05251' },
        { value: '0.4 - 0.69', meaning: 'Franja Media', color: '#FFd87C' },
        { value: '0.7 - 1', meaning: 'Franja Alta', color: '#93D379' }
      ],
      deipIndexMeaning: [
        { value: '1 - 1.99', meaning: 'Básico' },
        { value: '2 - 2.99', meaning: 'Emergente' },
        { value: '3 - 3.99', meaning: 'En Evolución' },
        { value: '4 - 5', meaning: 'Referente' }
      ],
      questionItems: [
        '9 preguntas sociodemográﬁcas para conocer el perﬁl del encuestado(a) (anónima y 100% conﬁdencial)',
        '5 dimensiones, con un total de 31 atributos y 56 preguntas (promedio de 11 preguntas especíﬁcas por atributo); de las cuales, 23 de ellas son descriptivas.',
        '12 preguntas adicionales para Líderes con personas a cargo, de las cuales 5 preguntas son descriptivas.'
      ]
    }
  },
  methods: {
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
          text: 'Escala Likert, cerradas sí – no - no sabe/ preﬁere no contestar, opción múltiple con varias respuestas.',
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
          text: 'De acuerdo a este promedio, cada dimensión es clasiﬁcada dentro de una franja baja (0 - 0,3), media (0,4 - 0,6), alta (0,7 - 1), según su resultado. (ver tabla 1)',
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
