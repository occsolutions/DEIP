
import pdfUtils from '../../utils/pdf'
import topBase64 from '../../base64files/recommendations'

export default {
  methods: {
    $ourRecommendations () {
      const verticalTitle = (text) => {
        const canvas = document.createElement('canvas')
        canvas.width = 70
        canvas.height = 700
        const ctx = canvas.getContext('2d')
        ctx.font = '50px League Spartan'
        ctx.save()
        ctx.translate(canvas.width, canvas.height)
        ctx.rotate(-0.5 * Math.PI)
        ctx.fillStyle = '#000'
        ctx.fillText(text, 0, 0)
        ctx.restore()
        return canvas.toDataURL()
      }

      return [
        pdfUtils.generateTitle(this.$t('engagementReport.our_recommendations'), [0, 0, 50, 0], 'before', 1, '#FFFFFF'),
        {
          image: verticalTitle(this.$t('engagementReport.our_recommendations')),
          absolutePosition: { x: 10, y: 54 }
        },
        {
          image: topBase64,
          absolutePosition: { x: 287, y: 0 }
        },
        {
          ol: this.$t('engagementReport.recommendations_stack'),
          margin: [90, 395, 20, 0],
          fontSize: 11,
          color: '#222222',
          lineHeight: 1.5
        }
      ]
    }
  }
}
