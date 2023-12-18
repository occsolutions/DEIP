
import pdfUtils from '../../utils/pdf'

export default {
  methods: {
    $generateResponseRateDetails () {
      const generateDemographicsRateTable = () => {
        const tables = []

        for (const key in this.pollReferences) {
          const criterias = []

          if (this.pollReferences[key].type === 'master') {
            for (const crit of this.pollReferences[key].criteria) {
              const value = this.current.populationByDemographics[key][crit.code]
              const percent = this.$round((value / this.totalFiltered) * 100)
              criterias.push([
                Object.prototype.hasOwnProperty.call(crit, 'translate') ? crit.translate.label : crit.name,
                { text: `${value} (${percent}%)`, alignment: 'center' }
              ])
            }
          } else {
            const value = this.current.populationByDemographics[key][this.pollReferences[key].field]
            const percent = this.$round((value / this.totalFiltered) * 100)
            const field = this.pollReferences[key].field
            let tag = ''
            if (this.pollReferences[key].criteria[0] === 0) {
              tag = this.$t(`pulses.${field}_low`, { n: field === 'age' ? this.pollReferences[key].criteria[1] : 6 })
            } else if (this.pollReferences[key].criteria[0] === 0.5 && field === 'antiquity') {
              tag = this.$t('pulses.antiquity_range_single', { n: 6, p: this.pollReferences[key].criteria[1] })
            } else if (this.pollReferences[key].criteria[1] === 200) {
              tag = this.$t(`pulses.${field}_upper`, { n: this.pollReferences[key].criteria[0] })
            } else {
              tag = this.$t('engagementReport.years_range', {
                min: this.pollReferences[key].criteria[0],
                max: this.pollReferences[key].criteria[1]
              })
            }
            criterias.push([
              tag,
              { text: `${value} (${percent}%)`, alignment: 'center' }
            ])
          }

          criterias.push([
            {
              text: 'Total',
              margin: [0, 1, 0, -2],
              fillColor: '#dcddf1',
              bold: true
            },
            {
              text: this.totalObtained,
              margin: [0, 1, 0, -2],
              fillColor: '#dcddf1',
              bold: true,
              alignment: 'center'
            }
          ])

          tables.push({
            margin: [0, 15, 0, 0],
            table: pdfUtils.generateTable(
              ['80%', '19%'],
              criterias,
              [
                this.$t(`engagementReport.${this.pollReferences[key].label}`),
                this.$t('engagementReport.population')
              ]
            ),
            layout: pdfUtils.setLayout()
          })
        }

        return tables
      }

      return [
        pdfUtils.generateTitle(this.$t('engagementReport.answers_rate'), [0, 0], 'before', 37, '#222222', false),
        {
          text: this.$t('engagementReport.answers_rate_text'),
          margin: [0, 14, 0, 0],
          fontSize: 11
        },
        generateDemographicsRateTable()
      ]
    }
  }
}
