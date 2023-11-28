
import pdfUtils from '../../utils/pdf'
import gralRankingTableBase64 from '../../base64files/gral-ranking-table'
import popRankingTableBase64 from '../../base64files/pop-ranking-table'

export default {
  methods: {
    generateAttributesTrendTablesRows (count, type, completeContext = '') {
      const isByItems = this.rtype === 'byitems'
      const scores = this.$sortKeys(this.current.attributesResults, type)
      const maxLabelLength = 39

      let rows = []
      for (const score of scores) {
        const actual = this.current.attributesResults[score]
        const wholes = isByItems ? this.current.wholesAttributesResults[score] : 0
        const previous = this.hasPrevious ? this.previous.attributesResults[score] : 0

        let label = this.attributes.find((c) => c.id === Number(score)).translate.label
        if (label.length > maxLabelLength) {
          label = label.slice(0, maxLabelLength - 1) + '.'
        }
        let row = [
          {
            text: this.hasPrevious ? label : '',
            margin: isByItems ? [0, 6.2, 0, -2.4] : [0, 4.9, 0, -2.3],
            fontSize: isByItems ? 8 : 10,
            border: [false]
          },
          {
            text: this.hasPrevious ? `${this.$round(actual)}%` : '--',
            margin: isByItems ? [0, 4.4, 0, -2.4] : [0, 4, 0, -2.3],
            alignment: 'center',
            borderColor: ['#000000', '#000000', '#000000', pdfUtils.getColor(actual)],
            border: [false, false, false, this.hasPrevious]
          },
          {
            text: this.hasPrevious ? `${this.$round(previous)}%` : '--',
            margin: isByItems ? [0, 4.4, 0, -2.4] : [0, 4, 0, -2.3],
            alignment: 'center',
            borderColor: ['#000000', '#000000', '#000000', pdfUtils.getColor(previous)],
            border: [false, false, false, this.hasPrevious]
          },
          {
            text: this.hasPrevious ? `${this.$round(actual - previous)}` : '--',
            margin: isByItems ? [0, 4.4, 0, -2.4] : [0, 4, 0, -2.3],
            alignment: 'center',
            border: [false]
          }
        ]

        if (isByItems) {
          const gap = actual - wholes
          row = row.concat([
            {
              text: this.hasPrevious ? `${this.$round(wholes)}%` : '--',
              margin: isByItems ? [0, 4.4, 0, -2.4] : [0, 4, 0, -2.3],
              alignment: 'center',
              border: [false]
            },
            {
              text: this.hasPrevious && gap ? this.$round(gap) : '--',
              margin: isByItems ? [0, 4.4, 0, -2.4] : [0, 4, 0, -2.3],
              alignment: 'center',
              border: [false]
            }
          ])
        }

        rows.push(row)
      }

      if (completeContext === 'positive_attribute') {
        rows.sort((a, b) => b[3].text - a[3].text)
      } else {
        rows.sort((a, b) => a[3].text - b[3].text)
      }

      let i = 0
      const footerArr = []
      for (const row of rows) {
        if (i === count && this.hasPrevious) {
          if (row[3].text === rows[i - 1][3].text) {
            if (row[1].text === rows[i - 1][1].text) {
              if (row[2].text === rows[i - 1][2].text) {
                footerArr.push(row)
                count++
              } else if (parseFloat(row[2].text) > parseFloat(rows[i - 1][2].text)) {
                if (!footerArr.length) {
                  rows[i - 1] = row
                }
                break
              } else {
                break
              }
            } else if (parseFloat(row[1].text) > parseFloat(rows[i - 1][1].text)) {
              if (!footerArr.length) {
                rows[i - 1] = row
              }
              break
            } else {
              break
            }
          } else {
            break
          }
        }
        i++
      }

      rows = rows.slice(0, 6)

      if (footerArr.length) {
        const concatText = { text: '', italics: true }
        for (let i = 0; i < footerArr.length; i++) {
          concatText.text += footerArr[i][0]
          concatText.text += i === (footerArr.length - 1) ? '.' : ', '
        }
        switch (completeContext) {
          case 'positive_attribute':
            this.rankingHighAttrFooterContent = {
              text: [this.$t('engagementReport.positive_attribute_footer') + '"' +
              rows[5][0] + '" : ', concatText],
              margin: [0, 0, 20, 15]
            }
            break
          case 'negative_attribute':
            this.rankingLowAttrFooterContent = {
              text: [this.$t('engagementReport.negative_attribute_footer') + '"' +
              rows[5][0] + '": ', concatText],
              margin: [0, 0, 20, 15]
            }
            break
          default:
            break
        }
      }

      return rows
    },
    $generateAttributeTrend () {
      return [
        pdfUtils.generateTitle(this.$t('engagementReport.rates'), [0, 0, 0, 0], 'before', 37, '#222222', false),
        pdfUtils.generateTitle(this.$t('engagementReport.rates_by_attributes'), [0, 10, 0, 0], '', 24, '#111111', true, true),
        {
          text: this.$t('engagementReport.highest_positive_rate_attribute'),
          margin: [0, 15, 0, 0],
          fontSize: 17,
          color: '#444444'
        },
        // HIGHER ATTRIBUTES TREND TABLE
        {
          image: this.rtype === 'byitems' ? popRankingTableBase64 : gralRankingTableBase64,
          absolutePosition: { x: 40.5, y: 170.5 }
        },
        {
          margin: [1.5, 5, 22, 0],
          table: {
            widths: this.trendTblWidths[this.rtype],
            body: [
              this.getTrendTablesHeaders('attribute'),
              ...this.generateAttributesTrendTablesRows(6, false, 'positive_attribute')
            ]
          },
          layout: {
            hLineWidth: () => {
              return 3
            }
          }
        },
        {
          text: this.$t('engagementReport.highest_negative_rate_attribute'),
          margin: [0, 33, 0, 0],
          fontSize: 17,
          color: '#444444'
        },
        // LOWER ATTRIBUTES TREND TABLE
        {
          image: this.rtype === 'byitems' ? popRankingTableBase64 : gralRankingTableBase64,
          absolutePosition: { x: 40.5, y: 422 }
        },
        {
          margin: [1.5, this.rtype === 'byitems' ? 4.5 : 5, 22, 0],
          table: {
            widths: this.trendTblWidths[this.rtype],
            body: [
              this.getTrendTablesHeaders('attribute'),
              ...this.generateAttributesTrendTablesRows(6, true, 'negative_attribute')
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
