
import pdfUtils from '../../utils/pdf'
import scatterTableBase64 from '../../base64files/scatter-table'

export default {
  methods: {
    $generateAttributeScatter () {
      return [
        pdfUtils.generateTitle(this.$t('engagementReport.dispersion'), [0, 0, 0, 0], 'before', 37, '#222222', false),
        pdfUtils.generateTitle(this.$t('engagementReport.dispersion_by_attributes'), [0, 10, 0, 0], '', 24, '#111111', true, true),
        {
          text: this.$t('engagementReport.attributes_with_higher_dispersion'),
          margin: [0, 15, 0, 0],
          fontSize: 17,
          color: '#444444'
        },
        // HIGHER ATTRIBUTES SCATTER TABLE
        {
          image: scatterTableBase64,
          absolutePosition: { x: 40.5, y: 170.5 }
        },
        {
          margin: [1.5, 5, 22, 0],
          table: {
            widths: this.scatterTblWidths,
            body: [
              this.getScatterTablesHeaders('attribute'),
              ...this.generateScatterTablesRows('attribute', true, 'positive_attribute')
            ]
          },
          layout: {
            hLineWidth: () => {
              return 3
            }
          }
        },
        {
          text: this.$t('engagementReport.attributes_with_lower_dispersion'),
          margin: [0, 33, 0, 0],
          fontSize: 17,
          color: '#444444'
        },
        // LOWER ATTRIBUTES SCATTER TABLE
        {
          image: scatterTableBase64,
          absolutePosition: { x: 40.5, y: 434 }
        },
        {
          margin: [1.5, 5, 22, 0],
          table: {
            widths: this.scatterTblWidths,
            body: [
              this.getScatterTablesHeaders('attribute'),
              ...this.generateScatterTablesRows('attribute', false, 'negative_attribute')
            ]
          },
          layout: {
            hLineWidth: () => {
              return 3
            }
          }
        }
      ]
    }
  }
}
