
import pdfUtils from '../../utils/pdf'
import gralTableBase64 from '../../base64files/gral-results-table'

export default {
  methods: {
    $generateGeneralResults () {
      // Current Score (General)
      this.current_general_score = this.$calcTotal(this.current.dimensionsResults)
      // Engagement Index (General)
      const general_engagement_index = this.$calcTotal(this.current.dimensionsResultsByCommittal)
      // Weighted Score (General)
      const weighted_general_score = this.$round((50 * (this.$calcTotal(this.current.dimensionsResultsByQuestionnaire) / 100)) + (50 * (this.$calcTotal(this.current.dimensionsResultsByCommittal) / 100)))
      // Employee Net Promoter Score (ENPS)
      const enps = this.currentPoll.enps ? this.$round(this.currentPoll.enps) : '0.00'

      return [
        pdfUtils.generateTitle(this.$t('engagementReport.results'), [0, -1, 0, 0], 'before', 44, '#222222', false),
        // * --------------------- *
        // * GENERAL RESULTS TABLE *
        // * --------------------- *
        {
          image: gralTableBase64,
          absolutePosition: { x: 41, y: 110 }
        },
        {
          margin: [1, 20, 0, 0],
          table: {
            widths: ['18.8%', '29.1%', '24.1%', '23.4%'],
            body: [
              // Headers
              [
                {
                  text: this.$t('engagementReport.current_population'),
                  margin: [0, 2, 0, 0],
                  alignment: 'center',
                  bold: true,
                  border: [false, false, false, false]
                },
                {
                  text: this.$t('engagementReport.engagement_index'),
                  margin: [0, 2, 0, 0],
                  alignment: 'center',
                  bold: true,
                  border: [false, false, false, false]
                },
                {
                  text: this.$t('engagementReport.weighted_score'),
                  margin: [0, 2, 0, 0],
                  alignment: 'center',
                  bold: true,
                  border: [false, false, false, false]
                },
                {
                  text: 'ENPS',
                  margin: [-5, 2, 0, 0],
                  alignment: 'center',
                  bold: true,
                  border: [false, false, false, false]
                }
              ],
              // Body
              [
                {
                  text: `${this.current_general_score}%`,
                  margin: [0, 8.5, 0, -2.4],
                  alignment: 'center',
                  bold: true,
                  fontSize: 17,
                  borderColor: ['#000000', '#000000', '#000000', pdfUtils.getColor(this.current_general_score)],
                  border: [false, false, false, true]
                },
                {
                  text: `${general_engagement_index}%`,
                  margin: [0, 8.5, 0, -2.4],
                  alignment: 'center',
                  bold: true,
                  fontSize: 17,
                  borderColor: ['#000000', '#000000', '#000000', pdfUtils.getColor(general_engagement_index)],
                  border: [false, false, false, true]
                },
                {
                  text: `${weighted_general_score}%`,
                  margin: [0, 8.5, 0, -2.4],
                  alignment: 'center',
                  bold: true,
                  fontSize: 17,
                  borderColor: ['#000000', '#000000', '#000000', pdfUtils.getColor(weighted_general_score)],
                  border: [false, false, false, true]
                },
                {
                  text: enps,
                  margin: [-5, 8.5, 0, -2.4],
                  alignment: 'center',
                  bold: true,
                  fontSize: 17,
                  borderColor: ['#000000', '#000000', '#000000', '#000000'],
                  border: [false, false, false, false]
                }
              ],
              // Footer
              [
                {
                  text: this.$t('engagementReport.current_population_desc'),
                  margin: [0, 4, 0, 0],
                  fontSize: 8,
                  color: '#777777',
                  border: [false, false, false, false]
                },
                {
                  text: this.$t('engagementReport.engagement_index_desc'),
                  margin: [0, 4, 0, 0],
                  fontSize: 8,
                  color: '#777777',
                  border: [false, false, false, false]
                },
                {
                  text: this.$t('engagementReport.weighted_score_desc'),
                  margin: [0, 4, 0, 0],
                  fontSize: 8,
                  color: '#777777',
                  border: [false, false, false, false]
                },
                {
                  text: this.$t('engagementReport.enps_score_desc'),
                  margin: [1, 4, 0, 0],
                  fontSize: 8,
                  color: '#777777',
                  border: [false, false, false, false]
                }
              ]
            ]
          },
          layout: {
            hLineWidth: (i, node) => {
              if (i === (node.table.body.length - 1)) {
                return 7
              }
              return 1
            }
          }
        }
      ]
    }
  }
}
