
import pdfUtils from '../../utils/pdf'
import circleBase64 from '../../base64files/how-works'

export default {
  methods: {
    $generateHowItWorks () {
      const color = '#222222'
      const fontSize = 11
      const lineHeight = 1.4

      return [
        pdfUtils.generateTitle(this.$t('engagementReport.how_does_our_model_works'), [0, 0, 50, 0], 'before'),
        {
          image: circleBase64,
          fit: [200, 200],
          absolutePosition: { x: 200, y: 325 }
        },
        {
          text: this.$t('engagementReport.how_does_our_model_works_text'),
          margin: [0, 10, 20, 0],
          fontSize,
          lineHeight,
          color
        },
        // Section 1
        {
          margin: [15, 45, -20, 0],
          columns: [
            {
              width: '54%',
              text: this.$t('engagementReport.my_team.title'),
              fontSize: 12,
              lineHeight,
              bold: true
            },
            {
              text: this.$t('engagementReport.my_development_and_learning.title'),
              fontSize: 12,
              lineHeight,
              bold: true
            }
          ]
        },
        {
          margin: [15, 0, -20, 0],
          columns: [
            {
              width: '54%',
              text: this.$t('engagementReport.my_team.attributes'),
              fontSize,
              lineHeight,
              color
            },
            {
              text: this.$t('engagementReport.my_development_and_learning.attributes'),
              fontSize,
              lineHeight,
              color
            }
          ]
        },
        // Section 2
        {
          margin: [-10, 57, 0, 0],
          columns: [
            {
              width: '77%',
              text: this.$t('engagementReport.positive_work_enviroment.title'),
              fontSize: 12,
              lineHeight,
              bold: true
            },
            {
              text: this.$t('engagementReport.the_leaders.title'),
              fontSize: 12,
              lineHeight,
              bold: true
            }
          ]
        },
        {
          margin: [-10, 0, 0, 0],
          columns: [
            {
              width: '77%',
              text: this.$t('engagementReport.positive_work_enviroment.attributes'),
              fontSize,
              lineHeight,
              color
            },
            {
              text: this.$t('engagementReport.the_leaders.attributes'),
              fontSize,
              lineHeight,
              color
            }
          ]
        },
        // Section 3
        {
          margin: [45, 64, 0, 0],
          columns: [
            {
              width: '65%',
              text: this.$t('engagementReport.my_inspiration.title'),
              fontSize: 12,
              lineHeight,
              bold: true
            },
            {
              text: this.$t('engagementReport.my_job.title'),
              fontSize: 12,
              lineHeight,
              bold: true
            }
          ]
        },
        {
          margin: [45, 0, 0, 0],
          columns: [
            {
              width: '65%',
              text: this.$t('engagementReport.my_inspiration.attributes'),
              fontSize,
              lineHeight,
              color
            },
            {
              text: this.$t('engagementReport.my_job.attributes'),
              fontSize,
              lineHeight,
              color
            }
          ]
        }
      ]
    }
  }
}
