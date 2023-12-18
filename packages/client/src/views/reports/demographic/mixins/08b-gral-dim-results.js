
import pdfUtils from '../../utils/pdf'

export default {
  methods: {
    generateDimensionsTableRows () {
      const rows = []
      Object.keys(this.answersDimension).forEach(key => {
        if (key !== 'leader') {
          const trend = this.answersDimension[key].filtered.score - this.answersDimension[key].filtered.previous
          const gap = this.answersDimension[key].filtered.score - this.answersDimension[key].general.score

          rows.push([
            {
              text: this.evaluationData.questionnaire.evaluations[key].label[this.user.lang].replace(/\((.*?)\)/g, '').replace(' *', ''),
              margin: [2, 6, 0, 0],
              color: '#444444'
            },
            {
              text: this.$round(this.answersDimension[key].filtered.score),
              fillColor: this.getFillColor(this.answersDimension[key].filtered.score),
              margin: [0, 5, 0, 0],
              alignment: 'center',
              fontSize: 12,
              bold: true,
              color: '#222222'
            },
            {
              text: this.hasPrevious ? this.$round(this.answersDimension[key].filtered.previous) : '--',
              fillColor: this.hasPrevious ? this.getFillColor(this.answersDimension[key].filtered.previous) : '',
              margin: [0, 5, 0, 0],
              alignment: 'center',
              fontSize: 12,
              bold: this.hasPrevious,
              color: '#222222'
            },
            {
              text: this.hasPrevious ? this.$round(trend) : '--',
              margin: [0, 5, 0, 0],
              alignment: 'center',
              fontSize: 12,
              bold: this.hasPrevious,
              color: '#222222'
            },
            {
              text: this.$round(this.answersDimension[key].general.score),
              fillColor: this.getFillColor(this.answersDimension[key].general.score),
              margin: [0, 5, 0, 0],
              alignment: 'center',
              fontSize: 12,
              bold: true,
              color: '#222222'
            },
            {
              text: gap ? this.$round(gap) : '--',
              margin: [0, 5.5, 0, 0],
              alignment: 'center',
              fontSize: 12,
              bold: gap,
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
          fontSize: 9.5,
          table: {
            widths: ['30%', '14%', '14%', '*', '14%', '*'],
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
                  margin: [0, 2.5, 0, 0],
                  alignment: 'center',
                  fillColor: '#9cd3ef',
                  bold: true
                },
                {
                  text: this.$t('Views.Evaluations.report.organizational.prev_score'),
                  margin: [0, 2.5, 0, 0],
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
                },
                {
                  text: 'Puntaje Organización',
                  margin: [0, 2.5, 0, 0],
                  alignment: 'center',
                  fillColor: '#9cd3ef',
                  bold: true
                },
                {
                  text: 'Brecha',
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
