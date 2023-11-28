
import pdfUtils from '../../utils/pdf'
import gralDimensionTableBase64 from '../../base64files/gral-dimension-results-table'
import popDimensionTableBase64 from '../../base64files/pop-dimension-results-table'

export default {
  methods: {
    $generateDimensionResults () {
      const previous_general_result = this.hasPrevious ? this.$calcTotal(this.previous.dimensionsResults) : 0
      const whole_general_result = this.rtype === 'byitems' ? this.$calcTotal(this.current.wholesDimensionsResults) : 0
      const whole_gap = this.current_general_score - whole_general_result

      const dimTblWidths = {
        byitems: ['23%', '11.5%', '11.6%', '11.4%', '14%', '11.4%', '14.7%'],
        general: ['34.9%', '13.9%', '12.8%', '14.7%', '19%']
      }

      const headers = {
        byitems: [
          {
            text: this.$t('engagementReport.actual_organization'),
            margin: [0, 0, 0, this.rtype === 'byitems' ? 1.6 : -2.2],
            fontSize: this.rtype === 'byitems' ? 9 : 11,
            alignment: 'center',
            bold: true,
            border: [false]
          },
          {
            text: this.$t('engagementReport.gap'),
            margin: [0, 8, 0, this.rtype === 'byitems' ? 1.6 : -2.2],
            fontSize: this.rtype === 'byitems' ? 9 : 11,
            alignment: 'center',
            bold: true,
            border: [false]
          }
        ],
        general: []
      }

      const totalsRow = {
        byitems: [
          {
            text: `${this.$round(whole_general_result)}%`,
            margin: [0, 4, 0, -4],
            bold: true,
            alignment: 'center',
            border: [false]
          },
          {
            text: whole_gap ? this.$round(whole_gap) : '--',
            margin: [0, 4, 0, -4],
            bold: true,
            alignment: 'center',
            border: [false]
          }
        ],
        general: []
      }

      const generateDimensionsTableRows = (titles) => {
        const rows = []
        const results = (dim, cnt) => {
          const gap = this.current.dimensionsResults[dim] - this.current.wholesDimensionsResults[dim]
          return this.rtype === 'byitems'
            ? [
              {
                text: `${this.$round(this.current.wholesDimensionsResults[dim])}%`,
                margin: [0, cnt ? 4.5 : 0, 0, -4],
                alignment: 'center',
                border: [false]
              },
              {
                text: `${gap ? this.$round(gap) : '--'}`,
                margin: [0, cnt ? 4.5 : 0, 0, -4],
                alignment: 'center',
                border: [false]
              }
            ] : []
        }
        let cnt = 0
        for (const dim in this.current.dimensionsResults) {
          rows.push([
            {
              text: titles[dim].title,
              margin: [0, cnt ? 4.5 : 0, 0, -4],
              fontSize: this.rtype === 'byitems' ? 8 : 10,
              border: [false]
            },
            {
              text: `${this.$round(this.current.dimensionsResults[dim])}%`,
              margin: [0, cnt ? 4.5 : 0, 0, -4],
              alignment: 'center',
              borderColor: ['#000000', '#000000', '#000000', pdfUtils.getColor(this.current.dimensionsResults[dim])],
              border: [false, false, false, true]
            },
            {
              text: this.hasPrevious ? `${this.$round(this.previous.dimensionsResults[dim])}%` : '--',
              margin: [0, cnt ? 4.5 : 0, 0, -4],
              alignment: 'center',
              borderColor: ['#000000', '#000000', '#000000', pdfUtils.getColor(this.previous.dimensionsResults[dim])],
              border: [false, false, false, this.hasPrevious]
            },
            {
              text: this.hasPrevious ? `${this.$round(this.current.dimensionsResults[dim] - this.previous.dimensionsResults[dim])}` : '--',
              margin: [0, cnt ? 4.5 : 0, 0, -4],
              alignment: 'center',
              border: [false]
            },
            ...results(dim, cnt),
            {
              text: `${this.$round(this.current.dimensionsResultsByCommittal[dim])}%`,
              margin: [0, cnt ? 4.5 : 0, 0, -4],
              alignment: 'center',
              borderColor: ['#000000', '#000000', '#000000', pdfUtils.getColor(this.current.dimensionsResultsByCommittal[dim])],
              border: [false, false, false, true]
            }
          ])
          cnt++
        }
        return rows
      }

      return [
        pdfUtils.generateTitle(this.$t('engagementReport.results_by_dimension'), [0, 20, 0, 0], '', 24, '#111111', true, true),
        // * ------------------------ *
        // * DIMENSIONS RESULTS TABLE *
        // * ------------------------ *
        {
          image: this.rtype === 'byitems' ? popDimensionTableBase64 : gralDimensionTableBase64,
          absolutePosition: { x: 41, y: 275 }
        },
        {
          margin: [1, this.rtype === 'byitems' ? 3 : 1, 0, 0],
          table: {
            widths: dimTblWidths[this.rtype],
            body: [
              // Headers
              [
                {
                  text: this.$t('engagementReport.dimension'),
                  margin: [3, 7, 0, this.rtype === 'byitems' ? 1.6 : -2.2],
                  fontSize: this.rtype === 'byitems' ? 9 : 11,
                  bold: true,
                  border: [false]
                },
                {
                  text: this.$t('engagementReport.current_population') + ' *',
                  margin: [-2, 0, 0, this.rtype === 'byitems' ? 1.6 : -2.2],
                  fontSize: this.rtype === 'byitems' ? 9 : 11,
                  alignment: 'center',
                  bold: true,
                  border: [false]
                },
                {
                  text: this.$t('engagementReport.preview_population'),
                  margin: [0, 0, 0, this.rtype === 'byitems' ? 1.6 : -2.2],
                  fontSize: this.rtype === 'byitems' ? 9 : 11,
                  alignment: 'center',
                  bold: true,
                  border: [false]
                },
                {
                  text: this.$t('engagementReport.rate'),
                  margin: [0, 7, 0, this.rtype === 'byitems' ? 1.6 : -2.2],
                  fontSize: this.rtype === 'byitems' ? 9 : 11,
                  alignment: 'center',
                  bold: true,
                  border: [false]
                },
                ...headers[this.rtype],
                {
                  text: this.$t('engagementReport.engagement_index'),
                  margin: [0, 0, 0, this.rtype === 'byitems' ? 1.6 : -2.2],
                  fontSize: this.rtype === 'byitems' ? 9 : 11,
                  alignment: 'center',
                  bold: true,
                  border: [false]
                }
              ],
              // Body
              ...generateDimensionsTableRows({
                1: this.$t('engagementReport.my_inspiration'),
                2: this.$t('engagementReport.my_job'),
                3: this.$t('engagementReport.positive_work_enviroment'),
                4: this.$t('engagementReport.my_team'),
                5: this.$t('engagementReport.my_development_and_learning'),
                6: this.$t('engagementReport.the_leaders')
              }),
              [
                {
                  text: this.$t('engagementReport.total'),
                  margin: [0, 4, 0, -4],
                  bold: true,
                  border: [false]
                },
                {
                  text: `${this.$round(this.current_general_score)}%`,
                  margin: [0, 4, 0, -4],
                  bold: true,
                  alignment: 'center',
                  borderColor: ['#000000', '#000000', '#000000', pdfUtils.getColor(this.current_general_score)],
                  border: [false, false, false, true]
                },
                {
                  text: this.hasPrevious ? `${this.$round(previous_general_result)}%` : '--',
                  margin: [0, 4, 0, -4],
                  bold: true,
                  alignment: 'center',
                  borderColor: ['#000000', '#000000', '#000000', pdfUtils.getColor(previous_general_result)],
                  border: [false, false, false, this.hasPrevious]
                },
                {
                  text: this.hasPrevious ? `${this.$round(this.current_general_score - previous_general_result)}` : '--',
                  margin: [0, 4, 0, -4],
                  bold: true,
                  alignment: 'center',
                  border: [false]
                },
                ...totalsRow[this.rtype],
                {
                  text: `${this.$calcTotal(this.current.dimensionsResultsByCommittal)}%`,
                  margin: [0, 4, 0, -4],
                  bold: true,
                  alignment: 'center',
                  borderColor: ['#000000', '#000000', '#000000', pdfUtils.getColor(this.$calcTotal(this.current.dimensionsResultsByCommittal))],
                  border: [false, false, false, true]
                }
              ]
            ]
          },
          layout: {
            hLineWidth: () => {
              return 3
            }
          }
        },
        {
          margin: [2, 4, 0, -16],
          text: this.$t('engagementReport.results_by_dimension_legend'),
          fontSize: 8.5
        }
      ]
    }
  }
}
