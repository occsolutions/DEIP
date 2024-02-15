<template>
  <v-dialog persistent
    v-model="showDialog"
    width="314px"
  >
    <v-card tile>
      <v-card-title>
        Sábana de Datos
      </v-card-title>

      <v-card-text class="text-center pt-1 pb-0">
        <v-progress-circular indeterminate
          v-if="loading"
          :size="77"
          :width="4"
          color="primary"
          class="my-4"
        >
          <span class="caption">
            {{batchCount}}/{{totalAnswers}}
          </span>
        </v-progress-circular>
        <div v-else class="py-4">
          <v-btn block outlined
            color="success darken-2"
            class="mb-4"
            :loading="loadingBtn1"
            @click="downloadXls1()"
          >
            Cerradas / Likert <v-icon size="21" class="ml-2">mdi-file-excel</v-icon>
          </v-btn>

          <v-btn block outlined
            color="success darken-2"
            class="mb-4"
            :loading="loadingBtn2"
            @click="downloadXls2()"
          >
            Opción Múltiple <v-icon size="21" class="ml-2">mdi-file-excel</v-icon>
          </v-btn>
        </div>
      </v-card-text>

      <v-card-actions class="justify-end px-2">
        <v-btn
          :disabled="loading"
          @click="$emit('close')"
        >
          {{ $t('Views.Evaluations.show.modal_input_close') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapState } from 'vuex'
import resolver from '@/utils/resolver'
import evaluationsService from '@/services/evaluations'
import questionnairesService from '@/services/questionnaires'
import xlsxDownload from '@/utils/xlsx-download'

import { ageRanges, antiquityRanges } from '@/utils/ranges'

export default {
  props: {
    evaluationId: String,
    questionnaire: Object,
    indices: Array,
    additionalSegmentation: Object,
    showDialog: Boolean
  },
  data () {
    return {
      loading: true,
      loadingBtn1: false,
      loadingBtn2: false,
      formattedDemographics: {},
      formattedSegmentation: {},
      formattedSegmentationDetails: {},
      totalAnswers: 0,
      batchCount: 0,
      jsonResponse: [],
      evaluationData: [],
      evaluationOptionsQuestions: [],
      dKeys: {
        academicDegree: 'academicDegreeId',
        age: 'birthdate',
        antiquity: 'admission',
        charge: 'chargeId',
        country: 'countryId',
        departments: 'departmentId',
        gender: 'genderId',
        headquarter: 'headquarterId',
        jobTypes: 'jobTypeId',
        optionalDemo1: 'additionalDemographic1Id',
        optionalDemo2: 'additionalDemographic2Id'
      },
      questionTypes: []
    }
  },
  computed: {
    ...mapState({
      user: (state) => state.session.user
    })
  },
  watch: {
    showDialog (val) {
      if (val) {
        if (!this.jsonResponse.length) {
          this.getInitialData()
        } else {
          this.generateXlsx()
        }
      }
    }
  },
  methods: {
    formatDemoItems (demographicItems) {
      const data = {}
      Object.keys(demographicItems).forEach(key => {
        if (demographicItems[key].length) {
          data[this.dKeys[key]] = {}
          demographicItems[key].forEach(d => {
            data[this.dKeys[key]][d.id] = d.name || d.translate.label
          })
        }
      })

      return data
    },
    getInitialData () {
      resolver.all({
        demographics: evaluationsService.getDemographicsItemsByEntreprise(this.user.lang),
        total: evaluationsService.getAnswersCount(this.evaluationId),
        qTypes: questionnairesService.questionsTypes()
      })
        .then(async (res) => {
          this.formattedDemographics = await this.formatDemoItems(res.demographics.data)
          this.totalAnswers = res.total.count
          this.questionTypes = res.qTypes.items
          this.getAnswers()
        })
        .catch(err => {
          console.log(err)
        })
    },
    getAnswers () {
      evaluationsService.getAnswersWithParticipant(this.evaluationId, this.batchCount)
        .then(async (res) => {
          this.batchCount += res.length
          const formattedAnswers = await this.formatAnswers(res)
          this.jsonResponse = [...this.jsonResponse, ...formattedAnswers]

          if (this.batchCount !== this.totalAnswers) {
            setTimeout(async () => {
              await this.getAnswers()
            }, 10000)
          } else {
            this.loading = false
            this.generateXlsx()
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    formatAnswers (answers) {
      answers.forEach(a => {
        Object.keys(a.demographicItems).forEach(key => {
          if (this.formattedDemographics[key]) {
            const cleanKey = key.endsWith('Id') ? key.slice(0, -2) : key
            a.demographicItems[cleanKey] = this.formattedDemographics[key][a.demographicItems[key]]
            delete a.demographicItems[key]
          }
        })
      })

      return answers
    },
    getRange (date, type) {
      const today = new Date()
      const formattedDate = new Date(date)

      const diff = (today.getTime() - formattedDate.getTime()) / 1000
      const diffInDays = diff / (60 * 60 * 24)

      const year = diffInDays / 365.25

      const rng = type === 'age' ? ageRanges : antiquityRanges
      const found = rng.find(x => year >= x.min && year < x.max)

      return found ? found.text[this.user.lang] : ''
    },
    formatSegmentation () {
      if (this.additionalSegmentation === null) return
      Object.values(this.additionalSegmentation).forEach(s => {
        if (s.selected) {
          this.formattedSegmentation[s.id] = s.trans[this.user.lang].label
          this.formattedSegmentationDetails[-1] = 'Prefiero no responder'
          s.details.forEach(d => {
            this.formattedSegmentationDetails[d.id] = d.trans[this.user.lang].label
          })
        }
      })
    },
    generateXlsx () {
      this.formatSegmentation()
      this.jsonResponse.forEach(async (item) => {
        const obj = {
          País: item.demographicItems.country,
          Sede: item.demographicItems.headquarter,
          Departamento: item.demographicItems.department,
          Cargo: item.demographicItems.charge,
          'Tipo de Contratación': item.demographicItems.jobType,
          'Nivel Académico': item.demographicItems.academicDegree,
          Genero: item.demographicItems.gender,
          'ID Interno': `ObjectId(${item.participant.id})`,
          'Documento de Identidad': parseInt(item.participant.identifyDocument),
          Correo: item.participant.email,
          Edad: await this.getRange(item.demographicItems.birthdate, 'age'),
          Antigüedad: await this.getRange(item.demographicItems.admission, 'antiquity'),
          AddDemo1: item.demographicItems.additionalDemographic1,
          AddDemo2: item.demographicItems.additionalDemographic2
        }

        // Load additional segmentation
        await item.segmentation.forEach(x => {
          obj[this.formattedSegmentation[x.segmentationId]] = this.formattedSegmentationDetails[x.detailId]
        })

        // Load Evaluation XLS data
        let dimCnt = 1
        await item.evaluations.forEach(dim => {
          const dimKey = dimCnt < 6 ? `d${dimCnt}` : 'leader'
          const dimension = this.questionnaire.evaluations[dimKey]

          dim.attribute.forEach(attr => {
            const clone = JSON.parse(JSON.stringify(obj))

            const parts = attr.key.split('_')
            const attrKey = `${parts[0]}_${parts[1]}`

            let question = ''
            if (dimKey === 'leader') {
              clone.Dimensión = this.$t('Views.Questionnaires.edit.leader')
              clone.Atributo = ''
              question = dimension[attr.key]
            } else {
              // d1 to d5
              clone.Dimensión = dimension.label[this.user.lang]
              const attribute = dimension.attrs[attrKey]
              clone.Atributo = attribute.label[this.user.lang]
              question = attribute.questions[attr.key]
            }

            clone.Pregunta = question.label[this.user.lang]
            const found = this.questionTypes.find(x => x.type === attr.qType)
            clone.Tipo = found ? found.title[this.user.lang] : ''

            let score = -2
            if (attr.qType === 'options') {
              question.options.forEach(x => {
                if (attr.score.includes(Number(x.value))) {
                  const clone2 = JSON.parse(JSON.stringify(clone))
                  delete clone2.Tipo
                  clone2.Respuesta = x.label[this.user.lang]
                  this.evaluationOptionsQuestions.push(clone2)
                }
              })
            } else {
              // Closed & Likert
              score = attr.score[0]
              if (score === -1) {
                score = 0.001
              }
              if (attr.qType === 'closed' && score === 0.01) {
                score = 0
              }
              clone.Respuesta = score
              this.evaluationData.push(clone)
            }
          })

          dimCnt++
        })
      })
    },
    downloadXls1 () {
      this.loadingBtn1 = true
      setTimeout(async () => {
        await xlsxDownload(
          this.evaluationData,
          'Cerradas - Likert',
          'Sabana de Datos - Cerradas & Likert.xlsx',
          true
        )
        this.loadingBtn1 = false
      }, 1000)
    },
    downloadXls2 () {
      this.loadingBtn2 = true
      setTimeout(async () => {
        await xlsxDownload(
          this.evaluationOptionsQuestions,
          'Opción Múltiple',
          'Sabana de Datos - Opción Múltiple.xlsx',
          true
        )
        this.loadingBtn2 = false
      }, 1000)
    }
  }
}
</script>
