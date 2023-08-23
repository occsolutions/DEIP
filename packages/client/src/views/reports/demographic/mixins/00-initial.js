
import evaluationService from '../../../../services/evaluations'

import CoverBase64 from '../../base64Files/cover'
import HeaderBase64 from '../../base64Files/header'
import WaterMarkBase64 from '../../base64Files/watermark'

export default {
  methods: {
    generateReportName () {
      if (this.criteria.type === 'demographic' && this.demographicCuts[this.criteria.code]) {
        this.segmentLabel = this.demographicCuts[this.criteria.code].label
      }
      if (this.criteria.type === 'segmentation') {
        const addSeg = this.evaluationData.additionalSegmentation
        this.segmentLabel = addSeg[this.criteria.code].trans[this.user.lang].label
      }

      this.reportName = `${this.evaluationData.name} - ${this.segmentLabel}`
    },
    calculateGeneralScores () {
      for (const segmentKey of Object.keys(this.segmentedAnswers)) {
        const segmentAnswersDimension = this.segmentedAnswers[segmentKey].answersDimension
        let currentScores = 0
        let cnt = 0
        for (const key of Object.keys(segmentAnswersDimension)) {
          currentScores += segmentAnswersDimension[key].filtered
          cnt++
        }
        this.gralScore[segmentKey] = currentScores / cnt
      }
    },
    async $getInitialData () {
      await evaluationService.getOneReportByThreadId(this.thread._id, this.pollId)
        .then((res) => {
          this.expectedPolls = this.evaluationData.populationCount
          this.completedPolls = res.data.answeredCount
          this.answersDimension = res.data.answersDimension
          this.indicesAnswers = res.data.indicesAnswers
          this.criteria = res.data.criteria[0]
          this.segments = res.data.segments
          this.segmentedAnswers = res.data.segmentedAnswers
          this.generateReportName()
          this.calculateGeneralScores()
        })
        .catch((err) => {
          console.log(err)
          this.$store.dispatch('alert/error', this.$t(`errors.${err.code}`))
        })
    },
    async $getConfiguration () {
      return {
        pageSize: 'A4',
        pageOrientation: 'landscape',
        pageMargins: [40, 100, 50, 27],
        info: {
          title: this.$t('Views.Evaluations.report.demographic.title'),
          author: 'OCC Solutions',
          subject: this.$t('Views.Evaluations.report.demographic.subject')
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
            width: 644,
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
                  text: this.user.enterprise.name,
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
          // this.$generateIntroduction(),
          // 04 Model Description
          this.$generateModelDescription(),
          // 05 Methodology
          this.$generateMethodology(),
          // 07 General Scores
          this.$generateGeneralScores(),
          // 08 Dimension Results
          this.$generateDimensionResults(),
          // 09 Detailed Dimensions
          this.$generateDimensionDetail(),
          // 12a Burnout Index
          this.$generateBurnoutIndexInd(),
          // 12b Burnout Index
          this.$generateBurnoutIndexOrg(),
          // 13 Health Index
          this.$generateHealthIndex()
        ]
      }
    }
  }
}
