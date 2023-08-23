
import pdfUtils from '../../utils/pdf'
import ScoreRectBase64 from '../../base64Files/score-rect'

export default {
  methods: {
    truncateQuestion (str, limit = 70) {
      return str.length > limit ? str.slice(0, limit) + '...' : str
    },
    getScoresData (scoresData) {
      return scoresData.map((hc, index) => {
        let firstColumnText, marginTop
        if (hc.type === 'evaluation') {
          firstColumnText = this.$t(`Views.Questionnaires.edit.d_${hc.dimension}`)
          marginTop = 38
        } else {
          firstColumnText = this.$t(`Views.Indices.list.i_${hc.index}`)
          marginTop = 29
        }

        const data = [
          {
            image: ScoreRectBase64,
            width: 752,
            height: 84,
            margin: [20, index > 0 ? 10 : 23, -12, 0],
            alignment: 'center'
          },
          {
            margin: [25, -92, 4.6, 0],
            table: {
              widths: ['15%', '*', '10%'],
              body: [
                [
                  {
                    text: firstColumnText,
                    margin: [20, marginTop, 0, -3],
                    fontSize: 12,
                    bold: true,
                    color: this.colors[hc.dimension] || '#51c7af',
                    border: [false]
                  },
                  {
                    text: this.truncateQuestion(hc.type === 'evaluation' ? hc.reference : hc.ref),
                    margin: [7, 38, 0, -3],
                    fontSize: 12,
                    color: '#666666',
                    characterSpacing: 0.3,
                    border: [false]
                  },
                  {
                    text: hc.score,
                    margin: [0, 33, 0, -1.3],
                    fontSize: 21,
                    alignment: 'center',
                    bold: true,
                    color: '#444444',
                    characterSpacing: 0.5,
                    lineHeight: 1.20,
                    border: [false, false, false, true],
                    borderColor: ['#000000', '#000000', '#000000', this.getHeatMap(hc.score)]
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
    $generateScores (scoresData, title) {
      return [
        // Page Title
        pdfUtils.generateHeaderTitle(this.$t(`Views.Evaluations.report.toc.${title}`)),
        {
          margin: [40, 10, 10, -35],
          table: {
            widths: ['10%', '*', '10%'],
            body: [
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
        ...this.getScoresData(scoresData)
      ]
    }
  }
}
