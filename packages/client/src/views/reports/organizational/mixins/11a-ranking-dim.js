
import pdfUtils from '../../utils/pdf'
import gralRankingTableBase64 from '../../base64files/gral-ranking-table'
import popRankingTableBase64 from '../../base64files/pop-ranking-table'

export default {
  data () {
    return {
      rankingTblWidths: {
        byitems: ['*', '12.25%', '12.35%', '13.7%', '14.77%', '9.9%'],
        general: ['*', '11.75%', '12%', '14.55%']
      }
    }
  },
  methods: {
    getRankingTablesHeaders (type) {
      const headers = [
        {
          text: this.$t(`engagementReport.${type}`),
          margin: [3, 9, 0, -1.4],
          fontSize: 10,
          bold: true,
          border: [false]
        },
        {
          text: this.$t('engagementReport.current_population'),
          margin: [-0.5, 1, 0, -1.4],
          fontSize: 10,
          alignment: 'center',
          bold: true,
          border: [false]
        },
        {
          text: this.$t('engagementReport.preview_population'),
          margin: [0, 1, 0, -1.4],
          fontSize: 10,
          alignment: 'center',
          bold: true,
          border: [false]
        },
        {
          text: this.$t('engagementReport.rate'),
          margin: [0, 9, 0, -1.4],
          fontSize: 10,
          alignment: 'center',
          bold: true,
          border: [false]
        }
      ]

      if (this.rtype === 'byitems') {
        headers.push({
          text: this.$t('engagementReport.current_organization'),
          margin: [0, 1, 0, -1.4],
          fontSize: 10,
          alignment: 'center',
          bold: true,
          border: [false]
        },
        {
          text: this.$t('engagementReport.gap'),
          margin: [-1, 9, 0, -1.4],
          fontSize: 10,
          alignment: 'center',
          bold: true,
          border: [false]
        })
      }

      return headers
    },
    $generateDimensionRanking () {
      // Generate rows
      const scores = this.$sortKeys(this.current.dimensionsResults, false)
      const rows = []

      for (const score of scores) {
        const actual = this.current.dimensionsResults[score]
        const wholes = this.rtype === 'byitems' ? this.current.wholesDimensionsResults[score] : 0
        const previous = this.hasPrevious ? this.previous.dimensionsResults[score] : 0

        let row = [
          {
            text: this.dimensions.find((c) => c.id === Number(score)).translate.label,
            margin: [0, 4.5, 0, -2.6],
            fontSize: 11,
            border: [false]
          },
          {
            text: `${this.$round(actual)}%`,
            margin: [0, 4.5, 0, -2.6],
            alignment: 'center',
            borderColor: ['#000000', '#000000', '#000000', pdfUtils.getColor(actual)],
            border: [false, false, false, true]
          },
          {
            text: this.hasPrevious ? `${this.$round(previous)}%` : '--',
            margin: [0, 4.5, 0, -2.6],
            alignment: 'center',
            borderColor: ['#000000', '#000000', '#000000', this.hasPrevious ? pdfUtils.getColor(previous) : '#000000'],
            border: [false, false, false, this.hasPrevious]
          },
          {
            text: this.hasPrevious ? `${this.$round(actual - previous)}` : '--',
            margin: [0, 4.5, 0, -2.6],
            alignment: 'center',
            border: [false]
          }
        ]

        if (this.rtype === 'byitems') {
          const gap = actual - wholes
          row = row.concat([
            {
              text: `${this.$round(wholes)}%`,
              margin: [0, 4.5, 0, -2.6],
              alignment: 'center',
              border: [false]
            },
            {
              text: gap ? this.$round(gap) : '--',
              margin: [0, 4.5, 0, -2.6],
              alignment: 'center',
              border: [false]
            }
          ])
        }

        rows.push(row)
      }

      return [
        {
          ...pdfUtils.generateTitle(this.$t('engagementReport.ranking'), [0, 0, 0, 0], 'before', 37, '#222222'),
          pageOrientation: 'portrait'
        },
        pdfUtils.generateTitle(this.$t('engagementReport.ranking_of_dimensions'), [0, 10, 0, 0], '', 24, '#111111', true, true),
        // * ------------------------ *
        // * DIMENSIONS RANKING TABLE *
        // * ------------------------ *
        {
          image: this.rtype === 'byitems' ? popRankingTableBase64 : gralRankingTableBase64,
          absolutePosition: { x: 41, y: 140 }
        },
        {
          margin: [1.5, 14.5, 22, 0],
          table: {
            widths: this.rankingTblWidths[this.rtype],
            body: [
              this.getRankingTablesHeaders('dimension'),
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
