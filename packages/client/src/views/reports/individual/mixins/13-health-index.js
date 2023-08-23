
import pdfUtils from '../../utils/pdf'

import healthIndexBase64 from '../../base64Files/individual/health-index'

export default {
  methods: {
    $generateHealthIndex () {
      const rows = []
      const healthIndexQuestions = this.evaluation.questionsIndex.filter(x => {
        return x.index.includes('generalHealth')
      })

      // Add the questionnaire question, belonging to the health index
      healthIndexQuestions.unshift({
        idx: null,
        reference: this.healthIndexQ1
      })

      healthIndexQuestions.forEach(q => {
        let score
        if (q.idx === null) {
          score = this.healthIndexQ1Score
        } else {
          score = this.evaluated.temp.indices.find(x => x.idx === q.idx).answer
        }

        rows.push([
          {
            text: q.reference[this.lang],
            margin: [2, 6.3, 0, -0],
            fontSize: 8,
            color: '#666666',
            characterSpacing: 0.3
          },
          {
            text: ' '
          },
          pdfUtils.generateScoreWithHeatMap(this.round(score, 2), this.getHeatMap(score), [0, 3.2, 2, 1.8]),
          // Score Bars
          pdfUtils.generateIndividualScoreBar(score, 12, -2)
        ])
      })

      return [
        // Page Title
        pdfUtils.generateHeaderTitle(this.$t('Views.Evaluations.report.toc.health_index')),
        // base64 image
        {
          image: healthIndexBase64,
          fit: [730, 760],
          margin: [0, 30.6, 0, 0],
          alignment: 'center'
        },
        // Table
        {
          absolutePosition: { x: 174, y: 97 },
          table: {
            widths: ['29.5%', '0.5%', '5.3%', '60.6%'],
            heights: [1, 32, 32, 32, 32, 32, 32],
            body: [
              // Headers
              [
                {
                  text: ' ',
                  margin: [0, 0, 0, -5.5]
                },
                {
                  text: ' ',
                  margin: [0, 0, 0, -5.5]
                },
                {
                  text: this.$t('Views.Evaluations.report.current'),
                  margin: [0, 4, 0, -5.5],
                  fontSize: 7,
                  alignment: 'center',
                  bold: true
                },
                {
                  text: ' ',
                  margin: [0, 0, 0, -5.5]
                }
              ],
              // rows
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
