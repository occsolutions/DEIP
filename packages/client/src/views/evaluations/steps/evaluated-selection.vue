<template>
  <v-card flat class="pt-3 px-3">
    <v-row>
      <v-col cols="12" class="headline">
        {{ $t('Views.Evaluations.stepEvaluatedSelection.title') }}
        <v-divider class="my-1"></v-divider>
      </v-col>
    </v-row>
    <v-card-subtitle class="pa-1 body-2 text-justify">
      {{ $t('Views.Evaluations.stepEvaluatedSelection.desc') }}
    </v-card-subtitle>

    <!-- Population selection type -->
    <v-row>
      <v-col cols="12" sm="6" md="5" class="pt-8 px-4">
        <x-inputs-autocomplete light
          name="selection_type"
          rules="required"
          :readonly="isEdit || loadingDemographics"
          :items="getSelectType"
          :input="evaluation.selectionType"
          :label="$t('Views.Evaluations.stepEvaluatedSelection.want_to_send')"
          :append-outer-icon="$t('help.icon')"
          :help-message="$t('help.pulse.create.selection')"
          @updateInput="($event) => evaluation.selectionType = $event"
        ></x-inputs-autocomplete>
      </v-col>
    </v-row>

    <!------------------------------------->
    <!------------- EVERYBODY ------------->
    <!------------------------------------->
    <v-row v-if="evaluation.selectionType === 'everybody'">
      <v-col cols="12" class="pt-2 pb-6 px-8 headline text-right">
        {{ $t('Views.Evaluations.create.total_receptors', {n: `${evaluation.populationCount}`}) }}
      </v-col>
    </v-row>

    <!------------------------------------->
    <!-------- BY DEMOGRAPHIC CUTS -------->
    <!------------------------------------->
    <x-evaluated-by-demographic-selection v-if="evaluation.selectionType === 'by_demographic'"
      ref="demographic_selection"
      :is-edit="isEdit"
      :demographic-lists="demographicLists"
      :evaluation="evaluation"
      @loadingDemographics="($event) => loadingDemographics = $event"
      @demographicDataLoaded="($event) => demographicDataLoaded = $event"
    />

    <!------------------------------------->
    <!------------- INDIVIDUAL ------------>
    <!------------------------------------->
    <x-evaluated-individual-selection v-if="evaluation.selectionType === 'individual'"
      :is-edit="isEdit"
      :employees="employees"
      :evaluation="evaluation"
      :identify-types="identifyTypes"
      @editingZeroEvaluated="($event) => editHasCeroEvaluated = $event"
    />

    <!------------------------------------->
    <!---------- Actions Buttons ---------->
    <!------------------------------------->
    <v-row>
      <v-col cols="12" sm="6">
        <v-btn block large
          :disabled="loadingDemographics"
          @click="changeStep(true)"
        >
          {{ $t(prevAction) }}
        </v-btn>
      </v-col>
      <v-col cols="12" sm="6">
        <v-btn block large
          color="primary"
          :key="editHasCeroEvaluated"
          :disabled="!evaluation.populationCount || loadingDemographics || editHasCeroEvaluated"
          @click="changeStep(false)"
        >
          {{ $t(nextAction) }}
        </v-btn>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
import Vue from 'vue'
import { mapState } from 'vuex'

import XEvaluatedIndividualSelection from '../components/evaluated-individual-selection.vue'
import XEvaluatedByDemographicSelection from '../components/evaluated-by-demographic-selection.vue'

export default Vue.extend({
  components: {
    XEvaluatedIndividualSelection,
    XEvaluatedByDemographicSelection
  },
  props: {
    isEdit: Boolean,
    evaluation: Object,
    identifyTypes: Object,
    step: String,
    nextAction: String,
    prevAction: String,
    employees: Array
  },
  data () {
    return {
      editHasCeroEvaluated: false,
      loadingDemographics: false,
      demographicDataLoaded: false,
      demographicLists: {
        departments: [],
        academicDegrees: [],
        jobTypes: [],
        charges: [],
        genders: [],
        countries: [],
        getSelectAge: [],
        additionalDemographics1: [],
        additionalDemographics2: []
      }
    }
  },
  created () {
    //
  },
  watch: {
    'evaluation.selectionType': {
      handler (val) {
        if (val) {
          if (!this.isEdit) {
            // Reset
            this.evaluation.populationCount = 0
            this.evaluation.evaluated = []

            // Check type
            if (val === 'everybody') {
              this.evaluation.populationCount = this.employees.length
              this.evaluation.totalPrice = this.evaluation.populationCount * this.evaluation.price
            }
          }
          if (val === 'by_demographic') {
            setTimeout(() => {
              if (!this.isEdit) {
                this.$refs.demographic_selection.clearFilters()
              }
              if (!this.demographicDataLoaded) {
                this.$refs.demographic_selection.loadDemographicData()
              }
            }, 170)
          }
        }
      },
      immediate: true
    },
    'evaluation.evaluated': {
      handler (val) {
        if (this.evaluation.selectionType === 'individual') {
          this.evaluation.populationCount = val.length
          this.evaluation.totalPrice = this.evaluation.populationCount * this.evaluation.price
        }
      }
    }
  },
  computed: {
    ...mapState({
      user: state => state.session.user
    }),
    getSelectType () {
      return [
        {
          value: 'everybody',
          text: this.$t('Views.Evaluations.stepEvaluatedSelection.selectionType.everybody')
        },
        {
          value: 'by_demographic',
          text: this.$t('Views.Evaluations.stepEvaluatedSelection.selectionType.demographic_cuts')
        },
        {
          value: 'individual',
          text: this.$t('Views.Evaluations.stepEvaluatedSelection.selectionType.individual')
        }
      ]
    }
  },
  methods: {
    changeStep (isBack = false) {
      this.$emit('changeStep', this.evaluation, isBack ? +this.step - 1 : +this.step + 1)
    }
  }
})
</script>
