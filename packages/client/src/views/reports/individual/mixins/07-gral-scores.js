
import pdfUtils from '../../utils/pdf'

import ScoreRectBase64 from '../../base64Files/score-rect'

export default {
  methods: {
    $generateGeneralScores () {
      return [
        // Page Title
        pdfUtils.generateHeaderTitle(this.$t('Views.Evaluations.report.toc.general_scores')),
        // Example
        {
          image: ScoreRectBase64,
          width: 752,
          height: 84,
          margin: [20, 23, -12, 0],
          alignment: 'center'
        },
        {
          margin: [20, -70, 4, 0],
          table: {
            widths: ['87%', '13%'],
            body: [
              [
                {
                  text: this.$t('Views.Evaluations.report.gral_score'),
                  margin: [20, 13, 0, -3],
                  fontSize: 18,
                  color: '#666666',
                  characterSpacing: 0.4,
                  border: [false]
                },
                {
                  text: this.gralScore,
                  margin: [0, 11, 0, -1],
                  fontSize: 21,
                  alignment: 'center',
                  bold: true,
                  color: '#444444',
                  characterSpacing: 0.2,
                  border: [false, false, false, true],
                  borderColor: ['#000000', '#000000', '#000000', this.getHeatMap(this.gralScore)]
                }
              ]
            ]
          },
          layout: {
            hLineWidth: (i, node) => {
              return (i === node.table.body.length) ? 9 : 0.1
            }
          }
        },
        {
          text: this.$t('Views.Evaluations.report.dimension_results'),
          margin: [30, 28, 0, -18],
          fontSize: 17,
          color: '#666666',
          characterSpacing: 0.4
        },
        {
          image: this.dimensionsResultsPie,
          fit: [370, 370],
          margin: [0, 0, 0, 0],
          alignment: 'center'
        }
      ]
    }
  }
}
