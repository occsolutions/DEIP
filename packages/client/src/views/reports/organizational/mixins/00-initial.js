
import pdfUtils from '../../utils/pdf'
const echarts = require('echarts')

export default {
  data () {
    return {
      variablesTables: [
        {
          titles: {
            0: this.$t('engagementReport.my_inspiration.attributes.0'),
            1: this.$t('engagementReport.culture_alignment'),
            2: this.$t('engagementReport.purpose'),
            3: this.$t('engagementReport.future_vision')
          },
          min: 0,
          max: 3
        },
        {
          titles: {
            0: this.$t('engagementReport.my_inspiration.attributes.1'),
            4: this.$t('engagementReport.autonomy'),
            5: this.$t('engagementReport.strengths_and_talents'),
            6: this.$t('engagementReport.my_contribution')
          },
          min: 3,
          max: 6
        },
        {
          titles: {
            0: this.$t('engagementReport.my_inspiration.attributes.2'),
            7: this.$t('engagementReport.motivation'),
            8: this.$t('engagementReport.they_value_me'),
            9: this.$t('engagementReport.performance')
          },
          min: 6,
          max: 9
        },
        {
          titles: {
            0: this.$t('engagementReport.my_job.attributes.0'),
            10: this.$t('engagementReport.recognized_organization'),
            11: this.$t('engagementReport.organization_performance'),
            12: this.$t('engagementReport.pride_of_belonging_organization')
          },
          min: 9,
          max: 12
        },
        {
          titles: {
            0: this.$t('engagementReport.my_job.attributes.1'),
            13: this.$t('engagementReport.recognized_area'),
            14: this.$t('engagementReport.area_performance'),
            15: this.$t('engagementReport.pride_of_being_part_area')
          },
          min: 12,
          max: 15
        },
        {
          titles: {
            0: this.$t('engagementReport.my_job.attributes.2'),
            16: this.$t('engagementReport.materials_and_equipment'),
            17: this.$t('engagementReport.offices_and_dress_code'),
            18: this.$t('engagementReport.balance_personal_professional')
          },
          min: 15,
          max: 18
        },
        {
          titles: {
            0: this.$t('engagementReport.positive_work_enviroment.attributes.0'),
            19: this.$t('engagementReport.being_myself'),
            20: this.$t('engagementReport.freedom_of_expression'),
            21: this.$t('engagementReport.interpersonal_relationships')
          },
          min: 18,
          max: 21
        },
        {
          titles: {
            0: this.$t('engagementReport.positive_work_enviroment.attributes.1'),
            22: this.$t('engagementReport.care_for_people'),
            23: this.$t('engagementReport.inclusive_workplace'),
            24: this.$t('engagementReport.respectful_treatment')
          },
          min: 21,
          max: 24
        },
        {
          titles: {
            0: this.$t('engagementReport.positive_work_enviroment.attributes.2'),
            25: this.$t('engagementReport.equal_opportunities'),
            26: this.$t('engagementReport.salary_and_benefits'),
            27: this.$t('engagementReport.recognition_culture')
          },
          min: 24,
          max: 27
        },
        {
          titles: {
            0: this.$t('engagementReport.my_team.attributes.0'),
            28: this.$t('engagementReport.trust_quality_relationships'),
            29: this.$t('engagementReport.responsibility_meeting_goals'),
            30: this.$t('engagementReport.workload_balance')
          },
          min: 27,
          max: 30
        },
        {
          titles: {
            0: this.$t('engagementReport.my_team.attributes.1'),
            31: this.$t('engagementReport.team_network'),
            32: this.$t('engagementReport.communication_team'),
            33: this.$t('engagementReport.diversity')
          },
          min: 30,
          max: 33
        },
        {
          titles: {
            0: this.$t('engagementReport.my_team.attributes.2'),
            34: this.$t('engagementReport.agility_processes'),
            35: this.$t('engagementReport.innovation'),
            36: this.$t('engagementReport.access_transparency_information')
          },
          min: 33,
          max: 36
        },
        {
          titles: {
            0: this.$t('engagementReport.my_development_and_learning.attributes.0'),
            37: this.$t('engagementReport.autonomous_learning'),
            38: this.$t('engagementReport.development_potential'),
            39: this.$t('engagementReport.expectations_role')
          },
          min: 36,
          max: 39
        },
        {
          titles: {
            0: this.$t('engagementReport.my_development_and_learning.attributes.1'),
            40: this.$t('engagementReport.career_plan'),
            41: this.$t('engagementReport.future_organization'),
            42: this.$t('engagementReport.horizontal_mobility')
          },
          min: 39,
          max: 42
        },
        {
          titles: {
            0: this.$t('engagementReport.my_development_and_learning.attributes.2'),
            43: this.$t('engagementReport.learning_tracking'),
            44: this.$t('demographicReport.learning_culture'),
            45: this.$t('engagementReport.genuine_interest')
          },
          min: 42,
          max: 45
        },
        {
          titles: {
            0: this.$t('engagementReport.the_leaders.attributes.0'),
            46: this.$t('engagementReport.admiration'),
            47: this.$t('engagementReport.transparency_honesty'),
            48: this.$t('engagementReport.motivation')
          },
          min: 45,
          max: 48
        },
        {
          titles: {
            0: this.$t('engagementReport.the_leaders.attributes.1'),
            49: this.$t('engagementReport.clear_transparent_objectives'),
            50: this.$t('engagementReport.coaching_feedback'),
            51: this.$t('engagementReport.leader_access')
          },
          min: 48,
          max: 51
        },
        {
          titles: {
            0: this.$t('engagementReport.the_leaders.attributes.2'),
            52: this.$t('engagementReport.systematic_thinking'),
            53: this.$t('engagementReport.strategic_planning'),
            54: this.$t('engagementReport.social_intelligence_collaboration')
          },
          min: 51,
          max: 54
        }
      ]
    }
  },
  watch: {
    rtype (val) {
      if (val === 'byitems') {
        this.variablesTables[13].titles['0'] = this.$t('engagementReport.opportunities_of_growth')
      }
    }
  },
  methods: {
    $getCalcData (data) {
      this.nameReport = data.nameReport
      this.dimensions = data.dimensions
      this.attributes = data.attributes
      this.variables = data.variables
      this.current = data.current
      this.previous = data.previous
      this.currentPoll = data.currentPoll
      this.previousPoll = data.previousPoll
      this.itemsCover = data.itemsCover
      this.itemsSelecteText = data.itemsSelecteText
      this.rtype = data.reportType.toLowerCase()
      this.hasPrevious = data.hasPrevious
      this.totalParticipantsPercent = data.totalParticipantsPercent
      this.totalObtained = data.totalObtained
      this.totalReceivers = data.totalReceivers
      this.dispersionCounter = data.dispersionCounter
      this.rateCounter = data.rateCounter
      this.rankingCounter = data.rankingCounter
      this.dispersionLowAttrFooterContent = data.dispersionLowAttrFooterContent
      this.dispersionHighAttrFooterContent = data.dispersionHighAttrFooterContent
      this.dispersionLowVarFooterContent = data.dispersionLowVarFooterContent
      this.dispersionHighVarFooterContent = data.dispersionHighVarFooterContent
      this.executeResultRutine = true
      this.variables.forEach(variable => {
        const vTable = this.variablesTables.find(vTable => vTable.min < variable.id && vTable.max >= variable.id)
        if (vTable) {
          vTable.titles[variable.id] = (variable.translate || {}).label
        }
      })
      this.pollReferences = data.pollReferences
      this.wordsChart = data.wordsChart
      this.totalFiltered = data.totalFiltered
      this.enterpriseLogoBase64 = data.logoBase64 ? `data:image/pngbase64,${data.logoBase64}` : this.enterpriseLogoBase64
    },
    generateTableBarsChart (name, result, prevResult, dimensionId) {
      const canvas = document.createElement('canvas')
      canvas.width = 500
      canvas.height = 90

      const tableBarsChart = echarts.init(canvas)
      tableBarsChart.setOption(
        pdfUtils.generateTableBars(
          this.$round(result),
          this.$round(prevResult),
          dimensionId
        )
      )

      tableBarsChart.on('finished', () => {
        this.bars[name] = tableBarsChart.getDataURL()
        this.$set(this.renderPart, name, true)
      })
    },
    $generateVariablesTableGroupBars () {
      let i = 1
      for (const tab of this.variablesTables) {
        const chunk = Object
          .entries(this.current.variablesResults)
          .slice(tab.min, tab.max)
          .map((arr) => arr[0])

        let actualTotal = 0
        let previousTotal = 0
        let currentTotal = 0

        let j = 1
        let dimensionId
        for (const vari of chunk) {
          const actTotal = this.current.variablesResults[vari]
          const prevTotal = this.hasPrevious ? this.previous.variablesResults[vari] : 0
          const curTotal = this.rtype === 'byitems' ? this.current.wholesVariablesResults[vari] : 0
          dimensionId = this.variables.find(v => v.id === Number(vari)).dimensionId

          this.generateTableBarsChart(`curAttr${i}${j}`, actTotal, this.rtype === 'byitems' ? curTotal : prevTotal, dimensionId)

          actualTotal += Number.parseInt(actTotal)
          previousTotal += Number.parseInt(prevTotal)
          currentTotal += Number.parseInt(curTotal)

          j++
        }

        actualTotal = actualTotal / 3
        previousTotal = previousTotal ? previousTotal / 3 : 0
        currentTotal = currentTotal / 3

        this.generateTableBarsChart(`totAttr${i}`, actualTotal, this.rtype === 'byitems' ? currentTotal : previousTotal, dimensionId)

        i++
      }
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
