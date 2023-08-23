
import CoverBase64 from '../../base64Files/cover'
import HeaderBase64 from '../../base64Files/header'
import WaterMarkBase64 from '../../base64Files/watermark'

export default {
  methods: {
    async $getConfiguration () {
      return {
        pageSize: 'A4',
        pageOrientation: 'landscape',
        pageMargins: [40, 100, 40, 27],
        info: {
          title: this.$t('Views.Evaluations.report.individual.title'),
          author: 'OCC Solutions',
          subject: this.$t('Views.Evaluations.report.individual.subject')
        },
        defaultStyle: {
          fontSize: 11,
          font: 'Roboto',
          lineHeight: 1.2,
          margin: [0, 25, 0, 0]
        },
        header: (currentPage) => {
          const resultObj = {
            image: HeaderBase64,
            width: 400,
            height: 100,
            margin: [52, -12, 0, 0]
          }
          if (currentPage === 1) return [{}]
          return [resultObj]
        },
        footer: (currentPage) => {
          if (currentPage === 1) return
          return [
            {
              margin: [28, 0, 17, -4],
              columns: [
                {
                  width: '2%',
                  text: currentPage.toString(),
                  alignment: 'left',
                  fontSize: 10,
                  color: '#999999'
                },
                {
                  text: 'DEIP',
                  alignment: 'right',
                  fontSize: 9,
                  color: '#999999'
                },
                {
                  width: '10%',
                  text: this.evaluation.enterprise.name,
                  alignment: 'right',
                  fontSize: 10,
                  color: '#555555',
                  bold: true
                },
                {
                  width: '12%',
                  text: this.getDateString(),
                  alignment: 'right',
                  fontSize: 10,
                  color: '#777777'
                }
              ]
            }
          ]
        },
        background: (currentPage) => {
          if (currentPage === 1) {
            return {
              // Cover Background
              image: CoverBase64
            }
          } else {
            return {
              // OCC Solutions logo watermark
              image: WaterMarkBase64,
              absolutePosition: { x: -77, y: 244 }
            }
          }
        },
        content: [
          // 01 Cover
          this.$generateCover(),
          // 02 Table of Contents
          this.$generateTableOfContents(),
          // 03 Introduction
          this.$generateIntroduction(),
          // 04 Model Description
          this.$generateModelDescription(),
          // 05 Methodology
          this.$generateMethodology(),
          // 07 General Score
          await this.$generateGeneralScores(),
          // 08 Dimensions/Variables
          this.$generateDimensionsResults(),
          // 09 Detailed Dimensions
          this.$generateDimensionDetail(),
          // 10 Highest/Lowest Scores
          this.$generateScores(this.highestScores, 'highest_scores'),
          this.$generateScores(this.lowerScores, 'lowest_scores'),
          // 12 Burnout Index
          await this.$generateBurnoutIndex(),
          // 13 Health Index
          this.$generateHealthIndex()
        ]
      }
    }
  }
}
