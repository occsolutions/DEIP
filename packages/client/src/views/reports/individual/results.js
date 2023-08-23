
import evaluationsService from '../../../services/evaluations'
import authService from '../../../services/auth'

import Vue from 'vue'
import is from 'is_js'
import pdfMake from 'pdfmake/build/pdfmake'
import pdfFonts from 'pdfmake/build/vfs_fonts.js'

import initial from './mixins/00-initial'
import cover from './mixins/01-cover'
import index from './mixins/02-index'
import intro from './mixins/03-intro'
import model from './mixins/04-model'
import methodology from './mixins/05-methodology'
import generalScore from './mixins/07-gral-scores'
import dimResults from './mixins/08-dimension-results'
import dimDetails from './mixins/09-dimension-details'
import highScores from './mixins/10-highest-lowest-scores'
import burnoutIndex from './mixins/12-burnout-index'
import healthIndex from './mixins/13-health-index'

const echarts = require('echarts')

pdfMake.vfs = pdfFonts.pdfMake.vfs

export default Vue.extend({
  components: {
    //
  },
  mixins: [
    initial,
    cover,
    index,
    intro,
    model,
    methodology,
    highScores,
    generalScore,
    dimResults,
    dimDetails,
    burnoutIndex,
    healthIndex
  ],
  data () {
    return {
      lang: 'es',
      loadingBtn: false,
      dataFetched: false,
      downloadPdf: true,
      identifyTypes: {},
      evaluation: {},
      evaluated: {},
      evaluatedName: '',
      highestScores: [],
      lowerScores: [],
      gralScore: 0,
      burnoutAverages: {},
      burnoutIndQs: [],
      dimensionAverages: {
        physical: [],
        mental: [],
        emotional: [],
        professional: []
      },
      heatMap: [
        '#f85d19',
        '#f99c16',
        '#fcec14',
        '#b7d600',
        '#1bd800'
      ],
      colors: {
        physical: '#51c7af',
        mental: '#7d838d',
        emotional: '#ec604d',
        professional: '#1999da'
      },
      occGreen: '#51c7af',
      occGrey: '#7d838d',
      occRed: '#ec604d',
      occBlue: '#1999da',
      occGreenRgba: 'rgba(81, 199, 175, 0.6)',
      occGreyRgba: 'rgba(125, 131, 141, 0.6)',
      occRedRgba: 'rgba(236, 96, 77, 0.6)',
      occBlueRgba: 'rgba(25, 153, 218, 0.6)'
    }
  },
  watch: {
    //
  },
  computed: {
    //
  },
  created () {
    this.getEvaluation()
  },
  methods: {
    getEvaluation () {
      this.$store.dispatch('loading/show')
      evaluationsService.findByTokenId(this.$route.params.tokenId)
        .then((res) => {
          this.evaluation = res.data
          this.evaluated = res.evaluated
          if (this.evaluated.status !== 'completed') {
            throw new TypeError('demographic_report/004')
          }
          this.evaluatedName = `${this.evaluated.employee.employeeEnterprise.firstName} ${this.evaluated.employee.employeeEnterprise.lastName}`
          this.getIdentifyTypes()
          this.getHighAndLowerScores()
        })
        .catch((err) => {
          err.message
            ? this.$store.dispatch('alert/error', this.$t(`errors.${err.message}`))
            : this.$store.dispatch('alert/error', this.$t(`errors.${err.code}`))
        })
        .finally(() => {
          this.$store.dispatch('loading/hide')
        })
    },
    getIdentifyTypes () {
      authService.identifyTypes()
        .then(res => {
          res.items.forEach(et => {
            this.identifyTypes[et.id] = this.getIdentifyTypesInitials(et.translate.label) + ' - '
          })
          this.dataFetched = true
        })
    },
    getIdentifyTypesInitials (text) {
      return text.trim().split(' ').map(t => t.slice(0, 1)).join('').toUpperCase()
    },
    async openPdf () {
      this.$store.dispatch('loading/show')
      this.loadingBtn = true
      await this.generateDimensionsResultsPie()
      await this.renderPdf()
    },
    async renderPdf () {
      const configuration = await this.$getConfiguration()
      if (this.downloadPdf) {
        if (is.edge() || is.ie()) {
          const pdfDocGenerator = pdfMake.createPdf(configuration)
          pdfDocGenerator.getBlob((blob) => {
            window.navigator.msSaveBlob(blob, `${this.evaluation.name} - Individual - ${this.evaluatedName}.pdf`)
            this.closeRenderPdf()
          })
        } else {
          pdfMake.createPdf(configuration).download(`${this.evaluation.name} - Individual - ${this.evaluatedName}.pdf`, () => {
            this.closeRenderPdf()
          })
        }
      } else {
        this.closeRenderPdf()
      }
    },
    closeRenderPdf () {
      this.$store.dispatch('loading/hide')
      this.loadingBtn = false
    },
    getDateString () {
      const today = new Date()
      const monthName = this.$t(`Views.Evaluations.report.months.${[today.getMonth()]}`)
      return `${monthName} - ${today.getFullYear()}`
    },
    getHighAndLowerScores () {
      const { questionnaire: { evaluations }, questionsIndex } = this.evaluation
      const { temp: { evaluations: evaluatedEvaluations, indices } } = this.evaluated
      const scores = []
      const burnoutIndexes = {
        individual: [],
        organizational: []
      }
      let dimensionCount = 0
      for (const [dimensionKey, dimensionVar] of Object.entries(evaluations)) {
        let questionCount = 0
        for (const [varKey, varValues] of Object.entries(dimensionVar)) {
          for (const questionKey of Object.keys(varValues)) {
            const score = evaluatedEvaluations[dimensionCount].variable[questionCount].score
            if (varValues[questionKey].index.includes('burnoutIndividual')) {
              burnoutIndexes.individual.push(score)
              this.burnoutIndQs.push({
                reference: varValues[questionKey].reference,
                score
              })
            }
            scores.push({
              type: 'evaluation',
              dimension: dimensionKey,
              variable: varKey,
              reference: varValues[questionKey].reference[this.lang],
              score
            })
            this.dimensionAverages[dimensionKey].push(score)
            questionCount++
          }
        }
        dimensionCount++
      }

      questionsIndex.forEach(qi => {
        const item = indices.find(index => index.idx === qi.idx)
        const score = item.answer

        if (qi.index.includes('burnoutIndividual')) {
          burnoutIndexes.individual.push(score)
          this.burnoutIndQs.push({
            reference: qi.reference,
            score
          })
        }

        if (qi.index.includes('burnoutOrganizational')) {
          burnoutIndexes.organizational.push(score)
        }

        scores.push({
          type: 'index',
          index: qi.index[0],
          ref: qi.reference[this.lang],
          idx: item.idx,
          score
        })
      })

      this.burnoutAverages.individual = this.getAverage(burnoutIndexes.individual)
      this.burnoutAverages.organizational = this.getAverage(burnoutIndexes.organizational)

      this.getDimensionAverages()
      this.getGeneralScore()

      this.highestScores = scores.sort((a, b) => b.score - a.score).slice(0, 6)
      this.lowerScores = scores.sort((a, b) => a.score - b.score).slice(0, 6)
    },
    generateDimensionsResultsPie () {
      const dataSet = []
      const seriesSet = []
      let hexColor, rgbColor
      Object.keys(this.dimensionAverages).forEach((key, index) => {
        const dimScore = this.dimensionAverages[key]

        switch (key) {
          case 'physical':
            hexColor = this.occGreen
            rgbColor = this.occGreenRgba
            break
          case 'mental':
            hexColor = this.occGrey
            rgbColor = this.occGreyRgba
            break
          case 'emotional':
            hexColor = this.occRed
            rgbColor = this.occRedRgba
            break
          case 'professional':
            hexColor = this.occBlue
            rgbColor = this.occBlueRgba
            break
        }

        dataSet.push(this.getData(key, dimScore, hexColor))
        seriesSet.push(this.getSimpleSerie(dimScore, index, rgbColor))
      })

      const canvas = document.createElement('canvas')
      canvas.width = 700
      canvas.height = 700

      return new Promise(resolve => {
        const chartPieLocal = echarts.init(canvas)

        chartPieLocal.setOption({
          angleAxis: {
            type: 'category',
            data: dataSet,
            z: 10
          },
          radiusAxis: {
            min: 1,
            max: 5,
            interval: 1,
            axisLabel: {
              show: true,
              fontSize: 15
            }
          },
          polar: {},
          series: seriesSet,
          barWidth: '100%'
        })

        chartPieLocal.on('finished', () => {
          this.dimensionsResultsPie = chartPieLocal.getDataURL()
          resolve()
        })
      })
    },
    getData (dimension, score, color) {
      dimension = this.$t(`Views.Questionnaires.edit.d_${dimension}`)
      score = this.round(score)
      const value = `{a|${score}}\n{c|${dimension}}`

      return {
        value: value,
        textStyle: {
          rich: {
            a: {
              fontSize: 19,
              color: color,
              align: 'center'
            },
            b: {
              fontSize: 18,
              color: '#000000',
              align: 'center'
            },
            c: {
              fontSize: 20,
              color: color,
              align: 'center'
            }
          }
        }
      }
    },
    getSimpleSerie (score, position, color) {
      const data = [0, 0, 0, 0]
      data[position] = score
      return {
        type: 'bar',
        coordinateSystem: 'polar',
        stack: 'a',
        color: color,
        data
      }
    },
    getDimensionAverages () {
      Object.keys(this.dimensionAverages).forEach(key => {
        this.dimensionAverages[key] = this.getAverage(this.dimensionAverages[key])
      })
    },
    getGeneralScore () {
      let total = 0
      Object.entries(this.dimensionAverages).forEach((data) => {
        total += data[1]
      })
      this.gralScore = this.round(total / 4)
    },
    getAverage (data) {
      return data.reduce((a, b) => a + b, 0) / data.length
    },
    getHeatMap (s) {
      if (!s) {
        return '#FFFFFF'
      } else if (s >= 1 && s < 2) {
        return this.heatMap[0]
      } else if (s >= 2 && s < 3) {
        return this.heatMap[1]
      } else if (s >= 3 && s < 4) {
        return this.heatMap[2]
      } else if (s >= 4 && s < 4.5) {
        return this.heatMap[3]
      } else if (s >= 4.5) {
        return this.heatMap[4]
      }
    },
    round (value, decimals = 2) {
      if (isNaN(Number(value))) {
        return '--'
      }
      if ((value * 100) < 1 && (value * 100) > -1) {
        value = 0
      }
      return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals).toFixed(decimals)
    }
  }
})
