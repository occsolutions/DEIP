
import occLogoBase64 from '../../base64files/0-occ-logo'
import deipLogoBase64 from '../../base64files/0a-deip-logo'
import inspiraLogoBase64 from '../../base64files/0b-inspirandoT-logo'
import bg1Base64 from '../../base64files/cover-bg1'
import bg2Base64 from '../../base64files/cover-bg2'
import bg3Base64 from '../../base64files/cover-bg3'
import bg4Base64 from '../../base64files/cover-bg4'
import dotsBase64 from '../../base64files/cover-dots'
import stripesBase64 from '../../base64files/cover-stripes'

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
      const nameFontSize = getFontSizeBylength((this.evaluationData.name || '').length)

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
        // -------------- Images -------------- //
        {
          image: bg3Base64,
          fit: [289, 108],
          absolutePosition: { x: 247, y: 310.7 }
        },
        {
          image: bg2Base64,
          fit: [82.5, 116.5],
          absolutePosition: { x: 412, y: 194 }
        },
        {
          image: dotsBase64,
          fit: [54.5, 88],
          absolutePosition: { x: 363.5, y: 237 }
        },
        {
          image: bg1Base64,
          fit: [246, 246],
          absolutePosition: { x: 60, y: 194 }
        },
        {
          image: dotsBase64,
          fit: [54.5, 88],
          absolutePosition: { x: 31, y: 403.2 }
        },
        {
          image: bg4Base64,
          fit: [477, 114],
          absolutePosition: { x: 59, y: 455 }
        },
        {
          image: stripesBase64,
          absolutePosition: { x: 475, y: 388 }
        },
        // ------------------------------------ //
        {
          margin: [6, 500, 0, 0],
          text: this.$t('Views.Evaluations.report.organizational.title'),
          color: '#222222',
          fontSize: 20
        },
        {
          margin: [6, 5, 0, 0],
          text: this.evaluationData.name,
          color: '#222222',
          fontSize: nameFontSize,
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
