
import pdfUtils from '../../utils/pdf'

export default {
  data () {
    return {
      rankingHeaders: [
        {
          text: this.$t('Views.Evaluations.stepQuestion.title'),
          margin: [2, 10, 0, 0],
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
          margin: [0, 10, 0, 0],
          alignment: 'center',
          fillColor: '#9cd3ef',
          bold: true
        }
      ]
    }
  },
  methods: {
    assembleRankingTable (type) {
      const data = type === 'high' ? this.highestScores : this.lowestScores
      const rows = []
      data.forEach(x => {
        const question = x.dimension === 'leader'
          ? this.evaluationData.questionnaire.evaluations[x.dimension][x.question].label[this.user.lang]
          : this.evaluationData.questionnaire.evaluations[x.dimension].attrs[x.attribute].questions[x.question].label[this.user.lang]

        const previous = x.dimension === 'leader'
          ? this.answersDimension[x.dimension][x.question].general.previous || 0
          : this.answersDimension[x.dimension].attrs[x.attribute].questions[x.question].general.previous || 0

        const trend = x.score - previous

        rows.push([
          {
            text: question,
            margin: [2, 5, 0, 0],
            fontSize: 8,
            color: '#555555'
          },
          {
            text: this.$round(x.score),
            margin: [0, 10, 0, 4],
            alignment: 'center',
            fontSize: 12,
            bold: true,
            color: '#222222'
          },
          {
            text: this.hasPrevious ? this.$round(previous) : '--',
            margin: [0, 10, 0, 4],
            alignment: 'center',
            fontSize: 12,
            bold: this.hasPrevious,
            color: '#222222'
          },
          {
            text: this.hasPrevious && trend ? this.$round(trend) : '--',
            margin: [0, 10, 0, 4],
            alignment: 'center',
            fontSize: 12,
            bold: this.hasPrevious && trend,
            color: '#222222'
          }
        ])
      })

      return rows
    },
    $generateQuestionsRanking () {
      const widths = ['*', '10%', '10%', '12%']

      return [
        {
          ...pdfUtils.generateTitle('Ranking', [0, -4, 0, 0], 'before', 44, '#222222', true),
          pageOrientation: 'portrait'
        },
        pdfUtils.generateTitle('Ranking de las preguntas', [0, 8, 0, 0], '', 24, '#222222', true, true),
        {
          text: 'Preguntas con puntaje actual más alto',
          margin: [0, 10, 0, 0],
          color: '#444444',
          fontSize: 17
        },
        // * ------------------------ *
        // *   HIGHER RANKING TABLE   *
        // * ------------------------ *
        {
          margin: [0, 8, 0, 0],
          color: '#222222',
          table: {
            widths,
            body: [
              // Headers
              JSON.parse(JSON.stringify(this.rankingHeaders)),
              // Body
              ...this.assembleRankingTable('high')
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
        },
        {
          text: 'Preguntas con puntaje actual más bajo',
          margin: [0, 20, 0, 0],
          color: '#444444',
          fontSize: 17
        },
        // * ------------------------ *
        // *   LOWER RANKING TABLE    *
        // * ------------------------ *
        {
          margin: [0, 8, 0, 0],
          color: '#222222',
          table: {
            widths,
            body: [
              // Headers
              JSON.parse(JSON.stringify(this.rankingHeaders)),
              // Body
              ...this.assembleRankingTable('low')
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
