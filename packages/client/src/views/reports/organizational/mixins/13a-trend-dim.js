
import pdfUtils from '../../utils/pdf'
import gralRankingTableBase64 from '../../base64files/gral-ranking-table'
import popRankingTableBase64 from '../../base64files/pop-ranking-table'

export default {
  data () {
    return {
      trendTblWidths: {
        byitems: ['*', '12.25%', '12.35%', '13.7%', '14.77%', '9.9%'],
        general: ['*', '11.75%', '12%', '14.55%']
      }
    }
  },
  methods: {
    getTrendTablesHeaders (type) {
      const isByItems = this.rtype === 'byitems'
      const headers = [
        {
          text: this.$t(`engagementReport.${type}`),
          margin: isByItems ? [3, 10, 0, -0.5] : [3, 9, 0, -3],
          fontSize: isByItems ? 9.5 : 11,
          bold: true,
          border: [false]
        },
        {
          text: this.$t('engagementReport.current_population'),
          margin: isByItems ? [-0.5, 1.5, 0, -0.5] : [-0.5, 0.5, 0, -3],
          fontSize: isByItems ? 9.5 : 11,
          alignment: 'center',
          bold: true,
          border: [false]
        },
        {
          text: this.$t('engagementReport.preview_population'),
          margin: isByItems ? [0, 1.5, 0, -0.5] : [0, 0.5, 0, -3],
          fontSize: isByItems ? 9.5 : 11,
          alignment: 'center',
          bold: true,
          border: [false]
        },
        {
          text: this.$t('engagementReport.variation'),
          margin: isByItems ? [0, 10, 0, -0.5] : [0, 9, 0, -3],
          fontSize: isByItems ? 9.5 : 11,
          alignment: 'center',
          bold: true,
          border: [false]
        }
      ]

      if (this.rtype === 'byitems') {
        headers.push({
          text: this.$t('engagementReport.current_organization'),
          margin: isByItems ? [0, 1.5, 0, -0.5] : [0, 0.5, 0, -3],
          fontSize: isByItems ? 9.5 : 11,
          alignment: 'center',
          bold: true,
          border: [false]
        },
        {
          text: this.$t('engagementReport.gap'),
          margin: isByItems ? [-1, 10, 0, -0.5] : [-1, 9, 0, -3],
          fontSize: isByItems ? 9.5 : 11,
          alignment: 'center',
          bold: true,
          border: [false]
        })
      }

      return headers
    },
    $generateDimensionTrend () {
      const isByItems = this.rtype === 'byitems'
      // Generate rows
      const scores = this.$sortKeys(this.current.dimensionsResults, true)
      const rows = []

      for (const score of scores) {
        const actual = this.current.dimensionsResults[score]
        const wholes = this.rtype === 'byitems' ? this.current.wholesDimensionsResults[score] : 0
        const previous = this.hasPrevious ? this.previous.dimensionsResults[score] : 0

        let row = [
          {
            text: this.hasPrevious ? this.dimensions.find((c) => c.id === Number(score)).translate.label : '',
            margin: isByItems ? [0, 4.95, 0, -2.9] : [0, 4.5, 0, -2.6],
            fontSize: 11,
            border: [false]
          },
          {
            text: this.hasPrevious ? `${this.$round(actual)}%` : '--',
            margin: isByItems ? [0, 4.95, 0, -2.9] : [0, 4.5, 0, -2.6],
            alignment: 'center',
            borderColor: ['#000000', '#000000', '#000000', pdfUtils.getColor(actual)],
            border: [false, false, false, this.hasPrevious]
          },
          {
            text: this.hasPrevious ? `${this.$round(previous)}%` : '--',
            margin: isByItems ? [0, 4.95, 0, -2.9] : [0, 4.5, 0, -2.6],
            alignment: 'center',
            borderColor: ['#000000', '#000000', '#000000', pdfUtils.getColor(previous)],
            border: [false, false, false, this.hasPrevious]
          },
          {
            text: this.hasPrevious ? this.$round(actual - previous) : '--',
            margin: isByItems ? [0, 4.95, 0, -2.9] : [0, 4.5, 0, -2.6],
            alignment: 'center',
            border: [false]
          }
        ]

        if (this.rtype === 'byitems') {
          const gap = actual - wholes
          row = row.concat([
            {
              text: this.hasPrevious ? `${this.$round(wholes)}%` : '--',
              margin: isByItems ? [0, 4.95, 0, -2.9] : [0, 4.5, 0, -2.6],
              alignment: 'center',
              border: [false]
            },
            {
              text: this.hasPrevious && gap ? this.$round(gap) : '--',
              margin: isByItems ? [0, 4.95, 0, -2.9] : [0, 4.5, 0, -2.6],
              alignment: 'center',
              border: [false]
            }
          ])
        }

        rows.push(row)
      }
      rows.sort((a, b) => b[3].text - a[3].text)

      return [
        {
          ...pdfUtils.generateTitle(this.$t('engagementReport.rates'), [0, 0, 0, 0], 'before', 37, '#222222'),
          pageOrientation: 'portrait'
        },
        {
          text: this.$t('engagementReport.rates_desc'),
          margin: [0, 10, 0, 10]
        },
        pdfUtils.generateTitle(this.$t('engagementReport.rates_by_dimension'), [0, 10, 0, 0], '', 24, '#111111', true, true),
        // * ------------------------ *
        // * DIMENSIONS TREND TABLE *
        // * ------------------------ *
        {
          image: this.rtype === 'byitems' ? popRankingTableBase64 : gralRankingTableBase64,
          absolutePosition: { x: 41, y: 183.5 }
        },
        {
          margin: [1.5, 5, 22, 0],
          table: {
            widths: this.trendTblWidths[this.rtype],
            body: [
              this.getTrendTablesHeaders('dimension'),
              ...rows
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
