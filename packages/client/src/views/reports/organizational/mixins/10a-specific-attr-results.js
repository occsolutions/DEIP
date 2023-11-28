
import pdfUtils from '../../utils/pdf'

import gralSpecificAttributeTableBase64 from '../../base64files/gral-attr-var-table'
import tableLegendBase64 from '../../base64files/table-legend'

export default {
  methods: {
    $generateSpecificResults () {
      const barsWidth = 325
      const barsHeight = 50

      const titles = {
        1: this.$t('engagementReport.my_inspiration.title'),
        4: this.$t('engagementReport.my_job.title'),
        7: this.$t('engagementReport.positive_work_enviroment.title'),
        10: this.$t('engagementReport.my_team.title'),
        13: this.$t('engagementReport.my_development_and_learning.title'),
        16: this.$t('engagementReport.the_leaders.title')
      }
      const results = []
      const breaks = [1, 4, 7, 10, 13, 16, 19]

      let i = 1
      for (const tab of this.variablesTables) {
        let rows = []

        const chunk = Object
          .entries(this.current.variablesResults)
          .slice(tab.min, tab.max)
          .map((arr) => arr[0])

        let actualTotal = 0
        let previousTotal = 0

        // VARIABLES ROWS
        const varsMargin = [0, 7, 0, -1.4]
        let j = 1
        for (const vari of chunk) {
          const actTotal = this.current.variablesResults[vari]
          const prevTotal = this.hasPrevious ? this.previous.variablesResults[vari] : 0

          const row = [
            {
              text: tab.titles[vari],
              margin: [1, 0.5, 0, -5],
              fontSize: 9,
              color: '#222222',
              border: [false, false, false, false]
            },
            {
              text: `${this.$round(actTotal)}%`,
              margin: varsMargin,
              alignment: 'center',
              borderColor: ['#000000', '#000000', '#000000', pdfUtils.getColor(actTotal)],
              border: [false, false, false, true]
            },
            {
              text: this.hasPrevious ? `${this.$round(prevTotal)}%` : '--',
              margin: varsMargin,
              alignment: 'center',
              borderColor: ['#000000', '#000000', '#000000', this.hasPrevious ? pdfUtils.getColor(prevTotal) : '#000000'],
              border: [false, false, false, this.hasPrevious]
            },
            {
              text: this.hasPrevious ? `${this.$round(actTotal - prevTotal)}` : '--',
              margin: varsMargin,
              alignment: 'center',
              border: [false, false, false, false]
            }
          ]

          row.push({
            image: this.bars[`curAttr${i}${j}`],
            margin: [-37, -12, 0, -20],
            width: barsWidth,
            height: barsHeight,
            border: [false, false, false, false]
          })

          rows.push(row)

          actualTotal += actTotal
          previousTotal += prevTotal

          j++
        }

        actualTotal = actualTotal ? actualTotal / 3 : 0
        previousTotal = previousTotal ? previousTotal / 3 : 0

        // ATTRIBUTES ROWS
        const attrsMargin = [0, 7.4, 0, 0.5]
        const attributeRow = [
          {
            text: tab.titles[0],
            margin: [1, 0.4, 0, -5],
            fontSize: 10,
            bold: true,
            border: [false, false, false, false]
          },
          {
            text: `${this.$round(actualTotal)}%`,
            margin: attrsMargin,
            alignment: 'center',
            borderColor: ['#000000', '#000000', '#000000', pdfUtils.getColor(actualTotal)],
            border: [false, false, false, true]
          },
          {
            text: this.hasPrevious ? `${this.$round(previousTotal)}%` : '--',
            margin: attrsMargin,
            alignment: 'center',
            borderColor: ['#000000', '#000000', '#000000', this.hasPrevious ? pdfUtils.getColor(previousTotal) : '#000000'],
            border: [false, false, false, this.hasPrevious]
          },
          {
            text: this.hasPrevious ? `${this.$round(actualTotal - previousTotal)}` : '--',
            margin: attrsMargin,
            alignment: 'center',
            border: [false, false, false, false]
          }
        ]

        attributeRow.push({
          image: this.bars[`totAttr${i}`],
          margin: [-37, -10, 0, -20],
          width: barsWidth,
          height: barsHeight,
          border: [false, false, false, false]
        })

        rows = [attributeRow, ...rows]

        let displayableHeaders = []
        if (breaks.includes(i)) {
          results.push({
            pageBreak: 'before',
            columns: [{
              width: '57%',
              text: this.$t('engagementReport.results_detail_by_var'),
              font: 'League Spartan',
              fontSize: 25.5,
              margin: [0, 0.5, 0, 25],
              bold: true
            }, {
              width: '*',
              text: titles[i],
              fontSize: 23.5,
              margin: [0, -4, -10, 25],
              color: '#444444'
            }]
          }, {
            image: gralSpecificAttributeTableBase64,
            absolutePosition: { x: 41, y: 92 }
          })

          displayableHeaders = [
            {
              text: this.$t('engagementReport.att_var'),
              margin: [2, 10.5, 0, -3.9],
              fontSize: 11,
              alignment: 'left'
            },
            {
              text: this.$t('engagementReport.current_population'),
              margin: [-2, 3, 0, -3.9],
              fontSize: 11
            },
            {
              text: this.$t('engagementReport.preview_population'),
              margin: [-1, 3, 0, -3.9],
              fontSize: 11
            },
            {
              text: this.$t('engagementReport.rate'),
              margin: [0, 10.5, 0, -3.9],
              fontSize: 11
            }
          ]

          displayableHeaders.push('')
        }

        const result = {
          margin: [1, -5, -10, 0],
          table: pdfUtils.generateVariablesTable(
            displayableHeaders,
            rows,
            ['33.8%', '7.6%', '7.5%', '9.5%', '*']
          ),
          layout: {
            hLineWidth: () => {
              return 3
            }
          }
        }

        results.push(result)
        i++

        if (breaks.includes(i)) {
          results.push(
            {
              image: tableLegendBase64,
              fit: [50, 50],
              absolutePosition: { x: 40, y: 498 }
            },
            {
              margin: [25, 22, 0, 0],
              table: {
                heights: 25,
                body: [
                  [{
                    text: this.$t('engagementReport.current_population'),
                    fontSize: 10,
                    color: '#222222'
                  }],
                  [{
                    text: this.$t('engagementReport.preview_population'),
                    fontSize: 10,
                    color: '#222222'
                  }]
                ]
              },
              layout: 'noBorders'
            }
          )
        }
      }

      return results
    }
  }
}
