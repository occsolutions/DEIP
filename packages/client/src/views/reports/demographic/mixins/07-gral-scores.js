
import pdfUtils from '../../utils/pdf'

import ScoreRectBase64 from '../../base64Files/score-rect'

export default {
  methods: {
    truncateSegmentName (str, limit = 44) {
      return str.length > limit ? str.slice(0, limit) + '...' : str
    },
    getSegmentName (segmentId, limit) {
      let name = ''
      const foundSegment = this.segments.find(x => x.id === Number(segmentId))
      if (foundSegment) {
        if (this.criteria.type === 'segmentation') {
          name = foundSegment.trans[this.user.lang].label
        }
        if (this.criteria.type === 'demographic') {
          let lowRng, highRng, min
          switch (this.criteria.code) {
            case 'age':
            case 'antiquity':
              min = this.criteria.code === 'age' ? 25 : 6
              lowRng = foundSegment.range[0] < 1 ? min : foundSegment.range[0]
              highRng = foundSegment.range[1] < 1 ? min : foundSegment.range[1]
              name = this.$t(
                `Views.Evaluations.stepEvaluatedSelection.ranges.${foundSegment.label}`,
                { n: lowRng, p: highRng }
              )
              break
            case 'academicDegree':
            case 'country':
            case 'jobTypes':
              name = foundSegment.translate.label
              break
            case 'charge':
            case 'gender':
            case 'optionalDemo1':
            case 'optionalDemo2':
              name = foundSegment.translations.find(x => x.lang === this.user.lang).label
              break
            case 'departments':
              name = foundSegment.translate.label
              break
            case 'headquarter':
              name = foundSegment.name
              break
          }
        }
      }

      return this.truncateSegmentName(name, limit)
    },
    $generateGeneralScores () {
      const maxRowsPerPage = 8
      let overalCounter = 0
      const pages = []
      let index = 0
      for (const segKey of Object.keys(this.segmentedAnswers)) {
        if (this.segmentedAnswers[segKey].count) {
          let score = 0
          let dimCnt = 0
          // Calc Average
          for (const dimKey of Object.keys(this.segmentedAnswers[segKey].answersDimension)) {
            score += this.segmentedAnswers[segKey].answersDimension[dimKey].filtered
            dimCnt++
          }

          if (index === 0) {
            pages.push([
              // Page Title
              pdfUtils.generateHeaderTitle(this.$t('Views.Evaluations.report.toc.general_scores'), overalCounter === 0),
              // Headers Table
              {
                absolutePosition: { x: 68, y: 66 },
                table: {
                  widths: ['86%', '14%'],
                  body: [
                    [
                      {
                        text: this.$t('Views.Evaluations.report.demographic.table_header'),
                        margin: [10, 14, 0, 0],
                        fontSize: 16,
                        color: '#888888',
                        border: [false]
                      },
                      {
                        text: this.$t('Views.Evaluations.report.gral_score'),
                        margin: [0, 14, 0, 0],
                        fontSize: 16,
                        color: '#888888',
                        alignment: 'center',
                        border: [false]
                      }
                    ]
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
                widths: ['86%', '14%'],
                body: [
                  [
                    {
                      text: this.getSegmentName(segKey),
                      margin: [20, 13, 0, -1.5],
                      fontSize: 17,
                      color: '#666666',
                      characterSpacing: 0.1,
                      border: [false]
                    },
                    {
                      text: this.round((score / dimCnt), 2),
                      margin: [0, 12, 0, -2.5],
                      fontSize: 21,
                      alignment: 'center',
                      bold: true,
                      color: '#444444',
                      characterSpacing: 0.2,
                      border: [false, false, false, true],
                      borderColor: ['#000000', '#000000', '#000000', this.getHeatMap((score / dimCnt))]
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
