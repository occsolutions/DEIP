
import occLogoBase64 from '../../base64files/0-occ-logo'
import headerBase64 from '../../base64files/cover-header'
import bgBase64 from '../../base64files/cover-bg'

const fontSizeBylength = [
  { min: 0, max: 30, fontSize: 20 },
  { min: 31, max: 34, fontSize: 18 },
  { min: 35, max: 38, fontSize: 16 },
  { min: 39, max: 42, fontSize: 14 },
  { min: 43, max: 52, fontSize: 12 },
  { min: 53, max: 60, fontSize: 10 },
  { min: 60, max: 9999999, fontSize: 8 }
]

const getFontSizeBylength = (l) => fontSizeBylength.find((fsbl) => fsbl.min <= l && fsbl.max >= l).fontSize

export default {
  data () {
    return {
      today: new Date()
    }
  },
  methods: {
    $generateCover () {
      const limitItemsCover = 314
      const fontSize = getFontSizeBylength((this.currentPoll.name || '').length)
      const fontSizeItems = getFontSizeBylength((this.itemsCover || '').length)

      return [
        {
          image: headerBase64,
          absolutePosition: { x: 0, y: 44 }
        },
        {
          margin: [20, 65, 0, 0],
          text: this.$t('engagementReport.commitment_belonging'),
          fontSize: 26
        },
        {
          image: occLogoBase64,
          fit: [77, 77],
          absolutePosition: { x: 467, y: 57 }
        },
        {
          margin: [23, 0, 0, 0],
          text: this.user.enterprise.name.toUpperCase(),
          font: 'League Spartan',
          color: '#1999da',
          fontSize: 13,
          bold: true
        },
        {
          image: bgBase64,
          absolutePosition: { x: 30.5, y: 195.5 }
        },
        {
          margin: [6, 452, 0, 0],
          text: this.$t(`engagementReport.cover.${this.rtype}`),
          color: '#222222',
          fontSize: 20
        },
        this.itemsCover
          ? {
            margin: [6, 4, 0, 0],
            text: this.itemsCover.length > limitItemsCover ? `${this.itemsCover.slice(0, limitItemsCover)}...` : this.itemsCover,
            color: '#AAAAAA',
            fontSize: fontSizeItems
          }
          : null,
        {
          margin: [6, 4, 0, 0],
          text: this.currentPoll.name,
          color: '#222222',
          fontSize: fontSize,
          bold: true
        }
      ]
    }
  }
}
