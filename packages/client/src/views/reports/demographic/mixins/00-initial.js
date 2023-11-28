
export default {
  methods: {
    // OBTENCIÓN DE DATOS INICIALES
    $getSummaryCalcData (data) {
      this.pollName = data.pollName
      this.totalItems = data.demographicItems
      this.totalReceivers = data.totalReceivers
      this.totalObtained = data.totalObtained
      this.totalParticipantsPercent = data.totalParticipantsPercent

      this.dimensionsByDemographicsCuts = data.dimensionsByDemographicsCuts
      this.resultsByDemographicsCuts = data.resultsByDemographicsCuts
      this.currentDimensionsResults = data.currentDimensionsResults

      this.lang = data.lang
      this.nameReport = `${this.$t('demographicReport.demographic_population_title')} - ${this.pollName}`
      this.enterpriseLogoBase64 = data.logoBase64 ? `data:image/pngbase64,${data.logoBase64}` : this.enterpriseLogoBase64
    },
    // CÁLCULO DE TOTALES
    $calcTotal (group, exact) {
      const vals = Object.values(group)
      const total = vals.reduce((acc, crt) => acc + crt, 0) / vals.length
      return exact ? total : this.$round(total)
    },
    // SORTER
    $sortKeys (obj, asc, dont) {
      if (dont) return Object.keys(obj)
      return Object.keys(obj).filter(key => key !== 'null').sort((a, b) => {
        if (asc) return obj[a] - obj[b]
        return obj[b] - obj[a]
      })
    },
    // REDONDEADOR
    $round (num) {
      // let result = (Math.round(num * 10) / 10).toFixed(2)
      let result = parseFloat(num).toFixed(2)
      if (result === '0.00') result = '0'
      if (result === '100.00') result = '100'
      return result
    }
  }
}
