
import Vue from 'vue'

import evaluationsService from '../../services/evaluations'

import XWellcomeDialog from './components/wellcome-dialog.vue'
import XMiddleDialog from './components/middle-dialog.vue'
import XEndDialog from './components/end-dialog.vue'

import DevFillForm from '../../utils/dev-fill-form.js'

export default Vue.extend({
  components: {
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
      evaluation: {
        timeZone: '',
        enterprise: {}
      },
      evaluated: {},
      answersRefs: {},
      lang: '',
      completed: false,
      progress: 0,
      legendColors: ['#BB3E3E', '#B8663D', '#C2B147', '#B6C144', '#44C156', '#1B5E20'],
      // Modals
      outIntervalDialog: false,
      dialogIcon: '',
      dialogText: '',
      startDialog: false,
      middleDialog: false,
      displayedMiddleDialog: false,
      showConfirmation: false,
      endDialog: false,
      alreadySentEmail: ''
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
              a.variable.forEach(v => {
                if (v.score) {
                  answered++
                  this.pageAnswerCnt[qPage]++
                }
              })
              qPage++
            })
            break
          case 'indices':
            this.pageAnswerCnt[qPage] = 0
            this.evaluated.temp[key].forEach(a => {
              if (a.answer) {
                answered++
                this.pageAnswerCnt[qPage]++
              }
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
          case 'open':
            this.pageAnswerCnt[qPage + 2] = 0
            this.evaluated.temp[key].forEach(a => {
              a.answer.forEach(oq => {
                if (oq) {
                  answered++
                  this.pageAnswerCnt[qPage + 2]++
                }
              })
            })
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
            this.alreadySentEmail = this.evaluated.alreadySentEmail || ''
            if (res.data.status === 'completed') {
              this.completed = true
              this.$store.dispatch('loading/hide')
              if (this.evaluated.status === 'completed') {
                this.endDialog = true
              } else {
                this.showDialog('/img/expiracion.png', this.$t('Views.Evaluations.evaluation.expiration_date'))
              }
            } else {
              this.evaluation = res.data
              const releasedAtParsed = Date.parse(res.data.deliveredAt.split('Z')[0]) / 1000
              const deadLineAtParsed = Date.parse(res.data.validUntil.split('Z')[0]) / 1000
              if (releasedAtParsed > parseInt(Date.now() / 1000)) {
                this.showDialog('/img/reloj.png', this.$t('Views.Evaluations.evaluation.before_date'))
              } else if (deadLineAtParsed < parseInt(Date.now() / 1000)) {
                this.showDialog('/img/expiracion.png', this.$t('Views.Evaluations.evaluation.expiration_date'))
              } else if (res.data.status === 'pending') {
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
        }).catch((err) => {
          this.$store.dispatch('alert/error', this.$t(`errors.${err.code}`))
          this.$store.dispatch('loading/hide')
        })
    },
    assemblePoll () {
      // Answers Types
      this.answersRefs = this.evaluation.answersReference

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
        // Initial answers structure
        if (notAnsweredQuestions) {
          this.evaluated.temp.evaluations.push({ variable: [] })
        }
        const dimensionQuestions = []
        for (const varKey of Object.keys(qQuestions[dimKey])) {
          for (const qKey of Object.keys(qQuestions[dimKey][varKey])) {
            // Initial answers structure
            if (notAnsweredQuestions) {
              this.evaluated.temp.evaluations[dimCnt].variable.push({ score: null })
            }
            // Questions structure
            qQuestions[dimKey][varKey][qKey].qCount = this.questionsCount
            dimensionQuestions.push(qQuestions[dimKey][varKey][qKey])
            this.questionsCount++
            this.totalQuestionsCount++
          }
        }
        dimCnt++
        this.pages.push(dimensionQuestions)
      }

      // Index Questions
      this.pages.push(this.evaluation.questionsIndex)
      this.totalQuestionsCount += this.evaluation.questionsIndex.length
      if (notAnsweredQuestions) {
        // Initial answers structure
        for (const index of this.evaluation.questionsIndex) {
          this.evaluated.temp.indices.push({ idx: index.idx, answer: null })
        }
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

      // Open Questions
      this.pages.push(this.evaluation.openQuestions)
      this.totalQuestionsCount += (this.evaluation.openQuestions.length * 3)
      // Initial answers structure
      if (notAnsweredQuestions) {
        for (const openQ of this.evaluation.openQuestions) {
          this.evaluated.temp.open.push({ question: openQ.name, answer: [null, null, null] })
        }
      }

      // Set progress when poll is partially filled
      if (!notAnsweredQuestions) {
        this.setProgress(true)
      }
    },
    getAnswerRef (idx) {
      const aRefs = this.answersRefs.find(aRef => aRef.idx === idx)
      const cleanRef = {}
      for (const key of Object.keys(aRefs)) {
        if (!isNaN(parseInt(key))) {
          cleanRef[key] = aRefs[key]
        }
      }
      return cleanRef
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
