
import pdfUtils from '../../utils/pdf'

import dimResultsBase64 from '../../base64Files/individual/dimension-results'

export default {
  methods: {
    $generateDimensionsResults () {
      const rows = []
      const evaluations = this.evaluation.questionnaire.evaluations
      const answers = this.evaluated.temp.evaluations

      let dimCnt = 0
      for (const dimKey of Object.keys(evaluations)) {
        let varCnt = 0
        for (const varKey of Object.keys(evaluations[dimKey])) {
          const questionQty = Object.keys(evaluations[dimKey][varKey]).length
          const varAnswers = answers[dimCnt].variable.slice(varCnt, varCnt + questionQty)
          const sum = varAnswers.reduce((a, b) => a + b.score, 0)
          const score = sum / questionQty

          varCnt += questionQty

          const variable = this.$t(`Views.Questionnaires.edit.v_${varKey}`)

          rows.push([
            {
              text: variable,
              margin: [2, 8, 0, 0],
              fontSize: 8,
              color: '#666666',
              lineHeight: 1,
              characterSpacing: 0.3
            },
            {
              text: ' '
            },
            pdfUtils.generateScoreWithHeatMap(this.round(score, 2), this.getHeatMap(score), [0, 0, 2, 0.3]),
            // Score Bars
            pdfUtils.generateIndividualScoreBar(score, 9.5, -4)
          ])
        }
        // Dimension spacer
        rows.push([{ text: '', colSpan: 4 }])
        dimCnt++
      }

      return [
        // Page Title
        pdfUtils.generateHeaderTitle(this.$t('Views.Evaluations.report.toc.dimensions_variables_scores')),
        // base64 image
        {
          image: dimResultsBase64,
          fit: [730, 760],
          margin: [0, 30, 0, 0],
          alignment: 'center'
        },
        // Table
        {
          absolutePosition: { x: 244, y: 95 },
          table: {
            widths: ['20%', '0.9%', '6%', '68.2%'],
            heights: [1, 27.7, 27.7, 27.7, 8.5, 27.7, 27.7, 27.7, 8.4, 27.7, 27.7, 27.7, 8.4, 27.7, 27.7, 27.7, 0],
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
                  text: this.$t('Views.Evaluations.report.current'),
                  margin: [0, 4, 0, -2],
                  fontSize: 7,
                  alignment: 'center',
                  bold: true
                },
                {
                  text: ' '
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
