
import pdfUtils from '../../utils/pdf'

export default {
  methods: {
    assembleDimTrendTable () {
      const rows = []
      Object.keys(this.answersDimension).forEach(key => {
        if (key !== 'leader') {
          const variation = this.answersDimension[key].filtered.score - this.answersDimension[key].filtered.previous
          const gap = this.answersDimension[key].filtered.score - this.answersDimension[key].general.score

          rows.push([
            {
              text: this.hasPrevious ? this.evaluationData.questionnaire.evaluations[key].label[this.user.lang].replace(/\((.*?)\)/g, '').replace(' *', '') : '--',
              margin: [2, 9, 0, 0],
              color: this.hasPrevious ? '#555555' : '#222222'
            },
            {
              text: this.hasPrevious ? this.$round(this.answersDimension[key].filtered.score) : '--',
              margin: [0, 9, 0, 4],
              alignment: 'center',
              fontSize: 12,
              bold: this.hasPrevious,
              color: '#222222'
            },
            {
              text: this.hasPrevious ? this.$round(this.answersDimension[key].filtered.previous) : '--',
              margin: [0, 9, 0, 4],
              alignment: 'center',
              fontSize: 12,
              bold: this.hasPrevious,
              color: '#222222'
            },
            {
              text: this.hasPrevious && variation ? this.$round(variation) : '--',
              margin: [0, 9, 0, 4],
              alignment: 'center',
              fontSize: 12,
              bold: this.hasPrevious && variation,
              color: '#222222'
            },
            {
              text: this.hasPrevious ? this.$round(this.answersDimension[key].general.score) : '--',
              margin: [0, 9, 0, 4],
              alignment: 'center',
              fontSize: 12,
              bold: this.hasPrevious,
              color: '#222222'
            },
            {
              text: this.hasPrevious && gap ? this.$round(gap) : '--',
              margin: [0, 9, 0, 4],
              alignment: 'center',
              fontSize: 12,
              bold: this.hasPrevious && gap,
              color: '#222222'
            }
          ])
        }
      })

      return rows.sort((a, b) => Number(b[3].text) - Number(a[3].text))
    },
    $generateDimensionTrend () {
      return [
        pdfUtils.generateTitle('Tendencias', [0, -4, 0, 0], 'before', 44, '#222222', true),
        pdfUtils.generateTitle('Tendencias por Dimensión', [0, 10, 0, 0], '', 24, '#222222', true, true),
        {
          margin: [0, 8, 0, 0],
          color: '#222222',
          fontSize: 9.5,
          table: {
            widths: ['*', '11%', '11%', '10%', '14%', '10%'],
            body: [
              // Headers
              [
                {
                  text: this.$t('Views.Evaluations.report.dimension'),
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
                  text: 'Variación',
                  margin: [0, 10, 0, 0],
                  alignment: 'center',
                  fillColor: '#9cd3ef',
                  bold: true
                },
                {
                  text: 'Puntaje Organización',
                  margin: [0, 2, 0, 0],
                  alignment: 'center',
                  fillColor: '#9cd3ef',
                  bold: true
                },
                {
                  text: 'Brecha',
                  margin: [0, 10, 0, 0],
                  alignment: 'center',
                  fillColor: '#9cd3ef',
                  bold: true
                }
              ],
              // Body
              ...this.assembleDimTrendTable()
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
