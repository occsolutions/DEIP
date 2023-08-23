
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
      const pollNameFontSize = getFontSizeBylength((this.evaluation.name || '').length)
      const enterpriseFontSize = getFontSizeBylength((this.evaluation.enterprise.name || '').length)

      const evaluatedName = `${this.evaluated.employee.employeeEnterprise.firstName} ${this.evaluated.employee.employeeEnterprise.lastName}`

      const identifyTypeId = this.evaluated.employee.employeeEnterprise.identifyTypeId
      const evaluatedDocument = `${this.identifyTypes[identifyTypeId]}${this.evaluated.employee.employeeEnterprise.identifyDocument}`

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
                      text: this.$t('Views.Evaluations.report.individual.title'),
                      margin: [0, 12, 0, 10],
                      alignment: 'center',
                      fontSize: 19,
                      bold: true,
                      color: '#444444',
                      characterSpacing: 0.4
                    }
                  ],
                  [
                    {
                      text: evaluatedName,
                      margin: [0, 0, 0, 0],
                      alignment: 'center',
                      fontSize: 18,
                      color: '#666666',
                      characterSpacing: 0.1
                    }
                  ],
                  [
                    {
                      text: evaluatedDocument,
                      margin: [0, -5, 0, 0],
                      alignment: 'center',
                      fontSize: 18,
                      color: '#666666',
                      characterSpacing: 0.1
                    }
                  ],
                  [
                    {
                      text: this.evaluation.name,
                      margin: [0, 100, 0, 100],
                      alignment: 'center',
                      fontSize: pollNameFontSize,
                      color: '#777777',
                      characterSpacing: 0.1
                    }
                  ],
                  [
                    {
                      text: this.evaluation.enterprise.name,
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
                      color: '#666666',
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
