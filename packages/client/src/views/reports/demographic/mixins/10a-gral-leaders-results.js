
import pdfUtils from '../../utils/pdf'

export default {
  methods: {
    $generateLeadersResults () {
      const trend = this.answersDimension.leader.filtered.score - this.answersDimension.leader.filtered.previous
      const gap = this.answersDimension.leader.filtered.score - this.answersDimension.leader.general.score

      return [
        {
          ...pdfUtils.generateTitle('Resultados', [0, -4, 0, 0], 'before', 44, '#222222', false),
          pageOrientation: 'portrait'
        },
        pdfUtils.generateTitle('Resultados líderes con personas a cargo', [0, 20, -20, 0], '', 24, '#222222', true),
        pdfUtils.generateTitle(this.$t('Views.Evaluations.report.toc.dimension_results'), [0, 0, 0, 0], '', 1, '#FFFFFF', true, true),
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
                  margin: [0, 9.5, 0, 0],
                  alignment: 'center',
                  fillColor: '#9cd3ef',
                  bold: true
                }
              ],
              // Body
              [
                {
                  text: 'Líder con personas a cargo',
                  margin: [2, 7.5, 0, 3],
                  color: '#444444'
                },
                {
                  text: this.$round(this.answersDimension.leader.filtered.score),
                  fillColor: this.getFillColor(this.answersDimension.leader.filtered.score),
                  margin: [0, 7, 0, 3],
                  alignment: 'center',
                  fontSize: 12,
                  bold: true,
                  color: '#222222'
                },
                {
                  text: this.hasPrevious ? this.$round(this.answersDimension.leader.filtered.previous) : '--',
                  fillColor: this.hasPrevious ? this.getFillColor(this.answersDimension.leader.filtered.previous) : '',
                  margin: [0, 7, 0, 3],
                  alignment: 'center',
                  fontSize: 12,
                  bold: this.hasPrevious,
                  color: '#222222'
                },
                {
                  text: this.hasPrevious && trend ? this.$round(trend) : '--',
                  margin: [0, 7, 0, 3],
                  alignment: 'center',
                  fontSize: 12,
                  bold: this.hasPrevious && trend,
                  color: '#222222'
                },
                {
                  text: this.$round(this.answersDimension.leader.general.score),
                  fillColor: this.getFillColor(this.answersDimension.leader.general.score),
                  margin: [0, 7, 0, 3],
                  alignment: 'center',
                  fontSize: 12,
                  bold: true,
                  color: '#222222'
                },
                {
                  text: gap ? this.$round(gap) : '--',
                  margin: [0, 7, 0, 3],
                  alignment: 'center',
                  fontSize: 12,
                  bold: gap,
                  color: '#222222'
                }
              ]
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
        this.$generateDimDescTable(true)
      ]
    }
  }
}
