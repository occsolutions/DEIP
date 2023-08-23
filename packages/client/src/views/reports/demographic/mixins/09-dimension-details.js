
import pdfUtils from '../../utils/pdf'

import ScoreBarBase64 from '../../base64Files/demographic/dimension-detail'

export default {
  methods: {
    $generateDimensionDetail () {
      const maxRowsPerPage = 12
      const pages = []
      for (const dimKey of Object.keys(this.answersDimension)) {
        for (const varKey of Object.keys(this.answersDimension[dimKey].variables)) {
          const variable = this.answersDimension[dimKey].variables[varKey]
          const pgTitle = `${this.$t(`Views.Evaluations.report.toc.detailed_scores_dim_${dimKey}`)} / ${this.$t('Views.Evaluations.report.demographic.page_header')} ${this.$t(`Views.Questionnaires.edit.v_${variable.name}`)}`

          const headerColsWidths = ['32.3%', '0.02%']
          const headerCols = [{
            text: this.$t('Views.Evaluations.report.demographic.table_header'),
            margin: [10, 18, 0, 0],
            fontSize: 10,
            bold: true,
            color: '#222222',
            border: [false]
          }, {
            text: '',
            border: [false]
          }]

          // Loop variables questions for headers
          for (const qKey of Object.keys(variable.questions)) {
            const questionName = variable.questions[qKey].name
            headerColsWidths.push('*')
            headerCols.push({
              text: this.evaluationData.questionnaire.evaluations[dimKey][variable.name][questionName].reference[this.user.lang],
              margin: [0, 14, 0, 0],
              fontSize: 6.5,
              color: '#888888',
              alignment: 'center',
              border: [false]
            })
          }

          pages.push([
            // Page Title
            pdfUtils.generateHeaderTitle(pgTitle, true, 630),
            // Headers Table
            {
              absolutePosition: { x: 58, y: 66 },
              table: {
                widths: headerColsWidths,
                body: [
                  headerCols
                ]
              }
            }
          ])

          // Loop segments
          let index = 0
          let isNewPageOfSameVariable = false
          let segmentWithScoresCnt = 0
          for (const segKey of Object.keys(this.segmentedAnswers)) {
            if (this.segmentedAnswers[segKey].count) {
              const segmentVariable = this.segmentedAnswers[segKey].answersDimension[dimKey].variables[varKey]
              const colWidths = ['36.8%', '0.02%']
              const scoreCols = [{
                text: this.getSegmentName(segKey, 60),
                margin: [20, 10, 0, -1],
                fontSize: 9,
                color: '#666666',
                characterSpacing: 0.1,
                border: [false]
              }, {
                text: '',
                border: [false]
              }]

              // Loop segment questions for scores
              for (const qKey of Object.keys(segmentVariable.questions)) {
                const score = segmentVariable.questions[qKey].filtered
                colWidths.push('*', '7%', '*')
                scoreCols.push({
                  text: '',
                  border: [false]
                }, {
                  text: this.round(score, 2),
                  margin: [0, 9, 0, -1.4],
                  fontSize: 12,
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

              if (isNewPageOfSameVariable) {
                pages.push([
                  // Page Title
                  pdfUtils.generateHeaderTitle(pgTitle, false, 630)
                ])
              }

              pages.push([
                // Scores Tables
                {
                  image: ScoreBarBase64,
                  width: 750,
                  margin: [20, segmentWithScoresCnt > 0 ? -2 : 21, -12, 0],
                  alignment: 'center'
                },
                {
                  margin: [9, -42, 0, 0],
                  table: {
                    widths: colWidths,
                    body: [
                      scoreCols
                    ]
                  },
                  layout: {
                    hLineWidth: (i, node) => {
                      return (i === node.table.body.length) ? 4 : 0.1
                    }
                  }
                }
              ])
              segmentWithScoresCnt++
            }
            index++

            // Reset page
            if (index === maxRowsPerPage) {
              isNewPageOfSameVariable = true
              index = 0
            } else {
              isNewPageOfSameVariable = false
            }
          }
        }
      }

      return pages
    }
  }
}
