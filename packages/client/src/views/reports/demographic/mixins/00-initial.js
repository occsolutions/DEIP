
export default {
  methods: {
    pollDate () {
      if (this.evaluationData && this.evaluationData.deliveredAt) {
        const date = new Date(this.evaluationData.deliveredAt)
        return `${this.$t(`Views.Evaluations.report.months[${date.getMonth()}]`)} - ${date.getFullYear()}`
      }
      return ''
    },
    async $getConfiguration () {
      return {
        pageSize: 'letter',
        pageMargins: [40, 40, 40, 20],
        info: {
          title: this.$t('Views.Evaluations.report.demographic.title'),
          author: 'OCC Solutions',
          subject: this.$t('Views.Evaluations.report.demographic.subject')
        },
        defaultStyle: {
          fontSize: 11,
          font: 'Montserrat',
          lineHeight: 1.2,
          characterSpacing: -0.4,
          color: '#555555'
        },
        header: () => {
          //
        },
        footer: (currentPage, totalePages, pageData) => {
          const isHorizontal = pageData.orientation === 'landscape'
          const verticalFooter = (text) => {
            const canvas = document.createElement('canvas')
            canvas.width = 40
            canvas.height = 100
            const ctx = canvas.getContext('2d')
            ctx.font = '10.5px Montserrat'
            ctx.save()
            ctx.translate(canvas.width, canvas.height)
            ctx.rotate(-0.5 * Math.PI)
            ctx.fillStyle = '#000000'
            ctx.fillText(text, 1, -4)
            ctx.restore()
            return canvas.toDataURL()
          }

          const horizontalFooter = (text) => {
            const canvas = document.createElement('canvas')
            canvas.width = 100
            canvas.height = 14
            const ctx = canvas.getContext('2d')
            ctx.font = '10.5px Montserrat'
            ctx.fillStyle = '#000000'
            ctx.fillText(text, 0, 10)
            return canvas.toDataURL()
          }

          return [
            {
              columns: [
                { text: currentPage > 2 ? `${currentPage}` : '', color: '#000000', width: 14 },
                { text: currentPage !== 2 ? 'Creado por: InspirandoT SAS BIC y OCC Solutions' : '', color: '#777777', width: '*' }
              ],
              fontSize: 9,
              margin: [28, -5, 0, 0]
            },
            {
              image: isHorizontal ? horizontalFooter(this.pollDate()) : verticalFooter(this.pollDate()),
              absolutePosition: {
                x: isHorizontal ? 670 : 554,
                y: isHorizontal ? -14 : -101
              }
            }
          ]
        },
        background: () => {
          //
        },
        content: [
          // 01 Cover
          this.$generateCover(),
          // 02 Table of Contents
          this.$generateTableOfContents(),
          // 03 Introduction
          this.$generateIntro(),
          // 04 Objectives
          this.$generateObjectives(),
          // 05 Model Description
          this.$generateModelDescription(),
          // 06 Methodology
          this.$generateMethodology(),
          // 07 Response Rate
          this.$generateResponseRate(),
          this.$generateResponseRateDetails(),
          // 08 General Scores
          this.$generateGeneralResults(),
          // 09 Dimensions Results
          this.$generateDimensionsResults(),
          this.$generateDimensionDetails(),
          this.$generateDimensionOptQuestions(),
          // 10 Leaders Dimension Results
          this.completedLeaders ? this.$generateLeadersResults() : '',
          this.completedLeaders ? this.$generateLeadersDetails() : '',
          this.completedLeaders ? this.$generateLeadersOptQuestions() : '',
          // 11 Highest/Lowest Scores
          this.$generateQuestionsRanking(),
          // 12 Highest/Lowest Scatter
          this.$generateQuestionsScatter(),
          // 13 Trend
          this.$generateDimensionTrend(),
          this.$generateQuestionsTrend()
        ]
      }
    },
    $round (num) {
      let result = parseFloat(num).toFixed(2)
      if (result === '0.00') result = '0'
      if (result === '100.00') result = '100'
      if (Number.isInteger(Number(result))) {
        result = parseInt(result).toFixed()
      }
      return result
    }
  }
}
