
import pdfUtils from '../../utils/pdf'
import cornerBase64 from '../../base64files/response-rate'
import iconBase64 from '../../base64files/response-rate-icon'

export default {
  methods: {
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
      const ttlReceivers = this.rtype === 'byitems' ? this.totalFiltered : this.totalReceivers

      return [
        pdfUtils.generateTitle(this.$t('engagementReport.results'), [0, 0], 'before', 1, '#FFFFFF', true),
        pdfUtils.generateTitle(this.$t('engagementReport.answers_rate'), [0, 0], '', 1, '#FFFFFF', true, true),
        {
          image: verticalTitle(this.$t('engagementReport.answers_rate1')),
          absolutePosition: { x: 404, y: 370 }
        },
        {
          image: verticalTitle(this.$t('engagementReport.answers_rate2')),
          absolutePosition: { x: 454, y: 370 }
        },
        {
          image: cornerBase64,
          fit: [487, 487],
          absolutePosition: { x: 287, y: 0 }
        },
        {
          text: 'Engagement',
          font: 'League Spartan',
          bold: true,
          fontSize: 20
        },
        {
          text: this.$t('engagementReport.commitment_belonging')
        },
        // Expected
        {
          text: this.$t('engagementReport.total_sent'),
          margin: [0, 60, 0, 10],
          fontSize: 20,
          color: '#555555'
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
              text: ttlReceivers,
              font: 'League Spartan',
              fontSize: 50,
              alignment: 'right',
              bold: true
            }
          ]
        },
        // Obtained
        {
          text: this.$t('engagementReport.total_obtained'),
          margin: [0, 20, 0, 10],
          fontSize: 20,
          color: '#555555'
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
              text: this.totalObtained,
              font: 'League Spartan',
              fontSize: 50,
              alignment: 'right',
              bold: true
            }
          ]
        },
        // Percentage
        {
          text: this.$t('engagementReport.population_percentage'),
          margin: [0, 20, 0, 10],
          fontSize: 20,
          color: '#555555'
        },
        {
          text: `${this.$round((this.totalObtained / ttlReceivers) * 100)}%`,
          font: 'League Spartan',
          fontSize: 50,
          bold: true
        }
      ]
    }
  }
}
