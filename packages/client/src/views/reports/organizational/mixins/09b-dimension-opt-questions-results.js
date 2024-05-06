
import pdfUtils from '../../utils/pdf'

export default {
  methods: {
    getDimAndQuestion (col, isSecondColInLeaders) {
      return [
        {
          text: isSecondColInLeaders ? '' : col.dim,
          font: 'League Spartan',
          color: '#222222',
          fontSize: 22
        },
        {
          text: col.q,
          margin: [0, isSecondColInLeaders ? 50 : 25, 40, 10],
          color: '#666666',
          fontSize: 9
        },
        ...JSON.parse(JSON.stringify(col.graph))
      ]
    },
    $generateDimensionOptQuestions () {
      const pages = []
      const cols = []

      Object.keys(this.answersDimension).forEach((dimKey, dimIndex) => {
        if (dimKey !== 'leader') {
          Object.keys(this.answersDimension[dimKey].attrs).forEach(attrKey => {
            Object.keys(this.answersDimension[dimKey].attrs[attrKey].questions).forEach(qKey => {
              const question = this.answersDimension[dimKey].attrs[attrKey].questions[qKey]
              if (question.qType === 'options') {
                // Loop options
                const qOptions = []
                this.evaluationData.questionnaire.evaluations[dimKey].attrs[attrKey].questions[qKey].options.forEach(opt => {
                  const optResponseCount = this.answersDimension[dimKey].attrs[attrKey].questions[qKey].general.scores[0][opt.value] || 0
                  const responseRate = (100 * optResponseCount) / this.completedPolls
                  qOptions.push(
                    {
                      text: opt.label[this.user.lang],
                      value: responseRate
                    }
                  )
                })

                // Sort & assemble results (Bars)
                const resultRows = []
                qOptions.sort((a, b) => Number(b.value) - Number(a.value)).forEach(x => {
                  resultRows.push(
                    {
                      text: x.text,
                      value: x.value,
                      margin: [4, 7, 0, 0],
                      color: '#777777',
                      fontSize: 8
                    },
                    {
                      margin: [0, 1, 100, 0],
                      color: '#111111',
                      fontSize: 8,
                      lineHeight: 0.9,
                      table: {
                        widths: [`${x.value}%`, '*'],
                        heights: [4],
                        body: [
                          [
                            {
                              text: '',
                              margin: [0, 0, 0, 0],
                              fillColor: '#d6dcfc'
                            },
                            {
                              text: `${this.$round(x.value)}%`,
                              margin: [0, 0, 0, 0],
                              bold: true
                            }
                          ]
                        ]
                      },
                      layout: 'noBorders'
                    }
                  )
                })

                cols.push({
                  dimIdx: dimIndex,
                  dim: this.evaluationData.questionnaire.evaluations[dimKey].label[this.user.lang].replace(/\((.*?)\)/g, '').replace(' *', ''),
                  q: this.evaluationData.questionnaire.evaluations[dimKey].attrs[attrKey].questions[qKey].label[this.user.lang],
                  graph: JSON.parse(JSON.stringify(resultRows))
                })
              }
            })
          })
        }
      })

      // Render pages
      cols.forEach((col, i) => {
        const isOdd = i % 2 === 0
        const showInToc = col.dimIdx === 0 && i === 0

        if (isOdd) {
          pages.push([
            pdfUtils.generateTitle('Resultados Preguntas Descriptivas', [0, -5, 0, 0], 'before', 22, '#222222', showInToc, showInToc),
            {
              columns: [
                [...this.getDimAndQuestion(col)],
                [/* Empty if isOdd */]
              ]
            }
          ])
        } else {
          // Fill previous second column
          pages[pages.length - 1][1].columns[1].push([
            ...this.getDimAndQuestion(col)
          ])
        }
      })

      return pages
    }
  }
}
