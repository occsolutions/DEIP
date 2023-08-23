<template>
  <v-container fluid>
    <v-row align="center" justify="start" fill-height>
      <v-col xs="12" class="ml-2">
        <h4 class="display-1 mb-3">{{ $t('Views.Evaluations.create.title') }}</h4>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-card class="mt-4">
          <x-stepper
            :step="step"
            :headers="stepperHeaders"
            :max-sm="1"
            :max-md="2"
            :max-lg="3"
            :max-xl="4"
            @step="step = $event"
          >
            <v-stepper-content key="1-content" step="1">
              <x-step-overview
                v-if="step == 1"
                :evaluation="evaluation"
                C:total-receptors="totalParticipants"
                step="1"
                nextAction="Views.Evaluations.create.stepper_btn_next"
                prevAction="Views.Evaluations.create.stepper_btn_cancel"
                @changeStep="verifyStepChanged"
              />
            </v-stepper-content>
            <v-stepper-content key="2-content" step="2">
              <x-step-date
                v-if="step == 2"
                :evaluation="evaluation"
                step="2"
                nextAction="Views.Evaluations.create.stepper_btn_next"
                prevAction="Views.Evaluations.create.stepper_btn_back"
                @changeStep="verifyStepChanged"
                :time-zones="timeZones"
              ></x-step-date>
            </v-stepper-content>

            <v-stepper-content key="3-content" step="3" class="pb-0">
              <x-step-question
                v-if="step == 3"
                :is-edit="false"
                :evaluation="evaluation"
                step="3"
                nextAction="Views.Evaluations.create.stepper_btn_next"
                prevAction="Views.Evaluations.create.stepper_btn_back"
                @changeStep="verifyStepChanged"
              ></x-step-question>
            </v-stepper-content>
            <v-stepper-content key="4-content" step="4">
              <x-step-evaluated-selection
                v-show="step == 4"
                :evaluation="evaluation"
                :identify-types="identifyTypes"
                step="4"
                nextAction="Views.Evaluations.create.stepper_btn_next"
                prevAction="Views.Evaluations.create.stepper_btn_back"
                @changeStep="verifyStepChanged"
                :employees="employees"
              />
            </v-stepper-content>
            <v-stepper-content key="5-content" step="5">
              <x-step-additional-segmentation
                :evaluation="evaluation"
                :user="user"
                step="5"
                :current-step="step"
                nextAction="Views.Evaluations.create.stepper_btn_next"
                prevAction="Views.Evaluations.create.stepper_btn_back"
                @changeStep="verifyStepChanged"
              ></x-step-additional-segmentation>
            </v-stepper-content>
            <v-stepper-content key="6-content" step="6">
              <x-step-revition
                v-if="step === 6"
                :evaluation="evaluation"
                :identify-types="identifyTypes"
                :price="evaluation.price"
                step="6"
                :key="step"
                nextAction="Views.Evaluations.create.stepper_btn_confirm_create"
                prevAction="Views.Evaluations.create.stepper_btn_back"
                @changeStep="verifyStepChanged"
                :balance="balance"
                :count-old-evaluated="0"
              ></x-step-revition>
            </v-stepper-content>
          </x-stepper>
        </v-card>
      </v-col>
    </v-row>
    <x-confirm-spend-dialog
      :confirmText="$t('Views.Evaluations.create.modal_confirm_create_title')"
      :costText="$t('Views.Evaluations.create.modal_workshop_cost')"
      :showModalConfirm="showModalConfirm"
      :balance="balance"
      :price="evaluation.totalPrice"
      :noActiveEmployee="false"
      :noBalanceResponse="noBalanceResponse"
      :disableButtonModal="disableButtonModal"
      @update="reCheckBalance"
      @result="verifySpend">
    </x-confirm-spend-dialog>
  </v-container>
</template>

<script>
import Vue from 'vue'
import { mapState } from 'vuex'

import Resolver from '../../utils/resolver'

import evaluationsService from '../../services/evaluations'
import employeesService from '../../services/employees'
import timeZoneService from '../../services/time-zones'
import identifyTypesService from '../../services/identify-types'

import XStepOverview from './steps/overview.vue'
import XStepDate from './steps/date.vue'
import XStepQuestion from './steps/question.vue'
import XStepEvaluatedSelection from './steps/evaluated-selection.vue'
import XStepAdditionalSegmentation from './steps/additional-segmentation.vue'
import XStepRevition from './steps/revition.vue'

export default Vue.extend({
  components: {
    XStepOverview,
    XStepDate,
    XStepQuestion,
    XStepEvaluatedSelection,
    XStepAdditionalSegmentation,
    XStepRevition
  },
  data () {
    return {
      stepperHeaders: [
        'Views.Evaluations.create.stepper_overview',
        'Views.Evaluations.create.stepper_date',
        'Views.Evaluations.create.stepper_questions',
        'Views.Evaluations.create.stepper_population',
        'Views.Evaluations.create.stepper_additional_segmentation',
        'Views.Evaluations.create.stepper_revition'
      ],
      evaluation: {
        evaluated: [],
        reviewMassive: false,
        errors: null,
        name: '',
        displayName: '',
        timeZone: '(UTC-05:00) Bogotá, Lima, Quito',
        deliveredAt: {
          value: '',
          hour: '23:00'
        },
        validUntil: {
          value: '',
          hour: '23:00'
        },
        status: 'pending',
        selectionType: '',
        populationCount: 0,
        switchAdditionalQuestion: false,
        additionalQuestions: [{
          question: '',
          options: ['', '']
        }],
        reminders: [],
        switchDate: false,
        questionnaire: '',
        questionnaireName: '',
        pollInvitation: {
          subject: '',
          body: '',
          file: ''
        },
        reminderMail: {
          subject: '',
          body: '',
          file: ''
        },
        active: null,
        price: 0,
        totalPrice: 0,
        additionalSegmentation: {},
        demographicItems: {},
        // Demographic Selected Criteria
        departmentIds: [],
        chargeIds: [],
        academicDegreeIds: [],
        jobTypeIds: [],
        rangeAge: [],
        rangeAntiquity: [],
        genderId: '',
        countrySelect: [],
        headquarterSelect: [],
        additionalDemographic1Ids: [],
        additionalDemographic2Ids: []
      },
      step: 1,
      enterpriseId: null,
      options: {
        filter: null,
        search: null
      },
      totalParticipants: null,
      employees: [],
      identifyTypes: {},
      timeZones: [],
      balance: 0,
      showModalConfirm: false,
      disableButtonModal: false,
      noBalanceResponse: false,
      createdSlug: ''
    }
  },
  computed: {
    ...mapState({
      user: (state) => state.session.user
    })
  },
  created () {
    Resolver.all({
      employees: employeesService.listActive(),
      timeZones: timeZoneService.list(),
      identifyTypes: identifyTypesService.list(),
      balance: evaluationsService.checkBalance('individual')
    })
      .then(res => {
        res.identifyTypes.items.forEach(et => {
          this.identifyTypes[et.id] = this.getInitials(et.translate.label) + ' - '
        })
        this.totalParticipants = res.employees.total
        this.getEmployees(res.employees.items)
        this.getTimeZones(res.timeZones.items)
        this.balance = res.balance.balance
        this.evaluation.price = res.balance.productService
      })
  },
  watch: {
    step (val) {
      if (val === 6 && this.evaluation.additionalQuestions.length > 1) {
        if (this.evaluation.additionalQuestions[this.evaluation.additionalQuestions.length - 1].question === '') {
          this.evaluation.additionalQuestions.pop()
        }
      }
    }
  },
  methods: {
    getInitials (text) {
      return text.trim().split(' ').map(t => t.slice(0, 1)).join('').toUpperCase()
    },
    toConfirm () {
      this.disableButtonModal = true
      this.showModalConfirm = true
    },
    verifySpend (data) {
      if (data === 1) {
        return this.create()
      }
      this.showModalConfirm = false
    },
    verifyStepChanged (data, step) {
      switch (step) {
        case 0: return this.$router.push('/evaluations')
        case 7: return this.toConfirm()
        default: return (this.step = step)
      }
    },
    reCheckBalance () {
      evaluationsService.checkBalance('individual')
        .then(res => {
          this.balance = res.balance
        })
    },
    create () {
      this.$store.dispatch('loading/show')
      this.disableButtonModal = false
      const pollInvitationFile = this.evaluation.pollInvitation.file
      const reminderMailFile = this.evaluation.reminderMail.file
      const data = JSON.parse(JSON.stringify(this.evaluation))
      data.pollInvitation.file = this.evaluation.pollInvitation.file.name
      data.reminderMail.file = this.evaluation.reminderMail.file.name

      data.enterprise = this.user.enterprise
      data.enterprise.customer = this.user.customer

      data.evaluated = data.evaluated.map(emp => emp.id)

      // Clean Payload
      delete data.active
      delete data.questionnaires
      delete data.demographicItems
      delete data.questionnaireName
      delete data.reviewMassive

      return evaluationsService.create(data)
        .then((res) => {
          if (!res._id) {
            if (res.status === 401) {
              this.$store.dispatch('alert/error', this.$t('errors.no_balance'))
              this.noBalanceResponse = true
            }
            return Promise.reject(this.$t('errors.no_balance'))
          }

          this.createdSlug = res.slug
          return pollInvitationFile ? evaluationsService.sendInvitationFiles(res._id, { pollInvitationFile })
            .then(() => res)
            .catch(() => {
              this.$store.dispatch('alert/error', this.$t('errors.uploadInvitationError'))
              setTimeout(this.redirectSummary, 3000)
            }) : Promise.resolve(res)
        })
        .then((res) => {
          return reminderMailFile ? evaluationsService.sendReminderFiles(res._id, { reminderMailFile })
            .then(() => res)
            .catch(() => {
              this.$store.dispatch('alert/error', this.$t('errors.uploadReminderError'))
              setTimeout(this.redirectSummary, 3000)
            }) : Promise.resolve(res)
        })
        .then((res) => {
          if (res) {
            this.$store.dispatch('alert/success', this.$t('Views.Evaluations.create.msg_created_evaluation'))
            setTimeout(this.redirectSummary, 3000)
          }
          this.showModalConfirm = false
          return false
        })
        .catch((err) => {
          this.$store.dispatch('alert/error', this.$t(`errors.${err.code}`))
        })
        .finally(() => {
          this.$store.dispatch('loading/hide')
          this.disableButtonModal = true
        })
    },
    getEmployees (items) {
      this.employees = items.map((employee) => {
        return {
          text: `${employee.firstName} ${employee.lastName} (${this.identifyTypes[employee.identifyTypeId]}${employee.identifyDocument})`,
          value: employee.id,
          id: employee.id,
          firstName: employee.firstName,
          lastName: employee.lastName,
          identifyTypeId: employee.identifyTypeId,
          identifyDocument: employee.identifyDocument,
          employee: { id: employee.employee.id }
        }
      })
    },
    getTimeZones (items) {
      this.timeZones = items.map((item) => ({
        value: item.text,
        text: item.text,
        offset: item.offset
      }))
    },
    redirectSummary () {
      this.$store.dispatch('loading/hide')
      this.$router.push('/operation-summary/individual/' + this.createdSlug)
    }
  }
})
</script>
