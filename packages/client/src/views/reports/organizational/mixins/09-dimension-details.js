
import pdfUtils from '../../utils/pdf'

import physicalDetailBase64 from '../../base64Files/dimension-detail1'
import mentalDetailBase64 from '../../base64Files/dimension-detail2'
import emotionalDetailBase64 from '../../base64Files/dimension-detail3'
import professionalDetailBase64 from '../../base64Files/dimension-detail4'

export default {
  methods: {
    $generateDimensionDetail () {
      const pages = []
      for (const dimKey of Object.keys(this.answersDimension)) {
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
        for (const varKey of Object.keys(this.answersDimension[dimKey].variables)) {
          for (const qKey of Object.keys(this.answersDimension[dimKey].variables[varKey].questions)) {
            const score = this.answersDimension[dimKey].variables[varKey].questions[qKey].general.score
            const previous = this.answersDimension[dimKey].variables[varKey].questions[qKey].general.previous

            const vName = this.answersDimension[dimKey].variables[varKey].name
            const qName = this.answersDimension[dimKey].variables[varKey].questions[qKey].name

            const reference = this.evaluationData.questionnaire.evaluations[dimKey][vName][qName].reference[this.user.lang]

            // Keep the questionnaire question, belonging to the health index
            if (this.evaluationData.questionnaire.evaluations[dimKey][vName][qName].index.includes('generalHealth')) {
              this.healthIndexQ1 = reference
            }
            // Keep the questionnaire question, belonging to the individual burnout index
            if (this.evaluationData.questionnaire.evaluations[dimKey][vName][qName].index.includes('burnoutIndividual')) {
              this.burnoutIndQs.push(reference)
            }

            rows.push([
              {
                text: reference,
                margin: [2, 6, 2, 0],
                fontSize: 8,
                color: '#666666',
                lineHeight: 1
              },
              {
                text: ' '
              },
              pdfUtils.generateScoreWithHeatMap(this.round(score, 2), this.getHeatMap(score), [0, 3.3, 0, 0], -2),
              pdfUtils.generateScoreWithHeatMap(!this.hasPrevious ? '--' : this.round(previous), this.getHeatMap(previous), [0, 3.3, 0, 0], -2),
              {
                text: !this.hasPrevious ? '--' : this.round(score - previous),
                margin: [0, 9.5, 0, 0],
                fontSize: 11,
                alignment: 'center',
                bold: true,
                color: '#444444',
                characterSpacing: 0.2
              },
              // Score Bars
              this.hasPrevious
                ? pdfUtils.generatePreviousScoreBar(score, previous, 9.5, -3.2)
                : pdfUtils.generateSimpleScoreBar(score, 12, -3.2)
            ])
          }
          // Variable spacer
          rows.push([
            { text: '', colSpan: 6 }
          ])
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
            absolutePosition: { x: 170, y: 73.2 },
            table: {
              widths: ['30.6%', '0.5%', '6.4%', '6%', '6%', '47.4%'],
              heights: [1, 1, 29.5, 30, 30.5, 30, 5.5, 30, 30, 30, 30, 7, 30, 30.5, 30.5, 30.5, 0],
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
        )
      }

      return pages
    }
  }
}
