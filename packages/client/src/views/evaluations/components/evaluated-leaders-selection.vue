<template>
  <div>
    <v-row>
      <v-col cols="12" class="headline">
        <v-divider class="my-1"></v-divider>
        {{ $t('Views.Evaluations.stepEvaluatedSelection.leader_title') }}
      </v-col>
    </v-row>
    <v-card-subtitle class="pa-1 body-2 text-justify">
      {{ $t('Views.Evaluations.stepEvaluatedSelection.leader_desc') }}
    </v-card-subtitle>
    <v-row align="center" justify="center">
      <v-col align="center" justify="center" cols="12" class="pt-0 px-6">
        <v-switch
          v-model="isMassive"
          :label="$t('Views.Evaluations.stepEvaluatedSelection.leader_want_massive')"
        ></v-switch>
      </v-col>
    </v-row>
    <v-row v-if="!isMassive">
      <v-col cols="12">
        <x-evaluated-table
          :evaluated="evaluation.leaders"
          :identify-types="identifyTypes"
          @delete="openModal"
        ></x-evaluated-table>
      </v-col>
    </v-row>
    <v-row v-if="!isMassive">
      <v-col cols="12" align="center" class="pb-6">
        <v-btn x-large
          outlined
          color="green"
          @click="addLeaders"
        >
          <v-icon large class="mr-2">add_circle_outline</v-icon> {{ $t('Views.Evaluations.stepEvaluatedSelection.add_evaluated_leader') }}
        </v-btn>
      </v-col>

      <v-col cols="12" v-if="evaluation.leaders.length"
        class="pt-2 pb-6 px-8 headline text-right"
      >
        {{ $t('Views.Evaluations.create.total_receptors_leaders', {n: `${evaluation.leaders.length}`}) }}
      </v-col>
    </v-row>

    <template v-if="isMassive">
      <ValidationObserver v-slot="{ handleSubmit }">
        <v-form @submit.prevent="handleSubmit(massiveUpload)">
          <v-row>
            <v-col align="end">
              <x-generate-instructive leader class="mr-2"/>
              <x-generate-template :evaluated="evaluation.toLeaders" />
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <x-file-upload
                class="mt-1"
                v-model="file"
                @file-picked="filePicked($event)"
                :label="$t('Views.Evaluations.stepEvaluatedSelection.select_file_to_upload')"
                reff="employees-massive-upload"
                :extensions="extensions"
                name="employees-file"
                :help="{ ...$t('help.enterprise.massive.file_input') }"
                error-messages="error"
                :rules="'ext:csv,xls,xlsx'"
              ></x-file-upload>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="6" class="mx-auto pb-12">
              <v-btn large block
                color="primary"
                type="submit"
              >{{ $t('Views.Evaluations.stepEvaluatedSelection.input_upload_file') }}</v-btn>
            </v-col>
          </v-row>
        </v-form>
      </ValidationObserver>
    </template>
    <!------------- Dialogs ------------->
    <x-warnings-dialog
      :errors="evaluatedErrors"
      v-if="modalWarnings"
      @hideModalWarnings="() => this.modalWarnings = false"
    ></x-warnings-dialog>
    <x-add-evaluator-dialog
      v-if="addLeader"
      :employees="employees"
      :evaluation="evaluation"
      :key-evaluated="'leaders'"
      @closeDialog="addLeader = false"
      @pushEvaluator="pushLeaders"
    ></x-add-evaluator-dialog>
    <x-confirmation-modal
      :show="modalDel.open"
      reversible
      :title="$t('Views.Evaluations.stepEvaluatedSelection.modal_del_title')"
      :action="deleteEvaluated"
      :btn-save="$t('Views.Evaluations.stepEvaluatedSelection.input_trash')"
      color="error"
      @close="modalDel.open = false"
    >
      <template v-slot:question>
        {{ $t('Views.Evaluations.stepEvaluatedSelection.modal_del_question_leader') }}
      </template>
    </x-confirmation-modal>
  </div>
</template>

<script>

import Vue from 'vue'

import evaluationsService from '../../../services/evaluations'

import XEvaluatedTable from '../components/evaluated-table.vue'
import XWarningsDialog from '../components/warnings-dialog.vue'
import XAddEvaluatorDialog from '../components/add-evaluator-dialog.vue'
import XGenerateInstructive from '../components/generate-instructive.vue'
import XGenerateTemplate from '../components/generate-template.vue'

export default Vue.extend({
  components: {
    XEvaluatedTable,
    XWarningsDialog,
    XGenerateInstructive,
    XGenerateTemplate,
    XAddEvaluatorDialog
  },
  props: {
    isEdit: Boolean,
    employees: Array,
    evaluation: Object,
    identifyTypes: Object
  },
  data () {
    return {
      file: '',
      extensions: ['.xls', '.xslx', '.csv'],
      addLeader: false,
      isMassive: false,
      evaluated: null,
      evaluatedList: null,
      modalWarnings: false,
      modalErrors: false,
      modalDel: {
        open: false,
        item: null
      },
      evaluatedErrors: {
        evaluatedNotFound: [],
        evaluatedDuplicated: []
      }
    }
  },
  watch: {
    'evaluation.evaluated': {
      handler (val) {
        if (this.isEdit) {
          this.$emit('editingZeroEvaluated', !val.length)
        }
      }
    },
    evaluatedErrors: {
      handler () {
        if (this.evaluatedErrors.evaluatedNotFound.length || this.evaluatedErrors.evaluatedDuplicated.length) {
          this.modalWarnings = true
        }
      },
      deep: true
    }
  },
  methods: {
    pushLeaders (leaders) {
      this.updateListFromFile(leaders)
      this.addLeader = false
    },
    backToMassive () {
      this.evaluation.evaluated = []
      this.evaluation.reviewMassive = false
    },
    deleteEvaluated () {
      const leadersLeft = this.evaluation.leaders.filter((e) => e.id !== this.modalDel.item.id)
      this.evaluation.leaders = leadersLeft
      return Promise.resolve()
    },
    massiveUpload () {
      this.$store.dispatch('loading/show')
      if (!this.file) {
        this.$store.dispatch('alert/error', this.$t('Views.Evaluations.stepEvaluatedSelection.incorrect_file'))
        this.$store.dispatch('loading/hide')
      } else {
        return evaluationsService.massiveUpload(this.file)
          .then((res) => {
            this.evaluatedErrors = res.errors
            this.updateListFromFile(res.evaluated)
            this.$store.dispatch('loading/hide')
            this.isMassive = false
            this.file = ''
          })
      }
    },
    updateListFromFile (resLeaders) {
      const leaders = this.evaluation.leaders
      const evaluated = this.evaluation.toLeaders
      const exists = []
      const notEvaluated = []
      resLeaders.forEach((ev) => {
        const emp = evaluated.find((it) => ev.id === it.id)
        const ld = leaders.find((it) => ev.id === it.id)
        if (!emp) {
          notEvaluated.push(ev)
          this.evaluatedErrors.evaluatedNotFound.push(ev)
        } else if (ld) {
          this.evaluatedErrors.evaluatedDuplicated.push(ev)
          exists.push(ev)
        } else {
          leaders.push(ev)
        }
      })
      if (exists.length) {
        this.$store.dispatch('alert/warning', this.$t('Views.Evaluations.stepEvaluatedSelection.evaluatedExists'))
      }
      if (notEvaluated.length) {
        this.$store.dispatch('alert/warning', this.$t('Views.Evaluations.stepEvaluatedSelection.evaluatedExists'))
      }
    },
    addLeaders () {
      this.addLeader = true
    },
    filePicked (e) {
      this.file = e
    },
    openModal (index) {
      this.modalDel.item = index
      this.modalDel.open = true
    }
  }
})
</script>
