
import pdfUtils from '../../utils/pdf'

export default {
  data () {
    return {
      dictionary: {
        academicDegrees: 'academicDegree',
        additionalDemographics1: 'optionalDemo1',
        additionalDemographics2: 'optionalDemo2',
        age: 'age',
        antiquity: 'antiquity',
        charges: 'charge',
        countries: 'country',
        departments: 'departments',
        genders: 'gender',
        headquarters: 'headquarter',
        jobTypes: 'jobTypes'
      },
      ageAntiquity: {
        '0-25': 1,
        '25-35': 2,
        '35-45': 3,
        '45-50': 4,
        '50-200': 5,
        '0-0.5': 1,
        '0.5-1': 2,
        '1-3': 3,
        '3-5': 4,
        '5-10': 5,
        '10-20': 6,
        '20-200': 7
      }
    }
  },
  methods: {
    $generateResponseRateDetails () {
      return [
        pdfUtils.generateTitle('Detalle Tasa de respuesta', [0, 0], 'before', 24, '#222222', true, true),
        {
          text: 'Esta tabla presenta la cantidad de personas que se incluyeron en el proceso y de ese grupo cuáles completaron la medición.',
          margin: [0, 10, 0, -5]
        },
        this.generateDemographicsRateTable()
      ]
    },
    getCutLabel (cutKey) {
      if (!cutKey.startsWith('segmentation')) {
        return this.demographicCuts[this.dictionary[cutKey]].label
      } else {
        const segmentationId = parseInt(cutKey.replace(/[^0-9]/g, ''))
        for (const key in this.evaluationData.additionalSegmentation) {
          if (this.evaluationData.additionalSegmentation[key].id === segmentationId) {
            return this.evaluationData.additionalSegmentation[key].trans[this.user.lang].label
          }
        }
      }
    },
    getDemoLabel (cutKey, demoKey) {
      if (!cutKey.startsWith('segmentation')) {
        if (!['age', 'antiquity'].includes(cutKey)) {
          const found = this.demographicCutsDetails[cutKey].find(x => x.id === Number(demoKey))
          if (found) {
            return found.label
          }
        } else {
          return this.$t(`Views.FollowUpReport.${cutKey}.${this.ageAntiquity[demoKey]}`)
        }
      } else {
        const segmentationId = parseInt(cutKey.replace(/[^0-9]/g, ''))
        for (const key in this.evaluationData.additionalSegmentation) {
          if (this.evaluationData.additionalSegmentation[key].id === segmentationId) {
            const found = this.evaluationData.additionalSegmentation[key].details.find(x => x.id === Number(demoKey))
            if (found) {
              return found.trans[this.user.lang].label
            }
          }
        }
      }

      return ''
    },
    generateDemographicsRateTable () {
      const tables = []

      for (const cutKey in this.answersRateDetails) {
        const body = []

        for (const demoKey in this.answersRateDetails[cutKey]) {
          const value = this.answersRateDetails[cutKey][demoKey]
          const percent = this.$round((value / this.completedPolls) * 100)

          body.push([
            {
              text: this.getDemoLabel(cutKey, demoKey),
              margin: [0, 2.5, 0, 0]
            },
            {
              text: `${value} (${percent}%)`,
              margin: [0, 2.5, 0, 0],
              alignment: 'center'
            }
          ])
        }

        tables.push({
          margin: [0, 15, 0, 0],
          color: '#222222',
          fontSize: 9.5,
          table: {
            widths: ['*', '10%'],
            body: [
              // Headers
              [
                {
                  text: this.getCutLabel(cutKey),
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
              ...body,
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
