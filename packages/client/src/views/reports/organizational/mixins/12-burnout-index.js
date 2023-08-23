
import pdfUtils from '../../utils/pdf'

import burnout from '../../base64Files/burnout-square'
import burnoutIndIndexBase64 from '../../base64Files/burnout-ind-index'
import burnoutOrgIndexBase64 from '../../base64Files/burnout-org-index'

export default {
  computed: {
    distanceBetweenPoints () {
      return 90
    }
  },
  methods: {
    getBIndividualPosition () {
      const distanceFromLeftLimit = 40
      const value = this.indicesAnswers.burnoutIndividual.general.score < 1
        ? 1
        : this.indicesAnswers.burnoutIndividual.general.score > 5
          ? 5
          : this.indicesAnswers.burnoutIndividual.general.score
      return distanceFromLeftLimit + (this.distanceBetweenPoints * (value - 1))
    },
    getBOrganizationalPosition () {
      const distanceFromTopLimit = 423
      const value = this.indicesAnswers.burnoutOrganizational.general.score < 1
        ? 1
        : this.indicesAnswers.burnoutOrganizational.general.score > 5
          ? 5
          : this.indicesAnswers.burnoutOrganizational.general.score
      return distanceFromTopLimit - (this.distanceBetweenPoints * (value - 1))
    },
    getImage () {
      return new Promise((resolve) => {
        const data = burnout
        const canvas = document.getElementById('burnoutIndex')
        const ctx = canvas.getContext('2d')
        const img = new Image()

        img.src = data
        img.onload = () => {
          ctx.drawImage(img, 0, 0, 451, 451)
          ctx.font = '100px serif'
          // Coordenadas a modificar para ubicar el
          // Punto 1: x = 40, y = 433; Distancia entre puntos es de 90
          ctx.fillText('·', this.getBIndividualPosition(), this.getBOrganizationalPosition())
        }

        setTimeout(() => {
          resolve(canvas.toDataURL())
        }, 100)
      })
    },
    async $generateBurnoutIndex () {
      // Individual Factors
      const rowsInd = []
      const indexAnswersInd = this.indicesAnswers.burnoutIndividual.answers
      let cntr = 0
      for (const indexKey of Object.keys(indexAnswersInd)) {
        const score = indexAnswersInd[indexKey].general.score
        const previous = indexAnswersInd[indexKey].general.previous

        let reference
        if (indexAnswersInd[indexKey].idx === null) {
          reference = this.burnoutIndQs[cntr]
        } else {
          const foundIndex = this.evaluationData.questionsIndex.find(x => x.idx === indexAnswersInd[indexKey].idx)
          reference = foundIndex.reference[this.user.lang]
        }

        rowsInd.push([
          {
            text: reference,
            margin: [2, 6, 2, 0],
            fontSize: 8,
            color: '#666666',
            lineHeight: 1,
            characterSpacing: 0.2
          },
          {
            text: ' '
          },
          pdfUtils.generateScoreWithHeatMap(this.round(score, 2), this.getHeatMap(score), [0, 3.3, 0, 1.5], !this.hasPrevious ? -4 : -2.2),
          pdfUtils.generateScoreWithHeatMap(!this.hasPrevious ? '--' : this.round(previous), this.getHeatMap(previous), [0, 3.3, 0, 1.5], -2.2),
          {
            text: !this.hasPrevious ? '--' : this.round(score - previous),
            margin: [0, 9.5, 0, 0],
            fontSize: 11,
            alignment: 'center',
            bold: true,
            color: '#444444',
            characterSpacing: 0.2
          },
          // Score Bars
          this.hasPrevious
            ? pdfUtils.generatePreviousScoreBar(score, previous, 9.5, -2.6)
            : pdfUtils.generateSimpleScoreBar(score, 12, -2.6)
        ])
        cntr++
      }

      // Organizaional Factors
      const rowsOrg = []
      const indexAnswersOrg = this.indicesAnswers.burnoutOrganizational.answers
      for (const indexKey of Object.keys(indexAnswersOrg)) {
        const score = indexAnswersOrg[indexKey].general.score
        const previous = indexAnswersOrg[indexKey].general.previous

        const foundIndex = this.evaluationData.questionsIndex.find(x => x.idx === indexAnswersOrg[indexKey].idx)

        rowsOrg.push([
          {
            text: foundIndex.reference[this.user.lang],
            margin: [2, 6, 2, 0],
            fontSize: 8,
            color: '#666666',
            lineHeight: 1,
            characterSpacing: 0.2
          },
          {
            text: ' '
          },
          pdfUtils.generateScoreWithHeatMap(this.round(score, 2), this.getHeatMap(score), [0, 3.3, 0, 1.5], !this.hasPrevious ? -4 : -2.2),
          pdfUtils.generateScoreWithHeatMap(!this.hasPrevious ? '--' : this.round(previous), this.getHeatMap(previous), [0, 3.3, 0, 1.5], -2.2),
          {
            text: !this.hasPrevious ? '--' : this.round(score - previous),
            margin: [0, 9.5, 0, 0],
            fontSize: 11,
            alignment: 'center',
            bold: true,
            color: '#444444',
            characterSpacing: 0.2
          },
          // Score Bars
          this.hasPrevious
            ? pdfUtils.generatePreviousScoreBar(score, previous, 9.5, -2.6)
            : pdfUtils.generateSimpleScoreBar(score, 12, -2.6)
        ])
      }

      return [
        // Page Title
        pdfUtils.generateHeaderTitle(this.$t('Views.Evaluations.report.toc.burnout_index')),
        {
          margin: [0, 40, 10, 0],
          columns: [
            {
              image: await this.getImage(),
              fit: [600, 400],
              alignment: 'center'
            },
            {
              text: this.$t('Views.Evaluations.report.burnout_index'),
              margin: [0, -15, 0, 0],
              width: '40%',
              alignment: 'justify'
            }
          ]
        },
        pdfUtils.generateHeaderTitle(this.$t('Views.Evaluations.report.toc.burnout_index'), false),
        // base64 images
        {
          image: burnoutIndIndexBase64,
          fit: [730, 760],
          margin: [0, 31, 0, 0],
          alignment: 'center'
        },
        {
          absolutePosition: { x: 51, y: 329 },
          image: burnoutOrgIndexBase64,
          fit: [730, 760]
        },
        // Individual Table
        {
          absolutePosition: { x: 170, y: 73.2 },
          table: {
            widths: ['30.6%', '0.4%', '5.5%', '5.8%', '5.8%', '55%'],
            heights: [1, 1, 30, 32.5, 31.5, 31.7, 31.7, 31.5],
            body: [
              // Headers
              [
                {
                  text: ' '
                },
                {
                  text: ' '
                },
                {
                  text: '·',
                  margin: [0, -12, 0, -40],
                  fontSize: 40,
                  color: '#445bcc',
                  alignment: 'center',
                  bold: true
                },
                {
                  text: '·',
                  margin: [0, -12, 0, -40],
                  fontSize: 40,
                  alignment: 'center',
                  bold: true
                },
                {
                  text: ' '
                },
                {
                  text: ' '
                }
              ],
              [
                {
                  text: ' ',
                  margin: [0, 0, 0, -3]
                },
                {
                  text: ' ',
                  margin: [0, 0, 0, -3]
                },
                {
                  text: this.$t('Views.Evaluations.report.current'),
                  margin: [0, 4, 0, -3],
                  fontSize: 7,
                  alignment: 'center',
                  bold: true
                },
                {
                  text: this.$t('Views.Evaluations.report.organizational.prev_score'),
                  margin: [0, 0, 0, -3],
                  fontSize: 7,
                  alignment: 'center',
                  bold: true
                },
                {
                  text: this.$t('Views.Evaluations.report.organizational.trend'),
                  margin: [0, 4, 0, -3],
                  fontSize: 7,
                  alignment: 'center',
                  bold: true
                },
                {
                  text: ' ',
                  margin: [0, 0, 0, -3]
                }
              ],
              // rows
              ...rowsInd
            ]
          },
          layout: {
            hLineWidth: () => {
              return 0
            },
            vLineWidth: () => {
              return 0
            }
          }
        },
        // Organizational Table
        {
          absolutePosition: { x: 170, y: 340.2 },
          table: {
            widths: ['30.6%', '0.4%', '5.5%', '5.8%', '5.8%', '55%'],
            heights: [30, 32.5, 31.5, 31.7, 31.7, 31.5],
            body: [
              // rows
              ...rowsOrg
            ]
          },
          layout: {
            hLineWidth: () => {
              return 0
            },
            vLineWidth: () => {
              return 0
            }
          }
        }
      ]
    }
  }
}
