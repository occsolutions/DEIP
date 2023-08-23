
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
      coverLogoWidth: 250,
      coverLogoHeight: 50,
      coverLogoRatio: 1
    }
  },
  methods: {
    $generateCover () {
      const pollNameFontSize = getFontSizeBylength((this.evaluationData.name || '').length)
      const enterpriseFontSize = getFontSizeBylength((this.user.enterprise.name || '').length)

      if (this.enterpriseLogo) {
        const domEnterpriseLogo = document.getElementById('dynamicEnterpriseLogo')
        const w = domEnterpriseLogo.width
        const h = domEnterpriseLogo.height
        const rem = w % h || 1
        const wRem = w / rem
        const hRem = h / rem
        const ratio = wRem / hRem
        if (ratio > 1.4) {
          this.coverLogoHeight = this.coverLogoWidth / ratio
        }
        if (ratio < 1) {
          this.coverLogoWidth = this.coverLogoHeight / ratio
        }
      }

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
                      text: this.$t('Views.Evaluations.report.organizational.title'),
                      margin: [0, 12, 0, 0],
                      alignment: 'center',
                      fontSize: 19,
                      bold: true,
                      color: '#444444',
                      characterSpacing: 0.4
                    }
                  ],
                  [
                    {
                      text: this.evaluationData.name,
                      margin: [0, 110, 0, 90],
                      alignment: 'center',
                      fontSize: pollNameFontSize,
                      color: '#777777',
                      characterSpacing: 0.1
                    }
                  ],
                  this.enterpriseLogo
                    ? [
                      {
                        image: this.enterpriseLogo,
                        fit: [this.coverLogoHeight, this.coverLogoWidth],
                        margin: [0, 0, 0, 5],
                        alignment: 'center'
                      }
                    ]
                    : [
                      {
                        text: '',
                        margin: [0, 40, 0, 0]
                      }
                    ],
                  [
                    {
                      text: this.user.enterprise.name,
                      margin: [0, 0, 0, 0],
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
