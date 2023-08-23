
import pdfUtils from '../../utils/pdf'

import dimResultsBase64 from '../../base64Files/dimension-results'

export default {
  methods: {
    $generateDimensionsResults () {
      const rows = []
      for (const dimKey of Object.keys(this.answersDimension)) {
        for (const varKey of Object.keys(this.answersDimension[dimKey].variables)) {
          const score = this.answersDimension[dimKey].variables[varKey].general.score
          const previous = this.answersDimension[dimKey].variables[varKey].general.previous

          const vName = this.answersDimension[dimKey].variables[varKey].name
          const variable = this.$t(`Views.Questionnaires.edit.v_${vName}`)

          rows.push([
            {
              text: variable,
              margin: [0, 8.4, 0, 0],
              fontSize: 8,
              color: '#666666',
              lineHeight: 1,
              characterSpacing: 0.3
            },
            {
              text: ' '
            },
            pdfUtils.generateScoreWithHeatMap(this.round(score, 2), this.getHeatMap(score), [0, 0, 2, 0.5]),
            pdfUtils.generateScoreWithHeatMap(!this.hasPrevious ? '--' : this.round(previous), this.getHeatMap(previous), [0, 0, 2, 0.5]),
            {
              text: !this.hasPrevious ? '--' : this.round(score - previous),
              margin: [0, 6, 0, 0],
              fontSize: 11,
              alignment: 'center',
              bold: true,
              color: '#444444',
              characterSpacing: 0.2
            },
            // Score Bars
            this.hasPrevious
              ? pdfUtils.generatePreviousScoreBar(score, previous, 7)
              : pdfUtils.generateSimpleScoreBar(score, 9.5)
          ])
        }
        // Dimension spacer
        rows.push([
          { text: '', colSpan: 6 }
        ])
      }

      return [
        // Page Title
        pdfUtils.generateHeaderTitle(this.$t('Views.Evaluations.report.toc.dimensions_variables_scores')),
        // base64 image
        {
          image: dimResultsBase64,
          fit: [721, 760],
          margin: [14, 35.3, 0, 0],
          alignment: 'right'
        },
        // Table
        {
          absolutePosition: { x: 240, y: 73.2 },
          table: {
            widths: ['21%', '0.4%', '6.2%', '6.1%', '7.3%', '55.5%'],
            heights: [1, 1, 27.5, 27.5, 27.5, 7.5, 27.5, 27.5, 27.5, 9, 27.5, 27.5, 27.5, 9, 27.5, 27.5, 27.5, 0],
            body: [
              // Headers
              [
                {
                  text: ' '
                },
                {
                  text: ' '
                },
                {
                  text: '·',
                  margin: [0, -12, 0, -40],
                  fontSize: 40,
                  color: '#445bcc',
                  alignment: 'center',
                  bold: true
                },
                {
                  text: '·',
                  margin: [0, -12, 0, -40],
                  fontSize: 40,
                  alignment: 'center',
                  bold: true
                },
                {
                  text: ' '
                },
                {
                  text: ' '
                }
              ],
              [
                {
                  text: ' ',
                  margin: [0, 0, 0, -3]
                },
                {
                  text: ' ',
                  margin: [0, 0, 0, -3]
                },
                {
                  text: this.$t('Views.Evaluations.report.current'),
                  margin: [0, 4, 0, -3],
                  fontSize: 7,
                  alignment: 'center',
                  bold: true
                },
                {
                  text: this.$t('Views.Evaluations.report.organizational.prev_score'),
                  margin: [0, 0, 0, -3],
                  fontSize: 7,
                  alignment: 'center',
                  bold: true
                },
                {
                  text: this.$t('Views.Evaluations.report.organizational.trend'),
                  margin: [0, 4, 0, -3],
                  fontSize: 7,
                  alignment: 'center',
                  bold: true
                },
                {
                  text: ' ',
                  margin: [0, 0, 0, -3]
                }
              ],
              // Variables rows
              ...rows
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
