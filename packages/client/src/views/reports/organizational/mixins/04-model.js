
import pdfUtils from '../../utils/pdf'

import LogoBackgroundBase64 from '../../base64Files/logo-bg'
import ModelBase64 from '../../base64Files/model'

export default {
  methods: {
    getVariables (dimKey) {
      const rows = []
      for (const varKey of Object.keys(this.evaluationData.questionnaire.evaluations[dimKey])) {
        rows.push([
          {
            text: this.$t(`Views.Questionnaires.edit.v_${varKey}`),
            bold: true,
            fontSize: 17,
            color: '#222222',
            alignment: 'center'
          }
        ])
      }

      return rows
    },
    dimTable (dimKey, dimColor, align, marginTop = -1) {
      return {
        layout: 'noBorders',
        margin: [align === 'right' ? 77 : -3, marginTop, -3, 0],
        table: {
          widths: [align === 'right' ? '100%' : '77%'],
          body: [
            [{
              text: this.$t(`Views.Questionnaires.edit.d_${dimKey}`).toUpperCase(),
              bold: true,
              fontSize: 24,
              color: dimColor,
              alignment: 'center',
              lineHeight: 1.4
            }],
            ...this.getVariables(dimKey)
          ]
        }
      }
    },
    $generateModelDescription () {
      return [
        // Page Title
        pdfUtils.generateHeaderTitle(this.$t('Views.Evaluations.report.toc.model')),
        {
          text: this.$t('Views.Evaluations.report.model.first_paragraph'),
          margin: [25, 40, 15, 0],
          color: '#222222',
          alignment: 'justify'
        },
        {
          text: this.$t('Views.Evaluations.report.model.second_paragraph'),
          margin: [25, 10, 15, 0],
          color: '#222222',
          alignment: 'justify'
        },
        {
          absolutePosition: { x: 311, y: 272 },
          image: LogoBackgroundBase64,
          fit: [220, 220]
        },
        {
          layout: 'noBorders',
          margin: [25, 20, 15, 0],
          table: {
            widths: ['50%', '50%'],
            heights: [160, 160],
            body: [
              [
                this.dimTable('professional', '#1999da', 'left'),
                this.dimTable('physical', '#51c7af', 'right')
              ],
              [
                this.dimTable('emotional', '#ec604d', 'left', 32),
                this.dimTable('mental', '#7d838d', 'right', 32)
              ]
            ]
          }
        },
        // Image Page
        pdfUtils.generateHeaderTitle(this.$t('Views.Evaluations.report.toc.model'), false),
        {
          image: ModelBase64,
          fit: [730, 760],
          margin: [0, 40, 0, 0],
          alignment: 'center'
        }
      ]
    }
  }
}
