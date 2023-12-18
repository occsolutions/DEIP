
import pdfUtils from '../../utils/pdf'
import cornerBase64 from '../../base64files/response-rate'
import iconBase64 from '../../base64files/response-rate-icon'

export default {
  methods: {
    assembleLeadersRate () {
      const leaderRateValues = [
        this.expectedLeaders,
        this.completedLeaders,
        this.expectedLeaders ? `${this.$round((this.completedLeaders / this.expectedLeaders) * 100)}%` : '--'
      ]
      const row = []

      let i = 1
      for (const item of leaderRateValues) {
        row.push({
          columns: [
            i !== leaderRateValues.length ? {
              width: 30,
              image: iconBase64,
              fit: [25, 25]
            } : { width: 0, text: '' },
            {
              margin: [0, 4, 10, 0],
              text: item,
              font: 'League Spartan',
              color: '#111111',
              fontSize: 26,
              alignment: 'right',
              bold: true
            }
          ]
        })
        i++
      }

      return row
    },
    $generateResponseRate () {
      const verticalTitle = (text) => {
        const canvas = document.createElement('canvas')
        canvas.width = 100
        canvas.height = 400
        const ctx = canvas.getContext('2d')
        ctx.font = '57px League Spartan'
        ctx.save()
        ctx.translate(canvas.width, canvas.height)
        ctx.rotate(-0.5 * Math.PI)
        ctx.fillStyle = '#000'
        ctx.fillText(text, 0, -10)
        ctx.restore()
        return canvas.toDataURL()
      }

      return [
        pdfUtils.generateTitle('Resultados', [0, 0], 'before', 1, '#FFFFFF', true),
        pdfUtils.generateTitle('Tasa de respuesta', [0, 0], '', 1, '#FFFFFF', true, true),
        {
          image: verticalTitle('Tasa de'),
          absolutePosition: { x: 404, y: 370 }
        },
        {
          image: verticalTitle('respuesta'),
          absolutePosition: { x: 454, y: 370 }
        },
        {
          image: cornerBase64,
          fit: [324, 485],
          absolutePosition: { x: 290, y: -1 }
        },
        {
          margin: [0, -10, 0, 0],
          text: 'Índice Evolución DEIP',
          font: 'League Spartan',
          color: '#111111',
          bold: true,
          characterSpacing: -1,
          fontSize: 19
        },
        {
          text: 'Enfoque Diferencial e Interseccional',
          color: '#111111',
          fontSize: 9
        },
        // Expected
        {
          text: this.$t('Views.Evaluations.report.organizational.total_expected'),
          margin: [0, 60, 0, 10],
          fontSize: 20,
          color: '#666666'
        },
        {
          columns: [
            {
              width: 58,
              image: iconBase64,
              fit: [50, 50]
            },
            {
              width: 120,
              margin: [0, 7, 0, 0],
              text: this.expectedPolls,
              font: 'League Spartan',
              color: '#111111',
              fontSize: 50,
              alignment: 'right',
              bold: true
            }
          ]
        },
        // Obtained
        {
          text: this.$t('Views.Evaluations.report.organizational.total_obtained'),
          margin: [0, 20, 0, 10],
          fontSize: 20,
          color: '#666666'
        },
        {
          columns: [
            {
              width: 58,
              image: iconBase64,
              fit: [50, 50]
            },
            {
              width: 120,
              margin: [0, 7, 0, 0],
              text: this.completedPolls,
              font: 'League Spartan',
              color: '#111111',
              fontSize: 50,
              alignment: 'right',
              bold: true
            }
          ]
        },
        // Percentage
        {
          text: 'Porcentaje de la\nPoblación',
          margin: [0, 20, 0, 10],
          fontSize: 20,
          color: '#666666'
        },
        {
          text: `${this.$round((this.completedPolls / this.expectedPolls) * 100)}%`,
          font: 'League Spartan',
          color: '#111111',
          fontSize: 50,
          bold: true
        },
        {
          text: 'Tasa de respuesta líderes con personas a cargo',
          margin: [0, 144, 0, 0],
          characterSpacing: 0,
          color: '#111111',
          fontSize: 11,
          bold: true
        },
        // Leaders Response Rate
        {
          margin: [0, 8, 210, 0],
          table: {
            widths: ['*', '*', '*'],
            body: [
              // Headers
              [
                {
                  text: this.$t('Views.Evaluations.report.organizational.total_expected'),
                  margin: [2, 8, 0, 0],
                  fontSize: 9.5,
                  characterSpacing: 0,
                  color: '#666666'
                },
                {
                  text: this.$t('Views.Evaluations.report.organizational.total_obtained'),
                  margin: [2, 8, 0, 0],
                  fontSize: 9.5,
                  characterSpacing: 0,
                  color: '#666666'
                },
                {
                  text: 'Porcentaje de la\nPoblación',
                  margin: [10, 3, 0, 0],
                  fontSize: 9.5,
                  characterSpacing: 0,
                  color: '#666666'
                }
              ],
              // Body
              this.assembleLeadersRate()
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
