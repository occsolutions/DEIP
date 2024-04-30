
import pdfUtils from '../../utils/pdf'

export default {
  methods: {
    $generateLeadersOptQuestions () {
      const pages = []
      const cols = []

      Object.keys(this.answersDimension.leader).forEach(qKey => {
        const question = this.answersDimension.leader[qKey]
        if (question.qType === 'options') {
          // Loop options
          const qOptions = []
          this.evaluationData.questionnaire.evaluations.leader[qKey].options.forEach(opt => {
            const optResponseCount = this.answersDimension.leader[qKey].filtered.scores[0][opt.value] || 0
            const responseRate = (100 * optResponseCount) / (this.completedLeaders || 1)
            qOptions.push({
              text: opt.label[this.user.lang],
              value: responseRate
            })
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
            dim: this.$t('Views.Evaluations.stepQuestion.leader'),
            q: this.evaluationData.questionnaire.evaluations.leader[qKey].label[this.user.lang],
            graph: JSON.parse(JSON.stringify(resultRows))
          })
        }
      })

      // Render pages
      cols.forEach((col, i) => {
        const isOdd = i % 2 === 0
        const showInToc = i === 0

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
            ...this.getDimAndQuestion(col, 1)
          ])
        }
      })

      return pages
    }
  }
}
