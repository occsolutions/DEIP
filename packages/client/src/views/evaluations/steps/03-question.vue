<template>
  <v-container flat class="pb-7">
    <v-card flat>
      <ValidationObserver ref="additional_qs" v-slot="{ handleSubmit }">
        <v-form @submit.prevent="handleSubmit(checkNext)">
          <v-row>
            <v-col class="headline">
              {{ $t('Views.Evaluations.stepQuestion.title') }}
              <v-divider></v-divider>
            </v-col>
          </v-row>
          <v-row
            v-for="(item,index) in questionnaires"
            v-bind:key="index"
          >
            <v-col cols="12" sm="7" class="pt-3 pl-4">
              <v-radio-group
                v-model="evaluation.questionnaire"
                :value="evaluation.questionnaire"
                :mandatory="false"
                class="my-0"
              >
                <v-radio
                  class="pt-3"
                  :label="item.name"
                  :value="item.slug"
                  :readonly="evaluation.status != 'pending'"
                  :disabled="evaluation.status != 'pending'"
                ></v-radio>
              </v-radio-group>
            </v-col>
            <v-col cols="12" sm="5" class="pt-6 text-right">
              <v-btn dark small
                color="primary"
                class="ml-auto white--text"
                @click="getPdf(item)"
              >
                {{$t('Views.Evaluations.stepQuestion.inputDownload')}}
                <v-icon dark right small>mdi-file-pdf</v-icon>
              </v-btn>
            </v-col>
          </v-row>
          <v-alert type="info" color="grey lighten-1">
            {{ $t('Views.Evaluations.stepQuestion.custom_questionnaire_info') }}
          </v-alert>

          <!------------------------------------------------------------------------>
          <!------------------------- Additional Questions ------------------------->
          <!------------------------------------------------------------------------>
          <v-row no-gutters>
            <v-col cols="12">
              <v-switch
                :readonly="evaluation.status !== 'pending' || isEdit"
                v-model="evaluation.switchAdditionalQuestion"
                :label="$t('Views.Evaluations.stepQuestion.want_open_question')"
                color="primary"
                :append-icon="$t('help.icon')"
                @click:append="$store.dispatch('help/display', $t('help.pulse.create.open'))"
              ></v-switch>
              <x-info v-if="evaluation.switchAdditionalQuestion"
                      :text="$t('Views.Evaluations.stepQuestion.open_question_info')"
              ></x-info>
            </v-col>
          </v-row>

          <v-row no-gutters v-if="evaluation.switchAdditionalQuestion">
            <v-col cols="12" class="headline px-4">
              {{ $t('Views.Evaluations.stepQuestion.open_question') }}
              <v-tooltip :disabled="evaluation.additionalQuestions.length === maxOpenQuestion || evaluation.status !== 'pending'" bottom color="green lighten-3">
                <template v-slot:activator="{ on }">
                  <v-btn
                    v-on="on"
                    fab small
                    color="#068ad5"
                    class="white--text ml-4"
                    :disabled="evaluation.additionalQuestions.length === maxOpenQuestion || evaluation.status !== 'pending' || computedMoreAdditionalQs"
                    @click="addOpenQuestion"
                  >
                    <v-icon>mdi-plus</v-icon>
                  </v-btn>
                </template>
                <span>{{ $t('Views.Evaluations.stepQuestion.add_open_question') }}</span>
              </v-tooltip>
              <v-tooltip :disabled="evaluation.additionalQuestions.length === minOpenQuestion || evaluation.status !== 'pending'" bottom color="red">
                <template v-slot:activator="{ on }">
                  <v-btn
                    v-on="on"
                    fab small
                    color="#f65871"
                    class="white--text ml-4"
                    :disabled="evaluation.additionalQuestions.length === minOpenQuestion || evaluation.status !== 'pending'"
                    @click="removeOpenQuestion"
                  >
                    <v-icon>mdi-minus</v-icon>
                  </v-btn>
                </template>
                <span>{{ $t('Views.Evaluations.stepQuestion.remove_open_question') }}</span>
              </v-tooltip>
              <v-divider class="mt-1"></v-divider>
            </v-col>

            <!-- Questions -->
            <v-col cols="12" sm="6"
                   v-for="(additional, idx) in evaluation.additionalQuestions"
                   :key="`q${idx}`"
                   class="px-5 pb-6"
            >
              <v-row>
                <v-col cols="12">
                  <ValidationProvider v-slot="{ errors }"
                                      :name="$t('Views.Evaluations.stepQuestion.additional_n', {n: idx + 1})"
                                      :rules="{
                      required: hasOptions(additional)
                    }"
                                      mode="lazy"
                  >
                    <v-text-field light
                                  v-model="additional.question"
                                  :label="$t('Views.Evaluations.stepQuestion.insert_question', {n: idx + 1})"
                                  :name="`external_name${idx}`"
                                  :readonly="evaluation.status !== 'pending'"
                                  :disabled="evaluation.status !== 'pending'"
                                  :error-messages="errors[0]"
                    >
                      <template #append>
                        <v-tooltip :disabled="additional.options.length === maxOptionOpenQuestion || evaluation.status !== 'pending'" bottom color="green lighten-3">
                          <template v-slot:activator="{ on }">
                            <v-btn
                              v-on="on"
                              fab small
                              color="#068ad5"
                              class="white--text"
                              :disabled="additional.options.length === maxOptionOpenQuestion || evaluation.status !== 'pending'"
                              @click="addOptionOpenQuestion(additional)"
                            >
                              <v-icon>mdi-plus</v-icon>
                            </v-btn>
                          </template>
                          <span>{{ $t('Views.Evaluations.stepQuestion.add_question_option') }}</span>
                        </v-tooltip>
                      </template>
                    </v-text-field>
                  </ValidationProvider>
                </v-col>
                <!-- Options -->
                <v-col cols="12" xs="11" offset-xs="1" v-for="(option, $i) in additional.options" :key="$i"
                       class="pl-7"
                >
                  <ValidationProvider v-slot="{ errors }"
                                      :name="$t('Views.Evaluations.stepQuestion.option_n', {n: $i + 1})"
                                      :rules="{
                      required: additional.question !== ''
                    }"
                                      mode="eager"
                  >
                    <v-text-field light
                                  v-model="additional.options[$i]"
                                  :label="$t('Views.Evaluations.stepQuestion.insert_question_option', {n: idx + 1, o: $i + 1})"
                                  :name="`external_name${idx}${$i}`"
                                  :readonly="evaluation.status !== 'pending'"
                                  :disabled="evaluation.status !== 'pending'"
                                  :error-messages="errors[0]"
                    >
                      <template v-slot:append>
                        <v-tooltip :disabled="additional.options.length === minOptionOpenQuestion || evaluation.status !== 'pending'" bottom color="red">
                          <template v-slot:activator="{ on }">
                            <v-btn fab small
                                   v-on="on"
                                   color="#f65871"
                                   class="white--text"
                                   :disabled="additional.options.length === minOptionOpenQuestion || evaluation.status !== 'pending'"
                                   @click="removeOptionOpenQuestion(additional, $i)"
                            >
                              <v-icon>mdi-minus</v-icon>
                            </v-btn>
                          </template>
                          <span>{{ $t('Views.Evaluations.stepQuestion.remove_question_option') }}</span>
                        </v-tooltip>
                      </template>
                    </v-text-field>
                  </ValidationProvider>
                </v-col>
              </v-row>
            </v-col>
          </v-row>

          <!------------------------------------------------------------------------>
          <!---------------------------- Action Buttons ---------------------------->
          <!------------------------------------------------------------------------>
          <v-card-actions>
            <v-row>
              <v-col cols="12" sm="6" class="pb-1">
                <v-btn large block
                       @click="changeStep(true)"
                >
                  {{ $t(prevAction) }}
                </v-btn>
              </v-col>
              <v-col cols="12" sm="6" class="pb-1">
                <v-btn large block
                       color="primary"
                       :disabled="!questionnaires.length"
                       type="submit"
                >
                  {{ $t(nextAction) }}
                </v-btn>
              </v-col>
            </v-row>
          </v-card-actions>
        </v-form>
      </ValidationObserver>
    </v-card>

    <img
      src="/img/20231120_occ_deip_logo.png"
      style="visibility:hidden;"
      id="occDeipLogo"
      width="0"
      height="0"
      alt=""
    />
    <x-loading></x-loading>
  </v-container>
</template>

<script>

import { mapState } from 'vuex'
import is from 'is_js'

import questionnairesService from '../../../services/questionnaires'

import pdfmake from 'pdfmake/build/pdfmake'
import pdffonts from 'pdfmake/build/vfs_fonts.js'
pdfmake.vfs = pdffonts.pdfMake.vfs

export default {
  props: {
    isEdit: Boolean,
    evaluation: Object,
    step: String,
    nextAction: String,
    prevAction: String
  },
  data () {
    return {
      questionnaires: [],
      minOpenQuestion: 1,
      maxOpenQuestion: 3,
      minOptionOpenQuestion: 2,
      maxOptionOpenQuestion: 5,
      deipLogoSrc: null,
      deipLogoBase64: null
    }
  },
  watch: {
    'evaluation.switchAdditionalQuestion': {
      handler (val) {
        if (!val) {
          this.evaluation.additionalQuestions = [{
            question: '',
            options: ['', '']
          }]
        }
      }
    },
    deipLogoSrc (newVal) {
      if (newVal) {
        this.toDataURL(this.deipLogoSrc, (dataURL) => {
          this.deipLogoBase64 = dataURL
        })
      }
    }
  },
  computed: {
    computedMoreAdditionalQs () {
      const lngth = this.evaluation.additionalQuestions.length
      const lastQ = this.evaluation.additionalQuestions[lngth - 1]
      const emptyOpts = lastQ.options.reduce((acc, opt) => {
        if (opt === '') {
          acc++
        }
        return acc
      }, 0)
      if (lastQ.question === '' || emptyOpts) {
        return true
      }
      return false
    },
    ...mapState({
      user: (state) => state.session.user
    })
  },
  methods: {
    checkNext () {
      if (this.evaluation.switchAdditionalQuestion) {
        this.$refs.additional_qs.validate()
          .then(valid => {
            if (valid) {
              this.changeStep()
            }
          })
      } else {
        this.changeStep()
      }
    },
    changeStep (isBack = false) {
      this.evaluation.questionnaireName = (this.questionnaires.find(q => q.slug === this.evaluation.questionnaire) || {}).name
      this.$emit('changeStep', this.engagement, isBack ? +this.step - 1 : +this.step + 1)
    },
    hasOptions (additional) {
      const optWithValue = additional.options.find(opt => opt !== '')
      if (optWithValue) {
        return true
      }
      return false
    },
    addOpenQuestion () {
      this.evaluation.additionalQuestions.push({
        question: '',
        options: ['', '']
      })
    },
    removeOpenQuestion () {
      this.evaluation.additionalQuestions.pop()
    },
    addOptionOpenQuestion (open) {
      open.options.push('')
    },
    removeOptionOpenQuestion (open, idx) {
      open.options.splice(idx, 1)
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
    writeRotatedText (text) {
      const canvas = document.createElement('canvas')
      canvas.width = 50
      canvas.height = 845

      const ctx = canvas.getContext('2d')

      // Genera color de fondo
      ctx.fillStyle = '#2196F3'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.save()

      // Posiciona el elemento al costado derecho de la página
      ctx.translate(50, 845)
      ctx.rotate(-0.5 * Math.PI)

      // Formatea el texto
      ctx.font = '20pt Roboto'
      ctx.fillStyle = 'white'
      ctx.fillText(text.toUpperCase(), 290, -15)
      ctx.restore()

      return canvas.toDataURL()
    },
    getPdf (questionnaire) {
      this.$store.dispatch('loading/show')
      const details = []
      let dimensionsCount = 0
      const getLabel = (label) => {
        return label && typeof label === 'object' ? label[this.user.lang] || '' : ''
      }
      const evaluations = JSON.parse(JSON.stringify(questionnaire.evaluations))
      const leader = JSON.parse(JSON.stringify(evaluations.leader))
      delete evaluations.leader

      for (const dimentionKey in evaluations) {
        const dimention = evaluations[dimentionKey]
        details.push({
          text: getLabel(dimention.label).toUpperCase(),
          bold: true,
          fontSize: 16,
          pageBreak: dimensionsCount > 0 ? 'before' : '',
          margin: [0, (dimensionsCount > 0 ? 20 : 10), 0, 5]
        })

        for (const attrKey in dimention.attrs) {
          const attr = dimention.attrs[attrKey]
          const variablesData = { ul: [] }
          variablesData.ul.push({
            text: getLabel(attr.label),
            bold: true,
            fontSize: 14,
            pageBreak: '',
            margin: [8, 15, 20, 10]
          })
          details.push(variablesData)
          const qUl = { ul: [] }
          for (const questionKey in attr.questions) {
            const question = attr.questions[questionKey]
            qUl.ul.push({
              text: getLabel(question.label),
              bold: false,
              fontSize: 11,
              margin: [16, 5, 20, 0]
            })
          }
          details.push(qUl)
        }
        dimensionsCount++
      }

      details.push({
        text: this.$t('Views.Evaluations.stepQuestion.leader'),
        bold: true,
        fontSize: 16,
        pageBreak: dimensionsCount > 0 ? 'before' : '',
        margin: [0, (dimensionsCount > 0 ? 20 : 10), 0, 5]
      })
      const qUl = { ul: [] }
      for (const questionKey in leader) {
        qUl.ul.push({
          text: getLabel(leader[questionKey].label),
          bold: false,
          fontSize: 11,
          margin: [16, 5, 20, 0]
        })
      }
      details.push(qUl)
      const configuration = {
        pageSize: 'A4',
        info: {
          title: this.$t('Views.Evaluations.stepQuestion.questionnaire_title'),
          author: 'OCC',
          subject: this.$t('Views.Evaluations.stepQuestion.questionnaire_title')
        },
        defaultStyle: {
          fontSize: 11,
          font: 'Roboto',
          lineHeight: 1.2
        },
        header: () => {
          return [{
            image: this.deipLogoBase64,
            fit: [47, 47],
            margin: [17, 14, 0, 0]
          }]
        },
        footer: () => {
          return [
            {
              columns: [
                { width: '*', text: '' },
                {
                  width: 'auto',
                  text: this.$t('Views.Evaluations.stepQuestion.copyright'),
                  color: 'grey',
                  fontSize: 10
                },
                { width: '*', text: '' }
              ]
            }
          ]
        },
        background: () => {
          const result = {
            image: this.writeRotatedText(questionnaire.name),
            aligment: 'center',
            absolutePosition: { x: 545, y: 0 }
          }

          return result
        },
        content: [
          // Título
          {
            text: this.$t('Views.Evaluations.stepQuestion.questionnaire_e'),
            fontSize: 20,
            margin: [0, 20, 0, 10]
          },
          // Explicación
          {
            text: this.$t('Views.Evaluations.stepQuestion.pdf_explained', { name: questionnaire.name }),
            alignment: 'justify',
            margin: [0, 0, 20, 10]
          },
          // Cuestionario
          ...details
        ]
      }

      if (is.edge() || is.ie()) {
        const pdfDocGenerator = pdfmake.createPdf(configuration)
        pdfDocGenerator.getBlob((blob) => {
          window.navigator.msSaveBlob(blob, 'questionnaire.pdf')
          this.$store.dispatch('loading/hide')
        })
      } else {
        new Promise((resolve) => {
          resolve(pdfmake.createPdf(configuration).download('questionnaire'))
        }).then(() => this.$store.dispatch('loading/hide'))
      }
    },
    getQuestionnaires () {
      this.$store.dispatch('loading/show')
      return questionnairesService.listFiltered()
    }
  },
  created () {
    Promise.all([
      this.getQuestionnaires()
    ]).then(resp => {
      const [questionnaires] = resp
      this.questionnaires = questionnaires.items
      if (!this.$route.params.slug && this.questionnaires.length) {
        this.evaluation.questionnaire = this.questionnaires[0].slug
      } else {
        if (this.evaluation.questionnaire.slug) {
          this.evaluation.questionnaire = this.evaluation.questionnaire.slug
        }
      }
      this.$store.dispatch('loading/hide')
    })
  },
  mounted () {
    this.deipLogoSrc = document.getElementById('occDeipLogo').src
  }
}
</script>
