
import pdfUtils from '../../utils/pdf'

export default {
  methods: {
    generateDimensionsTableRows () {
      const rows = []
      Object.keys(this.answersDimension).forEach(key => {
        if (key !== 'leader') {
          const trend = this.answersDimension[key].general.score - this.answersDimension[key].general.previous
          rows.push([
            {
              text: this.evaluationData.questionnaire.evaluations[key].label[this.user.lang].replace(/\((.*?)\)/g, '').replace(' *', ''),
              margin: [2, 3.5, 0, 0],
              color: '#444444'
            },
            {
              text: this.$round(this.answersDimension[key].general.score),
              fillColor: this.getFillColor(this.answersDimension[key].general.score),
              margin: [0, 3.5, 0, 0],
              alignment: 'center',
              fontSize: 12,
              bold: true,
              color: '#222222'
            },
            {
              text: this.hasPrevious ? this.$round(this.answersDimension[key].general.previous) : '--',
              fillColor: this.hasPrevious ? this.getFillColor(this.answersDimension[key].general.previous) : '',
              margin: [0, 3.5, 0, 0],
              alignment: 'center',
              fontSize: 12,
              bold: this.hasPrevious,
              color: '#222222'
            },
            {
              text: this.hasPrevious && trend ? this.$round(trend) : '--',
              margin: [0, 3.5, 0, 0],
              alignment: 'center',
              fontSize: 12,
              bold: this.hasPrevious && trend,
              color: '#222222'
            }
          ])
        }
      })

      return rows
    },
    $generateDimensionsResults () {
      return [
        pdfUtils.generateTitle('Resultados', [0, -4, 0, 0], 'before', 44, '#222222', false),
        pdfUtils.generateTitle(this.$t('Views.Evaluations.report.toc.dimension_results'), [0, 20, 0, 0], '', 24, '#222222', true, true),
        // * ------------------------ *
        // * DIMENSIONS RESULTS TABLE *
        // * ------------------------ *
        {
          margin: [0, 10, 0, 0],
          color: '#222222',
          table: {
            widths: ['44%', '16%', '18%', '*'],
            body: [
              // Headers
              [
                {
                  text: this.$t('Views.Evaluations.report.dimension'),
                  margin: [2, 9.5, 0, 0],
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
                  margin: [0, 9.5, 0, 0],
                  alignment: 'center',
                  fillColor: '#9cd3ef',
                  bold: true
                }
              ],
              // Body
              ...this.generateDimensionsTableRows()
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
        this.$generateDimDescTable()
      ]
    }
  }
}
