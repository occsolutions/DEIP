
import pdfUtil from '../../utils/pdf'

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
    $generateSummaryCover () {
      const fontSize = getFontSizeBylength((this.pollName || '').length)
      return [
        {
          image: this.enterpriseLogoBase64 || this.occLogoBase64,
          fit: [90, 90],
          absolutePosition: { x: 40, y: 740 }
        },
        {
          image: this.occLogoBase64,
          fit: [90, 90],
          absolutePosition: { x: 470, y: 740 }
        },
        {
          margin: [0, 225, 0, 0],
          columns: pdfUtil.generateCenteredText('Engagement', 22, true, false, true)
        },
        {
          columns: pdfUtil.generateCenteredText(this.$t('demographicReport.commitment_belonging'), 20, false)
        },
        {
          margin: [0, 10, 0, 0],
          columns: pdfUtil.generateCenteredText(this.$t('demographicReport.cover'), 20, false)
        },
        {
          columns: pdfUtil.generateCenteredText(this.pollName, fontSize, false)
        },
        this.generateGeneralTable(),
        {
          margin: [0, 295, 0, 0],
          columns: pdfUtil.generateCenteredText(this.user.enterprise.name, 20, true)
        },
        {
          columns: pdfUtil.generateCenteredText(`${this.$t(`demographicReport.months[${this.today.getMonth()}]`)} - ${this.today.getFullYear()}`, 15, true)
        }
      ]
    }
  }
}
