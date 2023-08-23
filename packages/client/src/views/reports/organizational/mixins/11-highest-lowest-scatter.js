
import pdfUtils from '../../utils/pdf'
import ScoreRectBase64 from '../../base64Files/score-rect'

export default {
  methods: {
    getScatterData (scatterData) {
      return scatterData.map((hc, index) => {
        let hexColor
        switch (hc.dimension) {
          case 'physical':
            hexColor = this.occGreen
            break
          case 'mental':
            hexColor = this.occGrey
            break
          case 'emotional':
            hexColor = this.occRed
            break
          case 'professional':
            hexColor = this.occBlue
            break
        }

        const vName = this.answersDimension[hc.dimension].variables[hc.variable].name
        const qName = this.answersDimension[hc.dimension].variables[hc.variable].questions[hc.question].name
        const reference = this.evaluationData.questionnaire.evaluations[hc.dimension][vName][qName].reference[this.user.lang]

        const data = [
          {
            image: ScoreRectBase64,
            width: 752,
            height: 84,
            margin: [20, index > 0 ? 10 : 23, -12, 0],
            alignment: 'center'
          },
          {
            margin: [25, -92, 0, 0],
            table: {
              widths: ['12%', '*', '12%'],
              body: [
                [
                  {
                    text: this.$t(`Views.Questionnaires.edit.d_${hc.dimension}`),
                    margin: [20, 38, 0, -3],
                    fontSize: 12,
                    bold: true,
                    color: hexColor || '#51c7af',
                    border: [false]
                  },
                  {
                    text: this.truncateQuestion(reference),
                    margin: [7, 38, 0, -3],
                    fontSize: 12,
                    color: '#666666',
                    characterSpacing: 0.3,
                    border: [false]
                  },
                  {
                    text: this.round(hc.scatter),
                    margin: [0, 33, 0, -1.5],
                    fontSize: 21,
                    alignment: 'center',
                    bold: true,
                    color: '#444444',
                    characterSpacing: 0.5,
                    lineHeight: 1.20,
                    border: [false, false, false, false]
                  }
                ]
              ]
            },
            layout: {
              hLineWidth: (i, node) => {
                return (i === node.table.body.length) ? 9 : 0.1
              }
            }
          }
        ]
        return data
      })
    },
    $generateScatterRank () {
      const scores = ['highest', 'lowest']
      const pages = []

      for (const type of scores) {
        const scatterData = type === 'highest' ? this.highestScatter : this.lowestScatter

        pages.push(
          // Page Title
          pdfUtils.generateHeaderTitle(this.$t(`Views.Evaluations.report.toc.${type}_scatter`)),
          {
            margin: [40, 10, 10, -35],
            table: {
              widths: ['10%', '*', '9%'],
              body: [
                // Headers
                [
                  {
                    text: this.$t('Views.Evaluations.report.dimension'),
                    bold: true,
                    border: [false],
                    alignment: 'center'
                  },
                  {
                    text: '',
                    border: [false]
                  },
                  {
                    text: this.$t('Views.Evaluations.report.current'),
                    bold: true,
                    border: [false],
                    alignment: 'center'
                  }
                ]
              ]
            }
          },
          ...this.getScatterData(scatterData)
        )
      }

      return pages
    }
  }
}
