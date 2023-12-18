
import pdfUtils from '../../utils/pdf'

export default {
  methods: {
    $generateDimensionOptQuestions () {
      const pages = []
      // const barsWidth = 325
      // const barsHeight = 50

      Object.keys(this.answersDimension).forEach((dimKey, dimIndex) => {
        if (dimKey !== 'leader') {
          let i = 0
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

                // Sort & assemble results
                const resultRows = []
                qOptions.sort((a, b) => Number(b.value) - Number(a.value)).forEach(x => {
                  resultRows.push(
                    {
                      text: x.text,
                      value: x.value,
                      margin: [4, 7, 0, 0],
                      color: '#777777',
                      fontSize: 8.5
                    },
                    {
                      margin: [0, 1, 440, 0],
                      color: '#111111',
                      fontSize: 9,
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

                // Render pages
                const showInToc = dimIndex === 0 && i === 0
                pages.push(
                  pdfUtils.generateTitle('Resultados preguntas descriptivas', [0, -5, 0, 0], 'before', 24, '#222222', showInToc, showInToc),
                  {
                    text: this.evaluationData.questionnaire.evaluations[dimKey].label[this.user.lang].replace(/\((.*?)\)/g, '').replace(' *', ''),
                    font: 'League Spartan',
                    color: '#222222',
                    fontSize: 24
                  },
                  {
                    text: this.evaluationData.questionnaire.evaluations[dimKey].attrs[attrKey].questions[qKey].label[this.user.lang],
                    margin: [0, 25, 0, 10],
                    color: '#666666'
                  },
                  ...JSON.parse(JSON.stringify(resultRows))
                )
                i++
              }
            })
          })
        }
      })

      return pages
    }
  }
}
