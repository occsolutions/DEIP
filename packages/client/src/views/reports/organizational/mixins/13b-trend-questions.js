
import pdfUtils from '../../utils/pdf'

export default {
  data () {
    return {
      trendHeaders: [
        {
          text: this.$t('Views.Evaluations.stepQuestion.title'),
          margin: [2, 10, 0, 0],
          fillColor: '#9cd3ef',
          bold: true
        },
        {
          text: this.$t('Views.Evaluations.report.organizational.curr_score'),
          margin: [0, 2, 0, 0],
          alignment: 'center',
          fillColor: '#9cd3ef',
          bold: true
        },
        {
          text: this.$t('Views.Evaluations.report.organizational.prev_score'),
          margin: [0, 2, 0, 0],
          alignment: 'center',
          fillColor: '#9cd3ef',
          bold: true
        },
        {
          text: this.$t('Views.Evaluations.report.organizational.trend'),
          margin: [0, 10, 0, 0],
          alignment: 'center',
          fillColor: '#9cd3ef',
          bold: true
        }
      ]
    }
  },
  methods: {
    assembleQuestionsTrendTable (type) {
      const rows = []
      Object.keys(this.answersDimension).forEach(dimKey => {
        if (dimKey !== 'leader') {
          Object.keys(this.answersDimension[dimKey].attrs).forEach(attrKey => {
            Object.keys(this.answersDimension[dimKey].attrs[attrKey].questions).forEach(qKey => {
              const question = this.answersDimension[dimKey].attrs[attrKey].questions[qKey]
              if (question.qType !== 'options') {
                const variation = question.general.score - question.general.previous
                rows.push([
                  {
                    text: this.hasPrevious ? this.evaluationData.questionnaire.evaluations[dimKey].attrs[attrKey].questions[qKey].label[this.user.lang] : '--',
                    margin: [2, 3, 0, 0],
                    fontSize: 9,
                    color: this.hasPrevious ? '#555555' : '#222222'
                  },
                  {
                    text: this.hasPrevious ? this.$round(question.general.score) : '--',
                    margin: [0, 9, 0, 4],
                    alignment: 'center',
                    fontSize: 12,
                    bold: this.hasPrevious,
                    color: '#222222'
                  },
                  {
                    text: this.hasPrevious ? this.$round(question.general.previous) : '--',
                    margin: [0, 9, 0, 4],
                    alignment: 'center',
                    fontSize: 12,
                    bold: this.hasPrevious,
                    color: '#222222'
                  },
                  {
                    value: variation,
                    text: this.hasPrevious && variation ? this.$round(variation) : '--',
                    margin: [0, 9, 0, 4],
                    alignment: 'center',
                    fontSize: 12,
                    bold: this.hasPrevious && variation,
                    color: '#222222'
                  }
                ])
              }
            })
          })
        }
      })

      const sortedRows = type === 'high'
        ? rows.sort((a, b) => Number(b[b.length - 1].value) - Number(a[a.length - 1].value)).slice(0, 6)
        : rows.sort((a, b) => Number(a[a.length - 1].value) - Number(b[b.length - 1].value)).slice(0, 6)

      if (type === 'low') {
        sortedRows.forEach(row => {
          // Hide non-negative values
          if (Number(row[3].value) >= 0) {
            row.forEach(col => {
              col.text = '--'
              col.bold = false
              col.color = '#222222'
            })
          }
        })
      }

      return sortedRows
    },
    $generateQuestionsTrend () {
      const widths = ['*', '10%', '10%', '12%']

      return [
        pdfUtils.generateTitle('Tendencias', [0, -4, 0, 0], 'before', 44, '#222222', false),
        pdfUtils.generateTitle('Tendencias por Pregunta', [0, 10, 0, 0], '', 24, '#222222', true, true),
        {
          text: 'Preguntas con tendencia positiva más alta',
          margin: [0, 10, 0, 0],
          color: '#444444',
          fontSize: 17
        },
        // * --------------------------- *
        // * HIGHER POSITIVE TREND TABLE *
        // * --------------------------- *
        {
          margin: [0, 8, 0, 0],
          color: '#222222',
          table: {
            widths,
            body: [
              // Headers
              JSON.parse(JSON.stringify(this.trendHeaders)),
              // Body
              ...this.assembleQuestionsTrendTable('high')
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
          text: 'Preguntas con tendencia negativa más baja',
          margin: [0, 20, 0, 0],
          color: '#444444',
          fontSize: 17
        },
        // * -------------------------- *
        // * LOWER NEGATIVE TREND TABLE *
        // * -------------------------- *
        {
          margin: [0, 8, 0, 0],
          color: '#222222',
          table: {
            widths,
            body: [
              // Headers
              JSON.parse(JSON.stringify(this.trendHeaders)),
              // Body
              ...this.assembleQuestionsTrendTable('low')
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
