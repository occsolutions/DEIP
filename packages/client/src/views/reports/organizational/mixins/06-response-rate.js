
import pdfUtils from '../../utils/pdf'

export default {
  methods: {
    $generateResponseRate () {
      const dynamicWidth = this.expectedPolls < 999
        ? '57%'
        : this.expectedPolls > 999 && this.expectedPolls < 9999
          ? '72%'
          : '87%'

      return [
        // Page Title
        pdfUtils.generateHeaderTitle(this.$t('Views.Evaluations.report.toc.response_rate')),
        {
          columns: [
            // LEFT COLUMN
            {
              width: '30%',
              margin: [25, 140, 0, 0],
              table: {
                widths: [dynamicWidth],
                body: [
                  [
                    {
                      text: this.$t('Views.Evaluations.report.organizational.total_expected'),
                      margin: [0, 0, 0, 0],
                      fontSize: 13,
                      color: '#222222'
                    }
                  ],
                  [
                    {
                      text: this.expectedPolls,
                      margin: [0, 0, 0, 0],
                      fontSize: 50,
                      color: '#222222',
                      alignment: 'right',
                      bold: true,
                      characterSpacing: 0.1
                    }
                  ],
                  [
                    {
                      text: this.$t('Views.Evaluations.report.organizational.total_obtained'),
                      margin: [0, 0, 0, 0],
                      fontSize: 13,
                      color: '#222222'
                    }
                  ],
                  [
                    {
                      text: this.completedPolls,
                      margin: [0, 0, 0, 0],
                      fontSize: 50,
                      color: '#222222',
                      alignment: 'right',
                      bold: true,
                      characterSpacing: 0.1
                    }
                  ]
                ]
              },
              layout: 'noBorders'
            },
            // RIGHT COLUMN
            {
              image: this.responseRatePie,
              fit: [670, 670],
              margin: [0, -7, 7, 0],
              alignment: 'center'
            }
          ]
        }
      ]
    }
  }
}
