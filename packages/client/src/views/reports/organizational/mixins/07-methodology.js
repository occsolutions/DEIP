
import pdfUtils from '../../utils/pdf'
import heatMapTableBase64 from '../../base64files/methodology'

export default {
  data () {
    return {
      heatMapMeaning: [
        { value: '0% - 30%', meaning: 'critical_situation', color: '#C05251' },
        { value: '31% - 50%', meaning: 'requires_attention', color: '#E0A9A8' },
        { value: '51% - 70%', meaning: 'insufficient', color: '#EE9748' },
        { value: '71% - 85%', meaning: 'aceptable', color: '#FFd87C' },
        { value: '86% - 95%', meaning: 'very_good', color: '#93D379' },
        { value: '96% - 100%', meaning: 'remarkable', color: '#538853' }
      ]
    }
  },
  methods: {
    assembleHeatMapMeaningTable () {
      const rows = []
      for (const item of this.heatMapMeaning) {
        rows.push([
          {
            text: '                    .',
            color: item.color,
            background: item.color,
            preserveLeadingSpaces: true,
            lineHeight: 0.95,
            margin: [1.84, 2.8, 0, 0.5],
            border: [false, false, false, false]
          },
          {
            text: item.value,
            margin: [2, 2.8, 0, 0.5],
            color: '#444444',
            border: [false, false, false, false]
          },
          {
            text: this.$t(`engagementReport.${item.meaning}`),
            margin: [2, 2.8, 0, 0.5],
            color: '#444444',
            border: [false, false, false, false]
          }
        ])
      }
      return rows
    },
    $generateMetodology () {
      return [
        pdfUtils.generateTitle(this.$t('engagementReport.methodology'), [0, 0], 'before'),
        {
          text: this.$t('engagementReport.methodology_text'),
          margin: [0, 10, 0, 0],
          fontSize: 12,
          color: '#222222',
          lineHeight: 1.5
        },
        {
          ol: this.$t('engagementReport.methodology_list'),
          margin: [0, 20, 0, 0],
          fontSize: 12,
          bold: true,
          lineHeight: 1.5
        },
        {
          text: this.$t('engagementReport.heatmap_text'),
          margin: [0, 20, 0, 0],
          fontSize: 12,
          color: '#444444',
          lineHeight: 1.5
        },
        // TABLE
        {
          image: heatMapTableBase64,
          absolutePosition: { x: 40, y: 357 }
        },
        {
          margin: [0, 24.5, 0, 0],
          table: {
            widths: ['12.6%', '18.8%', '64%'],
            body: [
              // Headers
              [
                {
                  text: 'Color',
                  margin: [2, 3.4, 0, 0.8],
                  bold: true,
                  border: [false, false, false, false]
                },
                {
                  text: this.$t('engagementReport.values'),
                  margin: [2, 3.4, 0, 0.8],
                  bold: true,
                  border: [false, false, false, false]
                },
                {
                  text: this.$t('engagementReport.meaning'),
                  margin: [2, 3.4, 0, 0.8],
                  bold: true,
                  border: [false, false, false, false]
                }
              ],
              // Body
              ...this.assembleHeatMapMeaningTable()
            ]
          },
          layout: {
            hLineWidth: () => {
              return 1
            }
          }
        },
        {
          text: this.$t('engagementReport.methodology_conclusion'),
          margin: [0, 30, 0, 0],
          fontSize: 12,
          color: '#222222',
          lineHeight: 1.5
        }
      ]
    }
  }
}
