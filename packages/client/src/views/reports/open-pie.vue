
<template>
  <div style="display:inline;">
    <v-btn large
      color="primary"
      @click="displayDialog = true"
    >
      <v-icon class="mr-3">mdi-chart-pie</v-icon>
      {{ $t('Views.Evaluations.report.open_questions_button') }}
    </v-btn>

    <v-dialog
      fullscreen
      hide-overlay
      scrollable
      v-model="displayDialog"
      @keydown.esc="displayDialog = false"
    >
      <v-card tile height="100vh">
        <v-toolbar tile dark max-height="64px" flat color="primary">
          <v-toolbar-title>
            {{ pollName }}
          </v-toolbar-title>

          <v-spacer></v-spacer>

          <v-toolbar-items>
            <v-select
              v-model="selectedQuestion"
              :items="formattedQuestions"
              :label="$t('Views.Evaluations.report.open_question_select_label')"
              class="mt-4"
              style="max-width: 30vw;"
              @change="selectedQuestion = $event"
            ></v-select>

            <v-btn text
              :disabled="!selectedQuestion || loadingAnswers"
              @click="downloadImage"
            >
              <v-icon class="mr-2">mdi-file-image</v-icon>
              <span v-if="$vuetify.breakpoint.smAndUp">
                Descargar imagen
              </span>
            </v-btn>
          </v-toolbar-items>

          <v-btn icon dark @click="displayDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>

        <v-card-text class="pt-4">
          <div v-if="loadingAnswers" class="text-center fill-height">
            <v-row align="center" class="fill-height">
              <v-col cols="12">
                <v-progress-circular indeterminate
                  :size="40"
                  :width="4"
                  color="primary"
                  class="my-auto"
                ></v-progress-circular>
                <p class="mb-0 caption">
                  {{ $t('Views.Evaluations.report.please_wait') }}...
                </p>
              </v-col>
            </v-row>
          </div>
          <div v-show="!loadingAnswers"
            id="canvasContainer"
            style="width:95vw;margin:0 auto;"
          >
            <canvas id="chartCanvas"></canvas>
          </div>

          <a ref="download" id="download" href="#" style="visibility:hidden;" download></a>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>

import evaluationsService from '../../services/evaluations'

const echarts = require('echarts')

export default {
  props: {
    pollName: String,
    questions: Array
  },
  data () {
    return {
      answers: {},
      displayDialog: false,
      selectedQuestion: 0,
      selectionItems: [],
      loadingAnswers: false
    }
  },
  computed: {
    formattedQuestions () {
      return this.questions.map((q) => {
        return {
          text: q.question,
          value: q.question
        }
      })
    }
  },
  watch: {
    displayDialog (val) {
      if (val) {
        this.selectedQuestion = this.questions[0].question
      }
    },
    selectedQuestion () {
      this.getQuestionAnswers()
    }
  },
  methods: {
    getQuestionAnswers () {
      // Fetch question answers. Generate if already fetched
      if (this.answers[this.selectedQuestion]) {
        this.generatePie()
      } else {
        this.loadingAnswers = true
        evaluationsService.getAdditionalQuestionAnswers(this.$route.params.id, this.selectedQuestion)
          .then(res => {
            if (res && res.answers) {
              const options = this.questions.find(q => {
                return q.question === this.selectedQuestion
              }).options

              if (!Object.prototype.hasOwnProperty.call(this.answers, this.selectedQuestion)) {
                this.answers[this.selectedQuestion] = {}
              }

              for (const opt of options) {
                this.answers[this.selectedQuestion][opt] = res.answers.filter(a => {
                  return a.additionalQuestions[0].answer[0] === opt
                }).length
              }
              this.generatePie(this.selectedQuestion)
            }
          })
          .catch(err => {
            console.log(err)
          })
          .finally(() => {
            setTimeout(() => {
              this.loadingAnswers = false
            }, 140)
          })
      }
    },
    generatePie () {
      const canvas = document.getElementById('chartCanvas')
      if (!canvas) {
        return
      }
      canvas.width = window.innerWidth ? (window.innerWidth - 50) : 0
      canvas.height = window.innerHeight ? (window.innerHeight - 150) : 0

      this.chart = echarts.init(canvas)
      const additionalQuestionAnswers = this.answers[this.selectedQuestion]

      const title = this.selectedQuestion.slice(0, 80)
      const subtitle = this.selectedQuestion.slice(80, this.selectedQuestion.length)

      this.chart.setOption({
        backgroundColor: '#FFFFFF',
        title: {
          text: subtitle ? `${title}...` : title,
          subtext: subtitle ? `...${subtitle}` : '',
          x: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          bottom: 'bottom',
          data: Object.keys(additionalQuestionAnswers)
        },
        series: [
          {
            name: 'Serie',
            type: 'pie',
            radius: '55%',
            center: ['50%', '50%'],
            color: [
              '#F44336',
              '#2196F3',
              '#4CAF50',
              '#FFC107',
              '#607D8B'
            ],
            data: Object.keys(additionalQuestionAnswers).map((key) => {
              return {
                name: key,
                value: additionalQuestionAnswers[key]
              }
            }),
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            },
            label: {
              show: true,
              position: 'outside',
              formatter: '{b}: {c} ({d}%)'
            }
          }
        ]
      })
    },
    downloadImage () {
      const download = document.getElementById('download')

      const canvas = document.getElementById('chartCanvas')
      const dataURL = canvas.toDataURL('image/jpeg')

      download.setAttribute('href', dataURL)
      this.$refs.download.click()
    }
  }
}
</script>
