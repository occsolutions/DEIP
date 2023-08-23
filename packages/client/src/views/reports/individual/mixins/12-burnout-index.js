
import pdfUtils from '../../utils/pdf'

import burnout from '../../base64Files/burnout-square'
import burnoutIndIndexBase64 from '../../base64Files/individual/burnout-ind-index'
import burnoutOrgIndexBase64 from '../../base64Files/individual/burnout-org-index'

export default {
  computed: {
    distanceBetweenPoints () {
      return 90
    }
  },
  methods: {
    getBIndividualPosition () {
      const distanceFromLeftLimit = 40
      const value = this.burnoutAverages.individual < 1
        ? 1
        : this.burnoutAverages.individual > 5
          ? 5
          : this.burnoutAverages.individual
      return distanceFromLeftLimit + (this.distanceBetweenPoints * (value - 1))
    },
    getBOrganizationalPosition () {
      const distanceFromTopLimit = 423
      const value = this.burnoutAverages.organizational < 1
        ? 1
        : this.burnoutAverages.organizational > 5
          ? 5
          : this.burnoutAverages.organizational
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
      this.burnoutIndQs.forEach(q => {
        const score = q.score
        rowsInd.push([
          {
            text: q.reference[this.lang],
            margin: [2, 6.3, 0, -0],
            fontSize: 8,
            color: '#666666',
            characterSpacing: 0.3
          },
          {
            text: ' '
          },
          pdfUtils.generateScoreWithHeatMap(this.round(score, 2), this.getHeatMap(score), [0, 3.2, 2, 1.8]),
          // Score Bars
          pdfUtils.generateIndividualScoreBar(score, 12, -2)
        ])
      })

      // Organizational Factors
      const rowsOrg = []
      const burnoutOrgIndexQuestions = this.evaluation.questionsIndex.filter(x => {
        return x.index.includes('burnoutOrganizational')
      })

      burnoutOrgIndexQuestions.forEach(q => {
        const score = this.evaluated.temp.indices.find(x => x.idx === q.idx).answer

        rowsOrg.push([
          {
            text: q.reference[this.lang],
            margin: [2, 6.3, 0, -0],
            fontSize: 8,
            color: '#666666',
            characterSpacing: 0.3
          },
          {
            text: ' '
          },
          pdfUtils.generateScoreWithHeatMap(this.round(score, 2), this.getHeatMap(score), [0, 3.2, 2, 1.8]),
          // Score Bars
          pdfUtils.generateIndividualScoreBar(score, 12, -2)
        ])
      })

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
          margin: [0, 30.6, 0, 0],
          alignment: 'center'
        },
        {
          absolutePosition: { x: 56, y: 329 },
          image: burnoutOrgIndexBase64,
          fit: [730, 760]
        },
        // Individual Table
        {
          absolutePosition: { x: 174, y: 97 },
          table: {
            widths: ['29.5%', '0.5%', '5.3%', '60.6%'],
            heights: [1, 32, 32, 32, 32, 32, 32],
            body: [
              // Headers
              [
                {
                  text: ' ',
                  margin: [0, 0, 0, -5.5]
                },
                {
                  text: ' ',
                  margin: [0, 0, 0, -5.5]
                },
                {
                  text: this.$t('Views.Evaluations.report.current'),
                  margin: [0, 4, 0, -5.5],
                  fontSize: 7,
                  alignment: 'center',
                  bold: true
                },
                {
                  text: ' ',
                  margin: [0, 0, 0, -5.5]
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
          absolutePosition: { x: 174, y: 340 },
          table: {
            widths: ['29.5%', '0.5%', '5.3%', '60.6%'],
            heights: [1, 32, 32, 32, 32, 32, 32],
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
