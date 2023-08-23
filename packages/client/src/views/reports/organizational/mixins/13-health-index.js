
import pdfUtils from '../../utils/pdf'

import healthIndexBase64 from '../../base64Files/health-index'

export default {
  methods: {
    $generateHealthIndex () {
      const rows = []
      const indexAnswers = this.indicesAnswers.generalHealth.answers
      for (const indexKey of Object.keys(indexAnswers)) {
        const score = indexAnswers[indexKey].general.score
        const previous = indexAnswers[indexKey].general.previous

        let reference
        if (indexAnswers[indexKey].idx === null) {
          reference = this.healthIndexQ1
        } else {
          const foundIndex = this.evaluationData.questionsIndex.find(x => x.idx === indexAnswers[indexKey].idx)
          reference = foundIndex.reference[this.user.lang]
        }

        rows.push([
          {
            text: reference,
            margin: [2, 6, 2, 0],
            fontSize: 8,
            color: '#666666',
            lineHeight: 1,
            characterSpacing: 0.2
          },
          {
            text: ' '
          },
          pdfUtils.generateScoreWithHeatMap(this.round(score, 2), this.getHeatMap(score), [0, 3.3, 0, 1.5], !this.hasPrevious ? -4 : -2.2),
          pdfUtils.generateScoreWithHeatMap(!this.hasPrevious ? '--' : this.round(previous), this.getHeatMap(previous), [0, 3.3, 0, 1.5], -2.2),
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
            ? pdfUtils.generatePreviousScoreBar(score, previous, 9.5, -2.6)
            : pdfUtils.generateSimpleScoreBar(score, 12, -2.6)
        ])
      }

      return [
        // Page Title
        pdfUtils.generateHeaderTitle(this.$t('Views.Evaluations.report.toc.health_index')),
        // base64 image
        {
          image: healthIndexBase64,
          fit: [730, 760],
          margin: [0, 31, 0, 0],
          alignment: 'center'
        },
        // Table
        {
          absolutePosition: { x: 170, y: 73.2 },
          table: {
            widths: ['30.6%', '0.4%', '5.5%', '5.8%', '5.8%', '55%'],
            heights: [1, 1, 30, 32.5, 31.5, 31.7, 31.7, 31.5],
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
