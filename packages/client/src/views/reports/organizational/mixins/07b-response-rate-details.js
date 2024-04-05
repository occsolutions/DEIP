
import pdfUtils from '../../utils/pdf'

export default {
  data () {
    return {
      trans: {
        en: { label: 'Prefer not to answer' },
        es: { label: 'Prefiero no responder' }
      }
    }
  },
  methods: {
    $generateResponseRateDetails () {
      return [
        pdfUtils.generateTitle('% de Respuestas por Segmentación', [0, 0], 'before', 24, '#222222', true, true),
        {
          text: 'Estas tablas presentan la cantidad de personas que respondieron la medición y su respectiva segmentación.',
          margin: [0, 10, 0, -5]
        },
        this.generateDemographicsRateTable()
      ]
    },
    getSegmentLabel (segment) {
      return this.evaluationData.additionalSegmentation[segment].trans[this.user.lang].label
    },
    getDetailLabel (segment, detail) {
      let label = ''
      if (detail !== 'no_answer') {
        const foundDetail = this.evaluationData.additionalSegmentation[segment].details.find(d => d.code === detail)
        if (foundDetail) {
          label = foundDetail.trans[this.user.lang].label
        }
      } else {
        label = this.trans[this.user.lang].label
      }

      return label
    },
    generateDemographicsRateTable () {
      const tables = []

      for (const segment in this.segmentationRate) {
        const body = []

        for (const detail in this.segmentationRate[segment]) {
          const value = this.segmentationRate[segment][detail]
          const percent = this.$round((value / this.completedPolls) * 100)

          body.push([
            {
              text: this.getDetailLabel(segment, detail),
              margin: [0, 2.5, 0, 0]
            },
            {
              text: value ? `${value} (${percent}%)` : '--',
              value, // For sorting purposes
              margin: [0, 2.5, 0, 0],
              alignment: 'center'
            }
          ])
        }

        tables.push({
          margin: [0, 15, 0, 0],
          color: '#222222',
          fontSize: 9.5,
          unbreakable: true,
          table: {
            unbreakable: true,
            dontBreakRows: true,
            widths: ['*', '10%'],
            body: [
              // Headers
              [
                {
                  text: this.getSegmentLabel(segment),
                  margin: [0, 4, 0, 1.5],
                  alignment: 'center',
                  fillColor: '#9cd3ef',
                  bold: true
                },
                {
                  text: 'Población',
                  margin: [0, 4, 0, 1.5],
                  alignment: 'center',
                  fillColor: '#9cd3ef',
                  bold: true
                }
              ],
              // Body
              ...body.sort((a, b) => b[1].value - a[1].value),
              // Totals
              [
                {
                  text: 'Total',
                  margin: [0, 2, 0, -0.5],
                  fillColor: '#9cd3ef',
                  bold: true
                },
                {
                  text: this.completedPolls,
                  margin: [0, 2, 0, -0.5],
                  fillColor: '#9cd3ef',
                  alignment: 'center',
                  bold: true
                }
              ]
            ]
          },
          layout: {
            hLineWidth: () => {
              return 1
            },
            vLineWidth: () => {
              return 1
            },
            hLineColor: () => {
              return '#BBBBBB'
            },
            vLineColor: () => {
              return '#BBBBBB'
            }
          }
        })
      }

      return tables
    }
  }
}
