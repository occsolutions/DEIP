
import pdfUtils from '../../utils/pdf'

import physicalDetailBase64 from '../../base64Files/individual/dimension-detail1'
import mentalDetailBase64 from '../../base64Files/individual/dimension-detail2'
import emotionalDetailBase64 from '../../base64Files/individual/dimension-detail3'
import professionalDetailBase64 from '../../base64Files/individual/dimension-detail4'

export default {
  methods: {
    $generateDimensionDetail () {
      const pages = []
      const evaluations = this.evaluation.questionnaire.evaluations
      const answers = this.evaluated.temp.evaluations

      let dimCnt = 0
      for (const dimKey of Object.keys(evaluations)) {
        let backgroundImg
        switch (dimKey) {
          case 'physical': backgroundImg = physicalDetailBase64
            break
          case 'mental': backgroundImg = mentalDetailBase64
            break
          case 'emotional': backgroundImg = emotionalDetailBase64
            break
          case 'professional': backgroundImg = professionalDetailBase64
            break
        }

        const rows = []
        let varCnt = 0
        for (const varKey of Object.keys(evaluations[dimKey])) {
          for (const qKey of Object.keys(evaluations[dimKey][varKey])) {
            const reference = evaluations[dimKey][varKey][qKey].reference[this.lang]
            const score = answers[dimCnt].variable[varCnt].score

            // Keep the questionnaire question, belonging to the health index
            if (evaluations[dimKey][varKey][qKey].index.includes('generalHealth')) {
              this.healthIndexQ1 = evaluations[dimKey][varKey][qKey].reference
              this.healthIndexQ1Score = score
            }

            rows.push([
              {
                text: reference,
                margin: [2, 5.5, 2, 0],
                fontSize: 8,
                color: '#666666',
                characterSpacing: 0.3
              },
              {
                text: ' '
              },
              pdfUtils.generateScoreWithHeatMap(this.round(score, 2), this.getHeatMap(score), [0, 2.6, 2, 1.1]),
              // Score Bars
              pdfUtils.generateIndividualScoreBar(score, 11.5, -2.8)
            ])
            varCnt++
          }
          // Variable spacer
          rows.push([{ text: '', colSpan: 4 }])
        }

        pages.push(
          // Page Title
          pdfUtils.generateHeaderTitle(this.$t(`Views.Evaluations.report.toc.detailed_scores_dim_${dimKey}`)),
          // base64 image
          {
            image: backgroundImg,
            fit: [730, 760],
            margin: [0, 30, 0, 0],
            alignment: 'center'
          },
          // Table
          {
            absolutePosition: { x: 174, y: 97 },
            table: {
              widths: ['29.5%', '0.5%', '5.3%', '60.6%'],
              heights: [1, 29.5, 30.5, 30.5, 30, 5, 29, 30.1, 30, 30, 7, 30, 30.5, 30.5, 30.5, 0],
              body: [
                // Headers
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
        )
        dimCnt++
      }

      return pages
    }
  }
}
