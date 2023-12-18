
import pdfUtils from '../../utils/pdf'

export default {
  data () {
    return {
      scatterHeaders: [
        {
          text: this.$t('Views.Evaluations.stepQuestion.title'),
          margin: [2, 10, 0, 0],
          fillColor: '#9cd3ef',
          bold: true
        },
        {
          text: 'Dispersión Población',
          margin: [0, 2, 0, 0],
          alignment: 'center',
          fillColor: '#9cd3ef',
          bold: true
        },
        {
          text: 'Dispersión Organización',
          margin: [0, 2, 0, 0],
          alignment: 'center',
          fillColor: '#9cd3ef',
          bold: true
        }
      ]
    }
  },
  methods: {
    assembleScatterTable (type) {
      const data = type === 'high' ? this.highestScatter : this.lowestScatter
      const rows = []
      data.forEach(x => {
        const question = x.dimension === 'leader'
          ? this.evaluationData.questionnaire.evaluations[x.dimension][x.question].label[this.user.lang]
          : this.evaluationData.questionnaire.evaluations[x.dimension].attrs[x.attribute].questions[x.question].label[this.user.lang]

        const organization = x.dimension === 'leader'
          ? this.scatterDimension[x.dimension][x.question].general.scatter
          : this.scatterDimension[x.dimension].attrs[x.attribute].questions[x.question].general.scatter

        rows.push([
          {
            text: question,
            margin: [0, 1, 0, 0],
            fontSize: 7.5,
            color: '#555555'
          },
          {
            text: this.$round(x.scatter),
            margin: [0, 8, 0, 2],
            alignment: 'center',
            fontSize: 11.5,
            bold: true,
            color: '#222222'
          },
          {
            text: this.$round(organization),
            margin: [0, 8, 0, 2],
            alignment: 'center',
            fontSize: 11.5,
            bold: true,
            color: '#222222'
          }
        ])
      })

      return rows
    },
    $generateQuestionsScatter () {
      const widths = ['*', '14%', '14.5%']

      return [
        pdfUtils.generateTitle('Dispersión', [0, -4, 0, 0], 'before', 44, '#222222', true),
        pdfUtils.generateTitle('Dispersión por pregunta', [0, 8, 0, 0], '', 24, '#222222', true, true),
        {
          text: 'Preguntas con dispersión más alta',
          margin: [0, 10, 0, 0],
          color: '#444444',
          fontSize: 17
        },
        // * ------------------------ *
        // *   HIGHER SCATTER TABLE   *
        // * ------------------------ *
        {
          margin: [0, 8, 0, 0],
          color: '#222222',
          table: {
            widths,
            body: [
              // Headers
              JSON.parse(JSON.stringify(this.scatterHeaders)),
              // Body
              ...this.assembleScatterTable('high')
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
        {
          text: 'Preguntas con dispersión más baja',
          margin: [0, 20, 0, 0],
          color: '#444444',
          fontSize: 17
        },
        // * ------------------------ *
        // *   LOWER SCATTER TABLE    *
        // * ------------------------ *
        {
          margin: [0, 8, 0, 0],
          color: '#222222',
          table: {
            widths,
            body: [
              // Headers
              JSON.parse(JSON.stringify(this.scatterHeaders)),
              // Body
              ...this.assembleScatterTable('low')
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
