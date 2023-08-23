
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
          absolutePosition: { x: 68, y: 74 },
          table: {
            widths: ['60%', '14%', '13%', '13%'],
            body: [
              [
                {
                  text: '',
                  border: [false]
                },
                {
                  text: this.$t('Views.Evaluations.report.current'),
                  margin: [0, 14, 0, 0],
                  fontSize: 11,
                  alignment: 'center',
                  bold: true,
                  border: [false]
                },
                {
                  text: this.$t('Views.Evaluations.report.organizational.prev_score'),
                  margin: [0, 14, 0, 0],
                  fontSize: 11,
                  alignment: 'center',
                  bold: true,
                  border: [false]
                },
                {
                  text: this.$t('Views.Evaluations.report.organizational.trend'),
                  margin: [0, 14, 0, 0],
                  fontSize: 11,
                  alignment: 'center',
                  bold: true,
                  border: [false]
                }
              ],
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
                  text: this.round(this.gralScore, 2),
                  margin: [0, 11, 0, -1],
                  fontSize: 21,
                  alignment: 'center',
                  bold: true,
                  color: '#444444',
                  characterSpacing: 0.2,
                  border: [false, false, false, true],
                  borderColor: ['#000000', '#000000', '#000000', this.getHeatMap(this.gralScore)]
                },
                {
                  text: !this.hasPrevious ? '--' : this.round(this.gralPrevScore),
                  margin: [0, 11, 0, -1],
                  fontSize: 21,
                  alignment: 'center',
                  bold: true,
                  color: '#444444',
                  characterSpacing: 0.2,
                  border: [false, false, false, true],
                  borderColor: ['#000000', '#000000', '#000000', this.getHeatMap(this.gralPrevScore)]
                },
                {
                  text: !this.hasPrevious ? '--' : this.round(this.gralScore - this.gralPrevScore),
                  margin: [0, 11, 0, -1],
                  fontSize: 21,
                  alignment: 'center',
                  bold: true,
                  color: '#444444',
                  characterSpacing: 0.2,
                  border: [false]
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
          margin: [30, 14, 0, -18],
          fontSize: 17,
          color: '#666666',
          characterSpacing: 0.4
        },
        {
          image: this.dimensionsResultsPie,
          fit: [370, 370],
          margin: [0, 0, 0, 0],
          alignment: 'center'
        },
        {
          columns: [
            { width: '86.8%', text: '' },
            { width: '1.3%', text: '---', color: this.occBlue, background: this.occBlue },
            { width: '1.3%', text: '---', color: this.occRed, background: this.occRed },
            { width: '1.3%', text: '---', color: this.occGreen, background: this.occGreen },
            { width: '1.3%', text: '---', color: this.occGrey, background: this.occGrey },
            { width: '1%', text: '\u0020' },
            { width: '7%', text: this.$t('Views.Evaluations.report.current'), margin: [0, 1, 0, 0] }
          ],
          margin: [0, -170, 0, 4]
        },
        this.hasPrevious ? {
          columns: [
            { width: '86.8%', text: '' },
            { width: '5.2%', text: '-----------', color: '#555555', background: '#555555', fontSize: 12.5, lineHeight: 1 },
            { width: '1%', text: '\u0020' },
            { width: '7%', text: this.$t('Views.Evaluations.report.organizational.previous'), margin: [0, 1, 0, 0] }
          ]
        } : ''
      ]
    }
  }
}
