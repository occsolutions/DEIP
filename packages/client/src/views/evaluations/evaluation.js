
import Vue from 'vue'

import evaluationsService from '../../services/evaluations'

import XPollQuestion from './components/poll-question.vue'

import XWellcomeDialog from './components/wellcome-dialog.vue'
import XMiddleDialog from './components/middle-dialog.vue'
import XEndDialog from './components/end-dialog.vue'

import DevFillForm from '../../utils/dev-fill-form.js'

export default Vue.extend({
  components: {
    XPollQuestion,
    XWellcomeDialog,
    XMiddleDialog,
    XEndDialog
  },
  data () {
    return {
      currentPage: 0,
      pages: [],
      pageAnswerCnt: {},
      questionsCount: 1,
      totalQuestionsCount: 0,
      hasSegmentation: false,
      hasAdditionalQuestions: false,
      evaluated: {},
      evaluation: {
        timeZone: '',
        enterprise: {}
      },
      questionsTypes: [],
      isLeader: false,
      lang: '',
      completed: false,
      progress: 0,
      faces: {
        0: { icon: 'mdi-emoticon-angry-outline', class: 'angry' },
        0.25: { icon: 'mdi-emoticon-sad-outline', class: 'sad' },
        0.5: { icon: 'mdi-emoticon-neutral-outline', class: 'neutral' },
        0.75: { icon: 'mdi-emoticon-happy-outline', class: 'happy' },
        1: { icon: 'mdi-emoticon-outline', class: 'veryhappy' }
      },
      // Modals
      outIntervalDialog: false,
      dialogIcon: '',
      dialogText: '',
      startDialog: false,
      middleDialog: false,
      displayedMiddleDialog: false,
      showConfirmation: false,
      endDialog: false
    }
  },
  watch: {
    startDialog (val) {
      document.querySelector('html').style.overflow = val ? 'hidden' : null
    },
    middleDialog (val) {
      document.querySelector('html').style.overflow = val ? 'hidden' : null
    },
    outIntervalDialog (val) {
      document.querySelector('html').style.overflow = val ? 'hidden' : null
    },
    endDialog (val) {
      document.querySelector('html').style.overflow = val ? 'hidden' : null
    },
    progress () {
      if (this.progress >= 50 && !this.displayedMiddleDialog && !this.startDialog) {
        this.middleDialog = this.displayedMiddleDialog = true
      }
    }
  },
  computed: {
    colorProgress () {
      if (this.progress >= 0 && this.progress < 20) return '#BB3E3E'
      if (this.progress >= 20 && this.progress < 40) return '#B8663D'
      if (this.progress >= 40 && this.progress < 60) return '#C2B147'
      if (this.progress >= 60 && this.progress < 80) return '#B6C144'
      if (this.progress >= 80 && this.progress < 99) return '#44C156'
      return '#1B5E20'
    },
    computedQuestionnairePages () {
      let pg = this.currentPage
      if (!this.hasSegmentation) pg += 1
      return pg
    },
    qPages () {
      const arr = [1, 2, 3, 4, 5]
      if (this.isLeader) {
        arr.push(6)
      }
      return arr
    }
  },
  created () {
    this.lang = this.user ? (this.user.lang || 'es') : 'es'
    this.getEvaluation()
    window.fillForm = (options) => { DevFillForm(this, options) }
  },
  methods: {
    changePage () {
      this.$refs.poll_validation.validate()
        .then(valid => {
          if (valid) {
            this.currentPage++
            // this.$vuetify.goTo(0, { duration: 1100 })
            if (this.pageAnswerCnt[this.currentPage] < this.pages[this.currentPage].length) {
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }
          } else {
            this.$store.dispatch('alert/error', this.$t('Views.Evaluations.evaluation.must_answer_all_questions'))
          }
        })
    },
    setProgress (isRetake = false) {
      let answered = 0
      let qPage = this.hasSegmentation ? 1 : 0
      for (const key of Object.keys(this.evaluated.temp)) {
        switch (key) {
          case 'segmentation':
            if (this.hasSegmentation) {
              this.pageAnswerCnt[0] = 0
              this.evaluated.temp[key].forEach(a => {
                if (a.detailId) {
                  answered++
                  this.pageAnswerCnt[0]++
                }
              })
            }
            break
          case 'evaluations':
            this.evaluated.temp[key].forEach(a => {
              this.pageAnswerCnt[qPage] = 0
              a.attribute.forEach(v => {
                if (v.score.length) {
                  answered++
                  this.pageAnswerCnt[qPage]++
                }
              })
              qPage++
            })
            break
          case 'additional':
            this.pageAnswerCnt[qPage + 1] = 0
            if (this.hasAdditionalQuestions) {
              this.evaluated.temp[key].forEach(a => {
                if (a.answer[0]) {
                  answered++
                  this.pageAnswerCnt[qPage + 1]++
                }
              })
            }
            break
        }
      }
      const prog = (answered * 100) / this.totalQuestionsCount
      if (isRetake && prog > 50) {
        this.displayedMiddleDialog = true
      }
      this.progress = prog
    },
    showDialog (icon, text) {
      this.dialogIcon = icon
      this.dialogText = text
      this.outIntervalDialog = true
    },
    getEvaluation () {
      this.$store.dispatch('loading/show')
      return evaluationsService.findByTokenId(this.$route.params.tokenId)
        .then((res) => {
          if (res.executed) {
            this.evaluated = res.evaluated
            this.evaluation = res.evaluation
            this.questionsTypes = res.questionsTypes
            this.isLeader = res.isLeader
            if (this.evaluation.status === 'completed') {
              this.completed = true
              this.$store.dispatch('loading/hide')
              if (this.evaluated.status === 'completed') {
                this.endDialog = true
              } else {
                this.showDialog('/img/expiracion.png', this.$t('Views.Evaluations.evaluation.expiration_date'))
              }
            } else {
              const releasedAtParsed = Date.parse(this.evaluation.deliveredAt.split('Z')[0]) / 1000
              const deadLineAtParsed = Date.parse(this.evaluation.validUntil.split('Z')[0]) / 1000
              if (releasedAtParsed > parseInt(Date.now() / 1000)) {
                this.showDialog('/img/reloj.png', this.$t('Views.Evaluations.evaluation.before_date'))
              } else if (deadLineAtParsed < parseInt(Date.now() / 1000)) {
                this.showDialog('/img/expiracion.png', this.$t('Views.Evaluations.evaluation.expiration_date'))
              } else if (this.evaluation.status === 'pending') {
                this.showDialog('/img/reloj.png', this.$t('Views.Evaluations.evaluation.not_available'))
              } else {
                if (this.evaluated.status === 'completed') {
                  this.completed = true
                  this.endDialog = true
                } else {
                  if (!this.evaluated.sensitiveDataTreatmentPolicyAccepted || !this.evaluated.sensitiveDataTreatmentPolicyAccepted.accepted) {
                    this.startDialog = true
                  }
                  this.assemblePoll()
                }
                this.$store.dispatch('loading/hide')
              }
            }
          } else {
            this.$store.dispatch('loading/hide')
            this.showDialog('/img/alerta.png', this.$t('Views.Evaluations.evaluation.invalid_token'))
          }
        })
        .catch((err) => {
          console.log(err)
          this.$store.dispatch('alert/error', this.$t(`errors.${err.code}`))
          this.$store.dispatch('loading/hide')
        })
    },
    assemblePoll () {
      // Additional Segmentation
      if (this.evaluation.additionalSegmentation &&
        Object.keys(this.evaluation.additionalSegmentation).length !== 0
      ) {
        let selectedCnt = 0
        for (const key of Object.keys(this.evaluation.additionalSegmentation)) {
          if (this.evaluation.additionalSegmentation[key].selected) {
            selectedCnt++
          }
        }

        this.hasSegmentation = selectedCnt > 0
      }
      if (this.hasSegmentation) {
        const notAnsweredSeg = !this.evaluated.temp.segmentation.length
        const seg = []
        for (const key of Object.keys(this.evaluation.additionalSegmentation)) {
          if (this.evaluation.additionalSegmentation[key].selected) {
            this.totalQuestionsCount++
            // Add "Prefer not to answer" option
            this.evaluation.additionalSegmentation[key].details.push({
              asId: 0,
              id: -1,
              code: 'prefer_not_to_answer',
              trans: {
                en: { label: 'Prefer not to answer' },
                es: { label: 'Prefiero no responder' }
              }
            })

            seg.push(this.evaluation.additionalSegmentation[key])
            // Initial answers structure
            if (notAnsweredSeg) {
              this.evaluated.temp.segmentation.push({
                segmentationId: this.evaluation.additionalSegmentation[key].id,
                detailId: null
              })
            }
          }
        }
        this.pages.push(seg)
      }

      // Questionnaire Questions
      const qQuestions = this.evaluation.questionnaire.evaluations
      const notAnsweredQuestions = !this.evaluated.temp.evaluations.length
      let dimCnt = 0
      for (const dimKey of Object.keys(qQuestions)) {
        const dimension = qQuestions[dimKey]
        // Initial answers structure
        if (notAnsweredQuestions) {
          if (dimKey === 'leader') {
            if (this.isLeader) {
              this.evaluated.temp.evaluations.push({ attribute: [] })
            }
          } else {
            this.evaluated.temp.evaluations.push({ attribute: [] })
          }
        }
        const dimensionQuestions = []
        if (dimension.attrs) {
          for (const attrKey of Object.keys(dimension.attrs)) {
            const attribute = dimension.attrs[attrKey]
            for (const qKey of Object.keys(attribute.questions)) {
              const question = attribute.questions[qKey]
              // Initial answers structure
              if (notAnsweredQuestions) {
                this.evaluated.temp.evaluations[dimCnt].attribute.push({
                  key: qKey,
                  qType: question.type,
                  score: []
                })
              }
              // Questions structure
              if (!question.parent) {
                question.qCount = this.questionsCount
                this.questionsCount++
              }
              dimensionQuestions.push(question)
              this.totalQuestionsCount++
            }
          }
          this.pages.push(dimensionQuestions)
        } else {
          // Leaders questions
          if (this.isLeader) {
            for (const qKey of Object.keys(dimension)) {
              const question = dimension[qKey]
              // Initial answers structure
              if (notAnsweredQuestions) {
                this.evaluated.temp.evaluations[dimCnt].attribute.push({
                  key: qKey,
                  qType: question.type,
                  score: []
                })
              }
              // Questions structure
              if (!question.parent) {
                question.qCount = this.questionsCount
                this.questionsCount++
              }
              dimensionQuestions.push(question)
              this.totalQuestionsCount++
            }
            this.pages.push(dimensionQuestions)
          }
        }
        dimCnt++
      }

      // Additional Questions
      this.hasAdditionalQuestions = this.evaluation.additionalQuestions &&
        this.evaluation.additionalQuestions.length > 0 &&
        this.evaluation.additionalQuestions[0].question !== ''
      if (this.hasAdditionalQuestions) {
        this.totalQuestionsCount += this.evaluation.additionalQuestions.length
        this.pages.push(this.evaluation.additionalQuestions)
        // Initial answers structure
        if (notAnsweredQuestions) {
          for (const additionalQ of this.evaluation.additionalQuestions) {
            this.evaluated.temp.additional.push({ question: additionalQ.question, answer: [null] })
          }
        }
      }

      // Set progress when poll is partially filled
      if (!notAnsweredQuestions) {
        this.setProgress(true)
      }
    },
    isOptLimited (question, option, index) {
      const answer = this.evaluated.temp.evaluations[this.computedQuestionnairePages - 1].attribute[index]
      return question.limit
        ? (answer.score.length >= question.limit) && !answer.score.includes(parseFloat(option.value))
        : false
    },
    isOptExclusive (option, index) {
      const answer = this.evaluated.temp.evaluations[this.computedQuestionnairePages - 1].attribute[index]
      const val = parseFloat(option.value)

      if (val > 0.9) {
        return answer.score.length > 0 && !answer.score.includes(val)
      } else {
        return answer.score.length > 0 && answer.score.some(x => x > 0.9)
      }
    },
    parentAnsweredTrue (parentId, answer) {
      const parts = parentId.split('_')
      const dimIdx = parts[0].match(/(\d+)/)[1] - 1
      const foundParent = this.evaluated.temp.evaluations[dimIdx].attribute.find(q => q.key === parentId)
      if (foundParent && foundParent.score[0] === 1) {
        if (answer.score.length && answer.score[0] === -1) {
          answer.score = []
        }
        return true
      }
      if (!answer.score.length || answer.score[0] !== -1) {
        answer.score = [-1]
      }
      return false
    },
    setFaceAnswer (index, val) {
      this.evaluated.temp.evaluations[this.computedQuestionnairePages - 1].attribute[index].score = [val]
      this.saveAnswers()
    },
    saveAnswers () {
      this.$store.dispatch('loading/show')
      evaluationsService.saveEvaluatedTempAnswers(this.$route.params.tokenId, this.evaluated.temp)
        .then(() => {
          setTimeout(() => this.setProgress(), 140)
        })
        .catch((err) => {
          this.$store.dispatch('alert/error', this.$t(`errors.${err.code}`))
        })
        .finally(() => {
          this.$store.dispatch('loading/hide')
        })
    },
    finishEvaluatedPoll () {
      this.$store.dispatch('loading/show')
      evaluationsService.finishPoll(this.$route.params.tokenId)
        .then(() => {
          this.completed = true
          this.endDialog = true
        })
        .catch((err) => {
          if (err.code === 'evaluation-has-ended') {
            this.showDialog('/img/expiracion.png', this.$t('Views.Evaluations.evaluation.expiration_date'))
          } else {
            this.$store.dispatch('alert/error', this.$t(`errors.${err.code}`))
          }
        })
        .finally(() => {
          this.showConfirmation = false
          this.$store.dispatch('loading/hide')
        })
    }
  }
})
