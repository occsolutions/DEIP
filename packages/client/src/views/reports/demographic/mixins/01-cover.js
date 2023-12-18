
import occLogoBase64 from '../../base64files/0-occ-logo'
import deipLogoBase64 from '../../base64files/0a-deip-logo'
import inspiraLogoBase64 from '../../base64files/0b-inspirandoT-logo'
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
  methods: {
    $generateCover () {
      const demographicLabels = this.criteriaLabels.join(', ')
      const labelsFontSize = getFontSizeBylength((demographicLabels || '').length)

      return [
        {
          margin: [20, 10, 0, 0],
          text: 'Índice Evolución DEIP',
          color: '#222222',
          characterSpacing: -1,
          fontSize: 30,
          bold: true
        },
        {
          margin: [20, -7, 0, 0],
          text: 'Enfoque Diferencial e Interseccional',
          color: '#222222',
          fontSize: 22
        },
        {
          image: deipLogoBase64,
          fit: [80, 80],
          absolutePosition: { x: 467, y: 57 }
        },
        {
          margin: [23, 2, 0, 0],
          text: this.user.enterprise.name.toUpperCase(),
          font: 'League Spartan',
          color: '#1999da',
          fontSize: 13,
          bold: true
        },
        {
          image: bgBase64,
          absolutePosition: { x: 31, y: 194 }
        },
        {
          margin: [6, 500, 0, 0],
          text: this.$t('Views.Evaluations.report.demographic.title'),
          color: '#222222',
          fontSize: 20
        },
        {
          margin: [6, 5, 0, 0],
          text: demographicLabels,
          color: '#222222',
          fontSize: labelsFontSize,
          bold: true
        },
        {
          image: inspiraLogoBase64,
          width: 100,
          absolutePosition: { x: 370, y: 710 }
        },
        {
          image: occLogoBase64,
          fit: [60, 60],
          absolutePosition: { x: 487, y: 707 }
        }
      ]
    }
  }
}
