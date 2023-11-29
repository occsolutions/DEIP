
import pdfUtils from '../../utils/pdf'
const echarts = require('echarts')

export default {
  data () {
    return {
      variablesTables: [
        {
          titles: {
            0: 'my_inspiration.attributes.0',
            1: 'culture_alignment',
            2: 'purpose',
            3: 'future_vision'
          },
          min: 0,
          max: 3
        },
        {
          titles: {
            0: 'my_inspiration.attributes.1',
            4: 'autonomy',
            5: 'strengths_and_talents',
            6: 'my_contribution'
          },
          min: 3,
          max: 6
        },
        {
          titles: {
            0: 'my_inspiration.attributes.2',
            7: 'motivation',
            8: 'they_value_me',
            9: 'performance'
          },
          min: 6,
          max: 9
        },
        {
          titles: {
            0: 'my_job.attributes.0',
            10: 'recognized_organization',
            11: 'organization_performance',
            12: 'pride_of_belonging_organization'
          },
          min: 9,
          max: 12
        },
        {
          titles: {
            0: 'my_job.attributes.1',
            13: 'recognized_area',
            14: 'area_performance',
            15: 'pride_of_being_part_area'
          },
          min: 12,
          max: 15
        },
        {
          titles: {
            0: 'my_job.attributes.2',
            16: 'materials_and_equipment',
            17: 'offices_and_dress_code',
            18: 'balance_personal_professional'
          },
          min: 15,
          max: 18
        },
        {
          titles: {
            0: 'positive_work_enviroment.attributes.0',
            19: 'being_myself',
            20: 'freedom_of_expression',
            21: 'interpersonal_relationships'
          },
          min: 18,
          max: 21
        },
        {
          titles: {
            0: 'positive_work_enviroment.attributes.1',
            22: 'care_for_people',
            23: 'inclusive_workplace',
            24: 'respectful_treatment'
          },
          min: 21,
          max: 24
        },
        {
          titles: {
            0: 'positive_work_enviroment.attributes.2',
            25: 'equal_opportunities',
            26: 'salary_and_benefits',
            27: 'recognition_culture'
          },
          min: 24,
          max: 27
        },
        {
          titles: {
            0: 'my_team.attributes.0',
            28: 'trust_quality_relationships',
            29: 'responsibility_meeting_goals',
            30: 'workload_balance'
          },
          min: 27,
          max: 30
        },
        {
          titles: {
            0: 'my_team.attributes.1',
            31: 'team_network',
            32: 'communication_team',
            33: 'diversity'
          },
          min: 30,
          max: 33
        },
        {
          titles: {
            0: 'my_team.attributes.2',
            34: 'agility_processes',
            35: 'innovation',
            36: 'access_transparency_information'
          },
          min: 33,
          max: 36
        },
        {
          titles: {
            0: 'my_development_and_learning.attributes.0',
            37: 'autonomous_learning',
            38: 'development_potential',
            39: 'expectations_role'
          },
          min: 36,
          max: 39
        },
        {
          titles: {
            0: 'my_development_and_learning.attributes.1',
            40: 'career_plan',
            41: 'future_organization',
            42: 'horizontal_mobility'
          },
          min: 39,
          max: 42
        },
        {
          titles: {
            0: 'my_development_and_learning.attributes.2',
            43: 'learning_tracking',
            44: 'demographicReport.learning_culture',
            45: 'genuine_interest'
          },
          min: 42,
          max: 45
        },
        {
          titles: {
            0: 'the_leaders.attributes.0',
            46: 'admiration',
            47: 'transparency_honesty',
            48: 'motivation'
          },
          min: 45,
          max: 48
        },
        {
          titles: {
            0: 'the_leaders.attributes.1',
            49: 'clear_transparent_objectives',
            50: 'coaching_feedback',
            51: 'leader_access'
          },
          min: 48,
          max: 51
        },
        {
          titles: {
            0: 'the_leaders.attributes.2',
            52: 'systematic_thinking',
            53: 'strategic_planning',
            54: 'social_intelligence_collaboration'
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
        this.variablesTables[13].titles['0'] = 'opportunities_of_growth'
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
