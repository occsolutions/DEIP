
import pdfUtils from '../../utils/pdf'

export default {
  methods: {
    $generateLeadersDetails () {
      const rows = []
      let i = 0
      let cntNoOptType = 0
      // First: count how many questions of type closed & likert
      Object.keys(this.answersDimension.leader).forEach(qKey => {
        if (qKey !== 'general') {
          const question = this.answersDimension.leader[qKey]
          if (question.qType !== 'options') {
            cntNoOptType++
          }
        }
      })
      // Second: render rows
      Object.keys(this.answersDimension.leader).forEach(qKey => {
        if (qKey !== 'general') {
          const question = this.answersDimension.leader[qKey]
          if (question.qType !== 'options') {
            const trend = question.general.score - question.general.previous
            // const questionnaireAttrKey = attrKey.replace(/_([^_]*)$/, '$1')
            // const parts = qKey.split('_')
            // const questionnaireQuestionKey = `${parts[0]}_${parts[1]}${parts[2]}_${parts[3]}`

            // Assemble questions rows
            rows.push([
              i === 0 ? {
                text: 'Líder con personas a cargo',
                margin: [7, 14, 0, 8],
                fontSize: 10.5,
                rowSpan: cntNoOptType,
                bold: true,
                color: '#222222'
              } : '',
              {
                text: this.evaluationData.questionnaire.evaluations.leader[qKey].label[this.user.lang],
                margin: [2, 9, 0, 4],
                fontSize: 8,
                color: '#555555'
              },
              {
                text: this.$round(question.general.score),
                fillColor: this.getFillColor(question.general.score),
                margin: [0, 14, 0, 8],
                alignment: 'center',
                fontSize: 12,
                bold: true,
                color: '#222222'
              },
              {
                text: this.hasPrevious ? this.$round(question.general.previous) : '--',
                fillColor: this.hasPrevious ? this.getFillColor(question.general.previous) : '',
                margin: [0, 14, 0, 8],
                alignment: 'center',
                fontSize: 12,
                bold: this.hasPrevious,
                color: '#222222'
              },
              {
                text: this.hasPrevious ? this.$round(trend) : '--',
                margin: [0, 14, 0, 8],
                alignment: 'center',
                fontSize: 12,
                bold: this.hasPrevious,
                color: '#222222'
              }
            ])
            i++
          }
        }
      })

      return [
        {
          ...pdfUtils.generateTitle(this.$t('Views.Evaluations.report.toc.dimension_results') + ' - Pregunta', [0, -5, 0, 0], 'before', 24, '#222222', false, false),
          pageOrientation: 'landscape'
        },
        {
          margin: [0, 9, 0, 0],
          color: '#222222',
          table: {
            widths: ['23%', '*', '10%', '10%', '12%'],
            body: [
              // Headers
              [
                {
                  text: this.$t('Views.Evaluations.report.dimension'),
                  margin: [2, 9.5, 0, 0],
                  fillColor: '#9cd3ef',
                  bold: true
                },
                {
                  text: this.$t('Views.Evaluations.stepQuestion.title'),
                  margin: [2, 9.5, 0, 0],
                  fillColor: '#9cd3ef',
                  bold: true
                },
                {
                  text: this.$t('Views.Evaluations.report.organizational.curr_score'),
                  margin: [0, 2, 0, 0],
                  alignment: 'center',
                  fillColor: '#9cd3ef',
                  bold: true
                },
                {
                  text: this.$t('Views.Evaluations.report.organizational.prev_score'),
                  margin: [0, 2, 0, 0],
                  alignment: 'center',
                  fillColor: '#9cd3ef',
                  bold: true
                },
                {
                  text: this.$t('Views.Evaluations.report.organizational.trend'),
                  margin: [0, 9.5, 0, 0],
                  alignment: 'center',
                  fillColor: '#9cd3ef',
                  bold: true
                }
              ],
              // Body
              ...rows
            ]
          },
          layout: {
            hLineWidth: () => {
              return 1
            },
            vLineWidth: () => {
              return 1
            },
            hLineColor: () => {
              return '#BBBBBB'
            },
            vLineColor: () => {
              return '#BBBBBB'
            }
          }
        }
      ]
    }
  }
}
