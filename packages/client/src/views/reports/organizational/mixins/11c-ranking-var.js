
import pdfUtils from '../../utils/pdf'
import gralRankingTableBase64 from '../../base64files/gral-ranking-table'
import popRankingTableBase64 from '../../base64files/pop-ranking-table'

export default {
  methods: {
    generateVariablesRankingTablesRows (count, type, completeContext = '') {
      const scores = this.$sortKeys(this.current.variablesResults, type)

      let rows = []
      for (const score of scores) {
        const actual = this.current.variablesResults[score]
        const wholes = this.rtype === 'byitems' ? this.current.wholesVariablesResults[score] : 0
        const previous = this.hasPrevious ? this.previous.variablesResults[score] : 0

        let lineHeight
        let margin = [0, 5, 0, -2]
        if (this.rtype === 'byitems') {
          margin = [0, 0.3, 0, -4]
          lineHeight = 1
        }

        let row = [
          {
            text: this.variables.find((c) => c.id === Number(score)).translate.label,
            margin,
            fontSize: this.rtype === 'byitems' ? 8 : 10,
            lineHeight,
            border: [false]
          },
          {
            text: `${this.$round(actual)}%`,
            margin: [0, 4, 0, -2],
            alignment: 'center',
            borderColor: ['#000000', '#000000', '#000000', pdfUtils.getColor(actual)],
            border: [false, false, false, true]
          },
          {
            text: this.hasPrevious ? `${this.$round(previous)}%` : '--',
            margin: [0, 4, 0, -2],
            alignment: 'center',
            borderColor: ['#000000', '#000000', '#000000', this.hasPrevious ? pdfUtils.getColor(previous) : '#000000'],
            border: [false, false, false, this.hasPrevious]
          },
          {
            text: this.hasPrevious ? `${this.$round(actual - previous)}` : '--',
            margin: [0, 4, 0, -2],
            alignment: 'center',
            border: [false]
          }
        ]

        if (this.rtype === 'byitems') {
          const gap = actual - wholes
          row = row.concat([
            {
              text: `${this.$round(wholes)}%`,
              margin: [0, 4, 0, -2],
              alignment: 'center',
              border: [false]
            },
            {
              text: gap ? this.$round(gap) : '--',
              margin: [0, 4, 0, -2],
              alignment: 'center',
              border: [false]
            }
          ])
        }

        rows.push(row)
      }
      let i = 0
      const footerArr = []
      for (const row of rows) {
        if (i === count && this.hasPrevious) {
          if (row[1].text === rows[i - 1][1].text) {
            if (row[2].text === rows[i - 1][2].text) {
              if (row[3].text === rows[i - 1][3].text) {
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
          case 'positive_variable':
            this.rankingLowVarFooterContent = {
              text: [this.$t('engagementReport.positive_variable_footer') + '"' +
              rows[5][0] + '": ', concatText],
              margin: [0, 0, 20, 15]
            }
            break
          case 'negative_variable':
            this.rankingLowVarFooterContent = {
              text: [this.$t('engagementReport.negative_variable_footer') + '"' +
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
    $generateVariableRanking () {
      return [
        pdfUtils.generateTitle(this.$t('engagementReport.ranking'), [0, 0, 0, 0], 'before', 37, '#222222', false),
        pdfUtils.generateTitle(this.$t('engagementReport.ranking_of_the_variables'), [0, 10, 0, 0], '', 24, '#111111', true, true),
        {
          text: this.$t('engagementReport.variables_with_higher_score'),
          margin: [0, 15, 0, 0],
          fontSize: 17,
          color: '#444444'
        },
        // HIGHER ATTRIBUTES RANKING TABLE
        {
          image: this.rtype === 'byitems' ? popRankingTableBase64 : gralRankingTableBase64,
          absolutePosition: { x: 40.5, y: 170.5 }
        },
        {
          margin: [1.5, 5, 22, 0],
          table: {
            widths: this.rankingTblWidths[this.rtype],
            body: [
              this.getRankingTablesHeaders('variable'),
              ...this.generateVariablesRankingTablesRows(6, false, 'positive_variable')
            ]
          },
          layout: {
            hLineWidth: () => {
              return 3
            }
          }
        },
        {
          text: this.$t('engagementReport.variables_with_lower_score'),
          margin: [0, 33, 0, 0],
          fontSize: 17,
          color: '#444444'
        },
        // LOWER ATTRIBUTES RANKING TABLE
        {
          image: this.rtype === 'byitems' ? popRankingTableBase64 : gralRankingTableBase64,
          absolutePosition: { x: 40.5, y: 423 }
        },
        {
          margin: [1.5, 5, 22, 0],
          table: {
            widths: this.rankingTblWidths[this.rtype],
            body: [
              this.getRankingTablesHeaders('variable'),
              ...this.generateVariablesRankingTablesRows(6, true, 'negative_variable')
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
