
import pdfUtils from '../../utils/pdf'

import ScoreRectBase64 from '../../base64Files/score-rect'

export default {
  methods: {
    $generateDimensionResults () {
      const maxRowsPerPage = 8
      let overalCounter = 0
      const pages = []
      let index = 0
      for (const segKey of Object.keys(this.segmentedAnswers)) {
        if (this.segmentedAnswers[segKey].count) {
          const colWidths = ['*']
          const headerCols = [{
            text: this.$t('Views.Evaluations.report.demographic.table_header'),
            margin: [10, 14, 0, 0],
            fontSize: 16,
            color: '#888888',
            border: [false]
          }]
          const scoreCols = [{
            text: this.getSegmentName(segKey),
            margin: [20, 13, 0, -1.5],
            fontSize: 17,
            color: '#666666',
            characterSpacing: 0.1,
            border: [false]
          }]
          // Dimensions Scores
          for (const dimKey of Object.keys(this.segmentedAnswers[segKey].answersDimension)) {
            colWidths.push('13%', '0.01%')
            headerCols.push({
              text: this.$t(`Views.Questionnaires.edit.d_${dimKey}`),
              margin: [0, 14, 0, 0],
              fontSize: 16,
              color: '#888888',
              alignment: 'center',
              border: [false]
            }, {
              text: '',
              border: [false]
            })
            const score = this.segmentedAnswers[segKey].answersDimension[dimKey].filtered
            scoreCols.push({
              text: this.round(score, 2),
              margin: [0, 12, 0, -2.5],
              fontSize: 21,
              alignment: 'center',
              bold: true,
              color: '#444444',
              characterSpacing: 0.2,
              border: [false, false, false, true],
              borderColor: ['#000000', '#000000', '#000000', this.getHeatMap(score)]
            }, {
              text: '',
              border: [false]
            })
          }

          if (index === 0) {
            pages.push([
              // Page Title
              pdfUtils.generateHeaderTitle(this.$t('Views.Evaluations.report.toc.dimension_results'), overalCounter === 0),
              // Headers Table
              {
                absolutePosition: { x: 68, y: 66 },
                table: {
                  widths: colWidths,
                  body: [
                    headerCols
                  ]
                }
              }
            ])
          }

          pages.push([
            // Scores Tables
            {
              image: ScoreRectBase64,
              width: 752,
              height: 84,
              margin: [20, index > 0 ? -11 : 23, -12, 0],
              alignment: 'center'
            },
            {
              margin: [20, -70, 0, 0],
              table: {
                widths: colWidths,
                body: [
                  scoreCols
                ]
              },
              layout: {
                hLineWidth: (i, node) => {
                  return (i === node.table.body.length) ? 9 : 0.1
                }
              }
            }
          ])
          index++

          // Reset page
          if (index === maxRowsPerPage) {
            index = 0
          }
          overalCounter++
        }
      }

      return pages
    }
  }
}
