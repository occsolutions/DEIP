
import pdfUtils from '../../utils/pdf'

import SquareBase64 from '../../base64Files/squareWithColors'

export default {
  methods: {
    $generateMethodology () {
      return [
        // Page Title
        pdfUtils.generateHeaderTitle(this.$t('Views.Evaluations.report.toc.methodology')),
        {
          text: this.$t('Views.Evaluations.report.methodology.first_paragraph'),
          margin: [25, 40, 15, 0],
          color: '#222222',
          alignment: 'justify'
        },
        {
          text: this.$t('Views.Evaluations.report.methodology.second_paragraph'),
          margin: [25, 0, 15, 0],
          color: '#222222',
          lignment: 'justify'
        },
        {
          layout: 'noBorders',
          table: {
            body: [
              [
                {
                  image: SquareBase64,
                  fit: [400, 300],
                  margin: [10, 40, 0, 0],
                  alignment: 'left'
                },
                {
                  layout: 'noBorders',
                  margin: [0, -30, 15, 0],
                  table: {
                    body: [
                      [
                        { text: this.$t('Views.Evaluations.report.methodology.third_paragraph'), margin: [10, 110, 0, 0], color: '#222222', alignment: 'justify' }
                      ],
                      [
                        { text: this.$t('Views.Evaluations.report.methodology.fifth_paragraph'), margin: [10, 0, 0, 0], color: '#222222', alignment: 'justify' }
                      ],
                      [
                        { text: this.$t('Views.Evaluations.report.methodology.sixth_paragraph'), margin: [10, 0, 0, 0], color: '#222222', alignment: 'justify' }
                      ],
                      [
                        { text: this.$t('Views.Evaluations.report.methodology.seventh_paragraph'), margin: [10, 0, 0, 0], color: '#222222', alignment: 'justify' }
                      ]
                    ]
                  }
                }
              ]
            ]
          }
        },
        {
          layout: 'noBorders',
          margin: [0, -260, 0, 0],
          table: {
            body: [
              [
                { text: this.$t('Views.Evaluations.report.methodology.scores.very_good'), margin: [88, 3, 0, 0] }
              ]
            ]
          }
        },
        {
          layout: 'noBorders',
          table: {
            body: [
              [
                { text: this.$t('Views.Evaluations.report.methodology.scores.good'), margin: [88, 28, 0, 0] }
              ]
            ]
          }
        },
        {
          layout: 'noBorders',
          table: {
            body: [
              [
                { text: this.$t('Views.Evaluations.report.methodology.scores.acceptable'), margin: [88, 28, 0, 0] }
              ]
            ]
          }
        },
        {
          layout: 'noBorders',
          table: {
            body: [
              [
                { text: this.$t('Views.Evaluations.report.methodology.scores.bad'), margin: [88, 28, 0, 0] }
              ]
            ]
          }
        },
        {
          layout: 'noBorders',
          table: {
            body: [
              [
                { text: this.$t('Views.Evaluations.report.methodology.scores.very_bad'), margin: [88, 28, 0, 0] }
              ]
            ]
          }
        }
      ]
    }
  }
}
