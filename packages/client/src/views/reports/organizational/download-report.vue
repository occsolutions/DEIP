
<template>
  <div>
    <v-btn large
      :disabled="thread.status !== 'completed'"
      :loading="lockPdfButton"
      color="success"
      class="mt-3"
      @click="openPdf"
    >
      <v-icon class="mr-3">mdi-file-pdf</v-icon>
      <span v-if="thread.status === 'pending'">
        {{ $t('Views.Evaluations.report.generating_report') }}
      </span>
      <span v-else-if="thread.status === 'in_action' || thread.status === 'in_progress'">
        {{`
          ${$t('Views.Evaluations.report.generating_report')}
          ${thread.data.progress}%
        `}}
      </span>
      <span v-else-if="thread.status === 'failed'">
        {{ $t('Views.Evaluations.report.failed_generation') }}
      </span>
      <span v-else>
        {{ $t('Views.Evaluations.report.download_report') }}
      </span>
    </v-btn>

    <!-- Empty img container to load Enterprise Logo if any -->
    <img
      v-if="enterpriseLogo"
      :src="enterpriseLogo"
      id="dynamicEnterpriseLogo"
      class="d-none"
    />
    <canvas id="burnoutIndex" width="448" height="451" class="d-none"></canvas>
    <img v-show="false"
      :src="wCloudPreload"
      id="preloadWordCloud"
      width="800"
      height="440"
    />
  </div>
</template>

<script>

import { mapState } from 'vuex'
import is from 'is_js'
import pdfMake from 'pdfmake/build/pdfmake'
import pdfFonts from 'pdfmake/build/vfs_fonts.js'

import initial from './mixins/00-initial'
import cover from './mixins/01-cover'
import index from './mixins/02-index'
import intro from './mixins/03-intro'
import model from './mixins/04-model'
import methodology from './mixins/05-methodology'
import responseRate from './mixins/06-response-rate'
import gralScores from './mixins/07-gral-scores'
import dimResults from './mixins/08-dimension-results'
import dimDetails from './mixins/09-dimension-details'
import scoresRank from './mixins/10-highest-lowest-scores'
import scatterRank from './mixins/11-highest-lowest-scatter'
import burnoutIndex from './mixins/12-burnout-index'
import healthIndex from './mixins/13-health-index'
import wordClouds from './mixins/14-word-clouds'

pdfMake.vfs = pdfFonts.pdfMake.vfs
const echarts = require('echarts')
require('echarts-wordcloud')

export default {
  name: 'thread-organizational-report-exec',
  mixins: [
    initial,
    cover,
    index,
    intro,
    model,
    methodology,
    responseRate,
    gralScores,
    dimResults,
    dimDetails,
    scoresRank,
    scatterRank,
    burnoutIndex,
    healthIndex,
    wordClouds
  ],
  props: {
    pollId: String,
    evaluationData: Object,
    thread: Object
  },
  data () {
    return {
      downloadPdf: true,
      renderPart: {
        donutPie: false,
        chartPie: false,
        wordClouds: false
      },
      heatMap: [
        '#f85d19',
        '#f99c16',
        '#fcec14',
        '#b7d600',
        '#1bd800'
      ],
      occGreen: '#51c7af',
      occGrey: '#7d838d',
      occRed: '#ec604d',
      occBlue: '#1999da',
      occGreenRgba: 'rgba(81, 199, 175, 0.6)',
      occGreyRgba: 'rgba(125, 131, 141, 0.6)',
      occRedRgba: 'rgba(236, 96, 77, 0.6)',
      occBlueRgba: 'rgba(25, 153, 218, 0.6)',
      enterpriseLogoSrc: null,
      enterpriseLogo: null,
      lockPdfButton: false,
      previous: {},
      questionnaire: {},
      answersDimension: {},
      burnoutIndQs: [],
      gralScore: 0,
      gralPrevScore: 0,
      completedPolls: 0,
      expectedPolls: 0,
      responseRatePie: null,
      dimensionsResultsPie: null,
      wCloudPreload: null,
      wClouds: {},
      wordColors: [
        'rgba(81, 199, 175, 1)',
        'rgba(125, 131, 141, 1)',
        'rgba(236, 96, 77, 1)',
        'rgba(25, 153, 218, 1)'
      ]
    }
  },
  mounted () {
    if (this.evaluationData.enterprise.logo) {
      this.enterpriseLogoSrc = `data:image/png;base64,${this.evaluationData.enterprise.logo}`
    }
    this.preloadWordCloudFont()
  },
  watch: {
    renderPart: {
      handler () {
        const hasFalses = Object.values(this.renderPart).includes(false)
        if (!hasFalses) this.renderPdf()
      },
      deep: true
    },
    enterpriseLogoSrc (val) {
      if (val) {
        this.toDataURL(this.enterpriseLogoSrc, (dataURL) => {
          this.enterpriseLogo = dataURL
        })
      }
    }
  },
  computed: {
    ...mapState({
      user: (state) => state.session.user
    })
  },
  methods: {
    async openPdf () {
      this.$store.dispatch('loading/show')
      this.lockPdfButton = true
      await this.$getInitialData()
    },
    async renderPdf () {
      this.$emit('render-pdf')
      const configuration = await this.$getConfiguration()
      if (this.downloadPdf) {
        if (is.edge() || is.ie()) {
          const pdfDocGenerator = pdfMake.createPdf(configuration)
          pdfDocGenerator.getBlob((blob) => {
            window.navigator.msSaveBlob(blob, `${this.evaluationData.name}.pdf`)
            this.closeRenderPdf()
          })
        } else {
          pdfMake.createPdf(configuration).download(`${this.evaluationData.name}.pdf`, () => {
            this.closeRenderPdf()
          })
        }
      } else {
        this.closeRenderPdf()
      }
    },
    closeRenderPdf () {
      this.$store.dispatch('loading/hide')
      this.lockPdfButton = false
      this.$emit('pdfRenderedOrg')
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
    getPercentString (value) {
      // if (value % 1 === 0) {
      if (Number.isInteger(value)) {
        return Math.round(value).toString()
      } else {
        return this.round(value).toString()
      }
    },
    generateResponseRatePie () {
      const canvas = document.createElement('canvas')
      canvas.width = 1040 * 2
      canvas.height = 740 * 2

      const chartPieLocal = echarts.init(canvas)

      const participationPercent = (this.completedPolls * 100) / this.expectedPolls
      const participationPercentString = this.getPercentString(participationPercent)

      chartPieLocal.setOption({
        tooltip: {
          trigger: 'none'
        },
        title: {
          text: this.$t('Views.Evaluations.report.organizational.of_population'),
          left: 'center',
          textStyle: { fontSize: 40, fontWeight: 'lighter' },
          y: 876
        },
        series: [
          {
            name: 'Response Rate',
            type: 'pie',
            radius: ['59%', '70%'],
            avoidLabelOverlap: true,
            label: {
              show: false,
              position: 'center'
            },
            markPoint: {
              tooltip: { show: false },
              label: {
                show: true,
                formatter: '{b}%',
                color: 'black',
                fontSize: 240,
                fontWeight: 'bold'
              },
              data: [{
                name: participationPercentString,
                value: '',
                symbol: 'circle',
                itemStyle: { color: 'transparent' },
                x: '50%',
                y: '51.5%'
              }]
            },
            data: [
              {
                value: 100 - participationPercent,
                itemStyle: {
                  color: '#DDDDDD'
                }
              },
              {
                value: participationPercent,
                itemStyle: {
                  color: this.occBlue
                }
              }
            ]
          }
        ]
      })

      chartPieLocal.on('finished', () => {
        this.responseRatePie = chartPieLocal.getDataURL()
        this.renderPart.donutPie = true
        this.generateDimensionsResultsPie()
      })
    },
    getData (dimension, score, previous, color) {
      dimension = this.$t(`Views.Questionnaires.edit.d_${dimension}`)
      score = this.round(score)
      previous = this.round(previous)
      let value
      if (this.hasPrevious) {
        value = `{a|${score}}{b| | ${previous}}\n{c|${dimension}}`
      } else {
        value = `{a|${score}}\n{c|${dimension}}`
      }

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
    getPreviusSerie (score, previous, position, color) {
      const dimColor = color
      const series = []

      for (let i = 0; i < 3; i++) {
        const data = [0, 0, 0, 0]

        if (previous > score) {
          const blank = previous - 0.1 - score
          switch (i) {
            case 0:
              data[position] = score
              color = dimColor
              break
            case 1:
              data[position] = blank
              color = dimColor
              break
            case 2:
              data[position] = 0.1
              color = '#555555'
              break
          }
          series.push({
            type: 'bar',
            coordinateSystem: 'polar',
            stack: 'a',
            color: color,
            data: data
          })
        } else {
          switch (i) {
            case 0:
              data[position] = previous - 0.1
              color = dimColor
              break
            case 1:
              data[position] = 0.1
              color = '#555555'
              break
            case 2:
              data[position] = score - previous
              color = dimColor
              break
          }
          series.push({
            type: 'bar',
            coordinateSystem: 'polar',
            stack: 'a',
            color: color,
            data: data
          })
        }
      }

      return series
    },
    getSimpleSerie (score, position, color) {
      const data = [0, 0, 0, 0]
      data[position] = score
      return {
        type: 'bar',
        coordinateSystem: 'polar',
        stack: 'a',
        color: color,
        data: data
      }
    },
    generateDimensionsResultsPie () {
      const dataSet = []
      let seriesSet = []
      let hexColor, rgbColor
      let dimCnt = 0
      for (const key of Object.keys(this.answersDimension)) {
        let dimScore = 0
        let prevScore = 0

        dimScore = this.answersDimension[key].general.score
        if (this.hasPrevious) {
          prevScore = this.answersDimension[key].general.previous
        }

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

        dataSet.push(this.getData(key, dimScore, prevScore, hexColor))
        if (this.hasPrevious) {
          seriesSet = [
            ...seriesSet,
            ...this.getPreviusSerie(dimScore, prevScore, dimCnt, rgbColor)
          ]
        } else {
          seriesSet.push(this.getSimpleSerie(dimScore, dimCnt, rgbColor))
        }

        dimCnt++
      }

      const canvas = document.createElement('canvas')
      canvas.width = 700
      canvas.height = 700

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
        this.renderPart.chartPie = true
        this.generateWordClouds()
      })
    },
    preloadWordCloudFont () {
      const canvas = document.createElement('canvas')
      canvas.width = 800
      canvas.height = 440
      const preload = echarts.init(canvas)

      preload.setOption({
        textStyle: {
          fontFamily: 'Bowlby One'
        },
        series: [{
          type: 'wordCloud',
          shape: 'circle',
          gridSize: 9,
          sizeRange: [14, 60],
          rotationRange: [-90, 90],
          rotationStep: 90,
          left: 'center',
          top: 'center',
          drawOutOfBound: true,
          textStyle: {
            color: '#FF6600'
          },
          data: [
            { name: 'test2', value: 2 },
            { name: 'test1', value: 1 }
          ]
        }]
      })

      preload.on('finished', () => {
        this.wCloudPreload = preload.getDataURL()
      })
    },
    generateWordClouds () {
      let cnt = 1
      for (const key of Object.keys(this.wordsCloud)) {
        const canvas = document.createElement('canvas')
        canvas.width = 1200// 800
        canvas.height = 660// 440
        const chartWordsLocal = echarts.init(canvas)

        chartWordsLocal.setOption({
          textStyle: {
            fontFamily: 'Bowlby One'
          },
          series: [{
            type: 'wordCloud',
            shape: 'circle',
            gridSize: 9,
            sizeRange: [14, 60],
            rotationRange: [-90, 90],
            rotationStep: 90,
            left: 'center',
            top: 'center',
            // width: '80%',
            // height: '70%',
            drawOutOfBound: true,
            textStyle: {
              // fontWeight: 'bold',
              color: () => this.wordColors[Math.floor(Math.random() * this.wordColors.length)]
            },
            data: this.wordsCloud[key]
          }]
        })

        chartWordsLocal.on('finished', () => {
          this.wClouds[key] = chartWordsLocal.getDataURL()
          if (cnt === this.evaluationData.openQuestions.length) {
            this.renderPart.wordClouds = true
          }
          cnt++
        })
      }
    },
    toDataURL (url, callback) {
      const xhr = new XMLHttpRequest()
      xhr.open('get', url)
      xhr.responseType = 'blob'

      xhr.onload = function () {
        const fr = new FileReader()

        fr.onload = function () {
          callback(this.result)
        }

        fr.readAsDataURL(xhr.response)
      }

      xhr.send()
    },
    getDateString () {
      const today = new Date()
      const monthName = this.$t(`Views.Evaluations.report.months.${[today.getMonth()]}`)
      return `${monthName} - ${today.getFullYear()}`
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
}
</script>
