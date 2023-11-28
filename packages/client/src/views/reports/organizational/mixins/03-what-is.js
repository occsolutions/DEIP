
import pdfUtils from '../../utils/pdf'
import headerBase64 from '../../base64files/what-is-header'
import footerBase64 from '../../base64files/what-is-footer'

export default {
  methods: {
    $generateWhatIs () {
      const color = '#222222'
      return [
        pdfUtils.generateTitle(this.$t('engagementReport.what_is_engagement'), [0, 5, 40, 0], 'before', 38),
        {
          image: headerBase64,
          absolutePosition: { x: 380, y: 4 }
        },
        {
          text: this.$t('engagementReport.what_is_engagement_text'),
          margin: [0, 10, 20, 0],
          fontSize: 10,
          color
        },
        {
          text: this.$t('engagementReport.what_is_it'),
          margin: [0, 15, 0, 0],
          fontSize: 14,
          bold: true,
          color
        },
        {
          ul: this.$t('engagementReport.what_is_engagement_positive'),
          margin: [0, 6, 0, 0],
          fontSize: 10,
          color,
          lineHeight: 1.4
        },
        {
          text: this.$t('engagementReport.what_is_not'),
          margin: [0, 10, 0, 0],
          fontSize: 14,
          bold: true,
          color
        },
        {
          ul: this.$t('engagementReport.what_is_engagement_negative'),
          margin: [0, 6, 20, 0],
          fontSize: 10,
          color,
          lineHeight: 1.4
        },
        {
          text: this.$t('engagementReport.what_is_engagement_conclusion1'),
          margin: [0, 13, 20, 0],
          fontSize: 10,
          color: '#111111'
        },
        {
          text: this.$t('engagementReport.what_is_engagement_conclusion2'),
          margin: [0, 0, 20, 0],
          fontSize: 10,
          color: '#111111'
        },
        {
          image: footerBase64,
          fit: [531, 200],
          absolutePosition: { x: 0, y: 585 }
        },
        {
          text: this.$t('engagementReport.what_is_engagement_quote'),
          margin: [-11.5, 18, 128, 0],
          fontSize: 10,
          italics: true,
          lineHeight: 1.4,
          color: '#777777'
        },
        {
          text: 'Ricardo Matamala Señor',
          margin: [-11.5, 7, 0, 0],
          fontSize: 9.5,
          italics: true,
          color: '#777777'
        },
        {
          text: 'La Nueva Milla Extra – (Paidós, 2021)',
          margin: [-11.5, 0, 0, 0],
          fontSize: 9.5,
          italics: true,
          color: '#777777'
        }
      ]
    }
  }
}
