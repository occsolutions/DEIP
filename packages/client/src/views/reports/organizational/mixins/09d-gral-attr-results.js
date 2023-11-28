
import pdfUtils from '../../utils/pdf'
import gralAttributeTableBase64 from '../../base64files/gral-attr-results-table'
import popAttributeTableBase64 from '../../base64files/pop-attr-results-table'

export default {
  methods: {
    $generateAttributesResults () {
      const attrTblWidths = {
        byitems: ['18.88%', '32.63%', '9.88%', '9.9%', '10.1%', '11.2%', '9%'],
        general: ['18.5%', '54.25%', '9.6%', '9.65%', '9.6%']
      }

      const headers = {
        byitems: [
          {
            text: this.$t('engagementReport.actual_organization'),
            margin: [0, 0, 0, -1.8],
            fontSize: 10,
            alignment: 'center',
            bold: true,
            border: [false]
          },
          {
            text: this.$t('engagementReport.gap'),
            margin: [0, 7, 0, -1.8],
            fontSize: 10,
            alignment: 'center',
            bold: true,
            border: [false]
          }
        ],
        general: []
      }

      const totalsRow = [
        {
          text: this.$t('engagementReport.total'),
          margin: [3, 4.6, 0, -0.4],
          bold: true,
          border: [false]
        },
        {
          text: '',
          margin: [0, 4.7, 0, -0.4],
          border: [false]
        },
        {
          text: `${this.$calcTotal(this.current.attributesResults)}%`,
          margin: [0, 4.7, 0, -0.4],
          bold: true,
          alignment: 'center',
          borderColor: ['#000000', '#000000', '#000000', pdfUtils.getColor(this.$calcTotal(this.current.attributesResults))],
          border: [false, false, false, true]
        },
        {
          text: this.hasPrevious ? `${this.$calcTotal(this.previous.attributesResults)}%` : '--',
          margin: [0, 4.7, 0, -0.4],
          bold: true,
          alignment: 'center',
          borderColor: ['#000000', '#000000', '#000000', this.hasPrevious ? pdfUtils.getColor(this.$calcTotal(this.previous.attributesResults)) : '#000000'],
          border: [false, false, false, this.hasPrevious]
        },
        {
          text: this.hasPrevious ? `${this.$round(this.$calcTotal(this.current.attributesResults, true) - this.$calcTotal(this.previous.attributesResults, true))}` : '--',
          margin: [0, 4.7, 0, -0.4],
          bold: true,
          alignment: 'center',
          border: [false]
        }
      ]

      if (this.rtype === 'byitems') {
        const whole_gap = this.$calcTotal(this.current.attributesResults, true) - this.$calcTotal(this.current.wholesAttributesResults, true)
        totalsRow.push(
          {
            text: `${this.$calcTotal(this.current.wholesAttributesResults)}%`,
            margin: [0, 4.7, 0, -0.4],
            bold: true,
            alignment: 'center',
            border: [false]
          },
          {
            text: whole_gap ? this.$round(whole_gap) : '--',
            margin: [0, 4.7, 0, -0.4],
            bold: true,
            alignment: 'center',
            border: [false]
          }
        )
      }

      const generateAttributesTableRows = (dimensions, attributes) => {
        const rows = []
        for (const atr in this.current.attributesResults) {
          if (atr === 'null') continue
          let row = [
            {
              text: dimensions[atr].title,
              margin: [3, 2, 0, -5],
              rowSpan: 3,
              border: [false]
            },
            {
              text: dimensions[atr].attributes[attributes[atr]],
              margin: [3, this.rtype === 'byitems' ? 4 : 3.15, 0, -5],
              fontSize: this.rtype === 'byitems' ? 8 : 10,
              border: [false]
            },
            {
              text: `${this.$round(this.current.attributesResults[atr])}%`,
              margin: [0, 2.5, 0, -4.6],
              alignment: 'center',
              borderColor: ['#000000', '#000000', '#000000', pdfUtils.getColor(this.current.attributesResults[atr])],
              border: [false, false, false, true]
            },
            {
              text: this.hasPrevious ? `${this.$round(this.previous.attributesResults[atr])}%` : '--',
              margin: [0, 2.5, 0, -4.6],
              alignment: 'center',
              borderColor: ['#000000', '#000000', '#000000', this.hasPrevious ? pdfUtils.getColor(this.previous.attributesResults[atr]) : '#000000'],
              border: [false, false, false, this.hasPrevious]
            },
            {
              text: this.hasPrevious ? `${this.$round(this.current.attributesResults[atr] - this.previous.attributesResults[atr])}` : '--',
              margin: [0, 2.5, 0, -4.6],
              alignment: 'center',
              border: [false]
            }
          ]

          if (this.rtype === 'byitems') {
            const gap = this.current.attributesResults[atr] - this.current.wholesAttributesResults[atr]
            row = row.concat([
              {
                text: `${this.$round(this.current.wholesAttributesResults[atr])}%`,
                margin: [0, 2.5, 0, -4.6],
                alignment: 'center',
                border: [false]
              },
              {
                text: gap ? this.$round(gap) : '--',
                margin: [0, 2.5, 0, -4.6],
                alignment: 'center',
                border: [false]
              }
            ])
          }

          rows.push(row)
        }
        return rows
      }

      return [
        {
          ...pdfUtils.generateTitle(this.$t('engagementReport.results_by_dim_attr'), [0, -1, 0, 0], 'before', 30, '#111111', true, true),
          pageOrientation: 'landscape'
        },
        // * ------------------------ *
        // * ATTRIBUTES RESULTS TABLE *
        // * ------------------------ *
        {
          image: this.rtype === 'byitems' ? popAttributeTableBase64 : gralAttributeTableBase64,
          absolutePosition: { x: 41, y: 92 }
        },
        {
          margin: [1, 18, 0, 0],
          table: {
            widths: attrTblWidths[this.rtype],
            body: [
              // Headers
              [
                {
                  text: this.$t('engagementReport.dimension'),
                  margin: [3, 7, 0, -1.8],
                  fontSize: 10,
                  bold: true,
                  border: [false]
                },
                {
                  text: this.$t('engagementReport.attribute'),
                  margin: [3, 7, 0, -1.8],
                  fontSize: 10,
                  bold: true,
                  border: [false]
                },
                {
                  text: this.$t('engagementReport.current_population') + ' *',
                  margin: [-2.5, 0, 0, -1.8],
                  fontSize: 10,
                  alignment: 'center',
                  bold: true,
                  border: [false]
                },
                {
                  text: this.$t('engagementReport.preview_population'),
                  margin: [-2, 0, 0, -1.8],
                  fontSize: 10,
                  alignment: 'center',
                  bold: true,
                  border: [false]
                },
                {
                  text: this.$t('engagementReport.rate'),
                  margin: [0, 7, 0, -1.8],
                  fontSize: 10,
                  alignment: 'center',
                  bold: true,
                  border: [false]
                },
                ...headers[this.rtype]
              ],
              // Body
              ...generateAttributesTableRows({
                1: this.$t('engagementReport.my_inspiration'),
                2: this.$t('engagementReport.my_inspiration'),
                3: this.$t('engagementReport.my_inspiration'),
                4: this.$t('engagementReport.my_job'),
                5: this.$t('engagementReport.my_job'),
                6: this.$t('engagementReport.my_job'),
                7: this.$t('engagementReport.positive_work_enviroment'),
                8: this.$t('engagementReport.positive_work_enviroment'),
                9: this.$t('engagementReport.positive_work_enviroment'),
                10: this.$t('engagementReport.my_team'),
                11: this.$t('engagementReport.my_team'),
                12: this.$t('engagementReport.my_team'),
                13: this.$t('engagementReport.my_development_and_learning'),
                14: this.$t('engagementReport.my_development_and_learning'),
                15: this.$t('engagementReport.my_development_and_learning'),
                16: this.$t('engagementReport.the_leaders'),
                17: this.$t('engagementReport.the_leaders'),
                18: this.$t('engagementReport.the_leaders')
              }, {
                1: 0,
                2: 1,
                3: 2,
                4: 0,
                5: 1,
                6: 2,
                7: 0,
                8: 1,
                9: 2,
                10: 0,
                11: 1,
                12: 2,
                13: 0,
                14: 1,
                15: 2,
                16: 0,
                17: 1,
                18: 2
              }),
              totalsRow
            ]
          },
          layout: {
            hLineWidth: () => {
              return 3
            }
          }
        },
        {
          margin: [2, 4, 0, 0],
          text: this.$t('engagementReport.results_by_attribute_legend'),
          fontSize: 8.5
        }
      ]
    }
  }
}
