
import LogoBase64 from '../../base64Files/logo'

const fontSizeBylength = [
  { min: 0, max: 30, fontSize: 19 },
  { min: 31, max: 34, fontSize: 18 },
  { min: 35, max: 38, fontSize: 16 },
  { min: 39, max: 42, fontSize: 14 },
  { min: 43, max: 57, fontSize: 12 },
  { min: 57, max: 70, fontSize: 10 },
  { min: 70, max: 9999999, fontSize: 8 }
]

const getFontSizeBylength = (l) => fontSizeBylength.find((fsbl) => fsbl.min <= l && fsbl.max >= l).fontSize

export default {
  data () {
    return {
      coverLogoWidth: 77,
      coverLogoHeight: 77,
      coverLogoRatio: 1
    }
  },
  methods: {
    $generateCover () {
      const pollNameFontSize = getFontSizeBylength((this.evaluationData.name || '').length)
      const enterpriseFontSize = getFontSizeBylength((this.user.enterprise.name || '').length)

      return [
        {
          absolutePosition: { x: 560, y: 0 },
          canvas: [{
            type: 'rect',
            x: 0,
            y: 0,
            w: 340,
            h: 595,
            r: 70,
            lineColor: '#FFFFFF',
            color: '#FFFFFF'
          }]
        },
        {
          columns: [
            // LEFT MAIN COLUMN
            {
              width: '72.2%',
              text: ' '
            },
            // RIGHT MAIN COLUMN
            {
              margin: [-25, -100, -50, -50],
              table: {
                widths: ['100%'],
                body: [
                  [
                    {
                      image: LogoBase64,
                      height: 117,
                      width: 117,
                      margin: [0, 44, 0, 0],
                      alignment: 'center'
                    }
                  ],
                  [
                    {
                      text: this.$t('Views.Evaluations.report.demographic.title'),
                      margin: [20, 12, 20, 0],
                      alignment: 'center',
                      fontSize: 17,
                      bold: true,
                      color: '#444444',
                      characterSpacing: 0.2
                    }
                  ],
                  [
                    {
                      text: this.segmentLabel,
                      margin: [0, 7, 0, 0],
                      alignment: 'center',
                      fontSize: 20,
                      color: '#777777',
                      characterSpacing: 0.3
                    }
                  ],
                  [
                    {
                      text: this.evaluationData.name,
                      margin: [0, 88, 0, 66],
                      alignment: 'center',
                      fontSize: pollNameFontSize,
                      color: '#777777',
                      characterSpacing: 0.1
                    }
                  ],
                  [
                    {
                      text: this.user.enterprise.name,
                      margin: [0, 40, 0, 0],
                      alignment: 'center',
                      fontSize: enterpriseFontSize,
                      color: '#555555',
                      bold: true,
                      characterSpacing: 0.1
                    }
                  ],
                  [
                    {
                      text: this.getDateString(),
                      margin: [0, 0, 0, -10],
                      alignment: 'center',
                      fontSize: 17,
                      color: '#777777',
                      characterSpacing: 0.1
                    }
                  ]
                ]
              },
              layout: 'noBorders'
            }
          ]
        }
      ]
    }
  }
}
