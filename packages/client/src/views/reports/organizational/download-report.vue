
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
    <img
      :src="fontPreload1"
      class="d-none"
    />
    <img
      :src="fontPreload2"
      class="d-none"
    />
  </div>
</template>

<script>

import { mapState } from 'vuex'
import is from 'is_js'
import pdfMake from 'pdfmake/build/pdfmake'
import pdfFonts from 'pdfmake/build/vfs_fonts.js'

import evaluationsService from '../../../services/evaluations'

import initial from './mixins/00-initial'
import cover from './mixins/01-cover'
import index from './mixins/02-index'
import intro from './mixins/03-intro'
import objectives from './mixins/04-objectives'
import model from './mixins/05-model'
import methodology from './mixins/06-methodology'
import responseRate from './mixins/07-response-rate'
import additionalSegmentationRate from './mixins/07b-response-rate-details'
import gralResults from './mixins/08a-gral-results'
import gralDimResults from './mixins/08b-gral-dim-results'
import gralDimDesc from './mixins/08c-gral-dim-desc'
import dimQuestionResults from './mixins/09a-dimension-questions-results'
import dimOptionsQuestionsResults from './mixins/09b-dimension-opt-questions-results'
import gralLeadersResults from './mixins/10a-gral-leaders-results'
import leadersQuestionResults from './mixins/10b-leaders-questions-results'
import leadersOptionsQuestionsResults from './mixins/10c-leaders-opt-questions-results'
import dimensionRanking from './mixins/11-ranking-questions'
import dimensionScatter from './mixins/12-scatter-questions'
import dimensionTrend from './mixins/13a-trend-dim'
import questionTrend from './mixins/13b-trend-questions'

const origin = window.location.origin
pdfMake.fonts = {
  'League Spartan': {
    normal: `${origin}/fonts/LeagueSpartan/LeagueSpartan-Regular.ttf`,
    bold: `${origin}/fonts/LeagueSpartan/LeagueSpartan-Bold.ttf`,
    italics: `${origin}/fonts/LeagueSpartan/LeagueSpartan-Regular.ttf`,
    bolditalics: `${origin}/fonts/LeagueSpartan/LeagueSpartan-Bold.ttf`
  },
  Montserrat: {
    normal: `${origin}/fonts/Montserrat/Montserrat-Regular.ttf`,
    bold: `${origin}/fonts/Montserrat/Montserrat-Bold.ttf`,
    italics: `${origin}/fonts/Montserrat/Montserrat-Italic.ttf`,
    bolditalics: `${origin}/fonts/Montserrat/Montserrat-BoldItalic.ttf`
  },
  Roboto: {
    normal: `${origin}/fonts/Roboto/Roboto-Regular.ttf`,
    bold: `${origin}/fonts/Roboto/Roboto-Medium.ttf`,
    italics: `${origin}/fonts/Roboto/Roboto-Italic.ttf`,
    bolditalics: `${origin}/fonts/Roboto/Roboto-MediumItalic.ttf`
  }
}

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
    objectives,
    model,
    methodology,
    responseRate,
    additionalSegmentationRate,
    gralResults,
    gralDimResults,
    gralDimDesc,
    dimQuestionResults,
    dimOptionsQuestionsResults,
    gralLeadersResults,
    leadersQuestionResults,
    leadersOptionsQuestionsResults,
    dimensionRanking,
    dimensionScatter,
    dimensionTrend,
    questionTrend
  ],
  props: {
    pollId: String,
    evaluationData: Object,
    thread: Object
  },
  data () {
    return {
      downloadPdf: true,
      fontPreload1: null,
      fontPreload2: null,
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
      expectedLeaders: 0,
      completedLeaders: 0,
      responseRatePie: null,
      dimensionsResultsPie: null
    }
  },
  mounted () {
    this.preloadFont1()
    this.preloadFont2()
    if (this.evaluationData.enterprise.logo) {
      this.enterpriseLogoSrc = `data:image/png;base64,${this.evaluationData.enterprise.logo}`
    }
  },
  watch: {
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
      await evaluationsService.getOneReportByThreadId(this.thread._id, this.pollId)
        .then((res) => {
          this.expectedPolls = this.evaluationData.populationCount
          this.completedPolls = res.data.answeredCount
          this.expectedLeaders = this.evaluationData.populationLeaders.length
          this.completedLeaders = res.data.answeredLeadersCount
          this.segmentationRate = res.data.segmentationRate
          this.answersDimension = res.data.answersDimension
          this.scatterDimension = res.data.scatterDimension
          this.highestScores = res.data.highestScores
          this.lowestScores = res.data.lowestScores
          this.highestScatter = res.data.highestScatter
          this.lowestScatter = res.data.lowestScatter
          this.hasPrevious = res.data.hasPrevious
          this.renderPdf()
        })
        .catch((err) => {
          console.log(err)
          this.$store.dispatch('alert/error', this.$t(`errors.${err.code}`))
        })
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
      this.$emit('reportGenerated')
    },
    preloadFont1 () {
      const canvas = document.createElement('canvas')
      canvas.width = 800
      canvas.height = 440
      const preload = echarts.init(canvas)

      preload.setOption({
        textStyle: {
          fontFamily: 'Montserrat'
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
            normal: {
              color: '#a1e4d7'
            }
          },
          data: [
            { name: 'Montserrat4', value: 4 },
            { name: 'Montserrat3', value: 3 },
            { name: 'Montserrat2', value: 2 },
            { name: 'Montserrat1', value: 1 }
          ]
        }]
      })

      preload.on('finished', () => {
        this.fontPreload1 = preload.getDataURL()
      })
    },
    preloadFont2 () {
      const canvas = document.createElement('canvas')
      canvas.width = 800
      canvas.height = 440
      const preload = echarts.init(canvas)

      preload.setOption({
        textStyle: {
          fontFamily: 'League Spartan'
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
            normal: {
              color: '#a1e4d7'
            }
          },
          data: [
            { name: 'League Spartan 4', value: 4 },
            { name: 'League Spartan 3', value: 3 },
            { name: 'League Spartan 2', value: 2 },
            { name: 'League Spartan 1', value: 1 }
          ]
        }]
      })

      preload.on('finished', () => {
        this.fontPreload2 = preload.getDataURL()
      })
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
    }
  }
}
</script>
