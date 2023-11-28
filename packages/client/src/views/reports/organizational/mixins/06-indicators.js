
import pdfUtils from '../../utils/pdf'
import pulseLogoBase64 from '../../base64files/1a-pulse-logo-rotated'

export default {
  methods: {
    $generateIndicators () {
      const fontSize = 9
      const lineHeight = 1.1

      return [
        pdfUtils.generateTitle(this.$t('engagementReport.indicators'), [0, 0, -100, 0], 'before'),
        {
          image: pulseLogoBase64,
          fit: [340, 340],
          absolutePosition: { x: -175, y: 200 }
        },
        {
          text: this.$t('engagementReport.engagement_index'),
          margin: [0, 10, 0, 0],
          fontSize: 20,
          bold: true
        },
        {
          text: 'Cada dimensión del modelo tiene una pregunta que agrupa la esencia de esta. El promedio de estas preguntas lo llamamos índice de engagement.',
          margin: [0, 4, 0, 2],
          fontSize: 10
        },
        // Row 1
        {
          margin: [66, 20, 0, 0],
          columns: [
            {
              text: [
                { text: `${this.$t('engagementReport.my_inspiration.title').toUpperCase()}: `, bold: true },
                this.$t('engagementReport.my_inspiration.desc')
              ],
              fontSize,
              lineHeight
            }
          ]
        },
        // Row 2
        {
          margin: [122, 35, 0, 0],
          columns: [
            {
              text: [
                { text: `${this.$t('engagementReport.my_job.title').toUpperCase()}: `, bold: true },
                this.$t('engagementReport.my_job.desc')
              ],
              fontSize,
              lineHeight
            }
          ]
        },
        // Row 3
        {
          margin: [147, 37, 0, 0],
          columns: [
            {
              text: [
                { text: `${this.$t('engagementReport.positive_work_enviroment.title').toUpperCase()}: `, bold: true },
                this.$t('engagementReport.positive_work_enviroment.desc')
              ],
              fontSize,
              lineHeight
            }
          ]
        },
        // Row 4
        {
          margin: [140, 41, 0, 0],
          columns: [
            {
              text: [
                { text: `${this.$t('engagementReport.my_team.title').toUpperCase()}: `, bold: true },
                this.$t('engagementReport.my_team.desc')
              ],
              fontSize,
              lineHeight
            }
          ]
        },
        // Row 5
        {
          margin: [121, 30, 0, 0],
          columns: [
            {
              text: [
                { text: `${this.$t('engagementReport.my_development_and_learning.title').toUpperCase()}: `, bold: true },
                this.$t('engagementReport.my_development_and_learning.desc')
              ],
              fontSize,
              lineHeight
            }
          ]
        },
        // Row 6
        {
          margin: [71, 34, 0, 0],
          columns: [
            {
              text: [
                { text: `${this.$t('engagementReport.the_leaders.title').toUpperCase()}: `, bold: true },
                this.$t('engagementReport.the_leaders.desc')
              ],
              fontSize,
              lineHeight
            }
          ]
        },
        // ENPS
        {
          text: this.$t('engagementReport.enps_score_desc'),
          margin: [0, 25, 0, 0],
          fontSize: 20,
          bold: true
        },
        {
          text: [
            this.$t('engagementReport.enps_explanation1'),
            { text: this.$t('engagementReport.enps_explanation2'), bold: true }
          ],
          margin: [0, 6, 0, 0],
          fontSize: 10.5,
          lineHeight: 1.4
        },
        // Final line
        {
          text: this.$t('engagementReport.indicators_final_text'),
          margin: [0, 8, 0, 0],
          fontSize: 10.5,
          lineHeight: 1.4
        }
      ]
    }
  }
}
