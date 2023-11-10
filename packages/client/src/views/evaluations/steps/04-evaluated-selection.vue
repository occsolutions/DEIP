<template>
  <v-card flat class="py-3 px-3">
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
      <v-col cols="12" class="pt-2 pb-4 px-8 headline text-right">
        {{ $t('Views.Evaluations.create.total_receptors', {n: `${populationCnt}`}) }}
      </v-col>

      <!-- Population change warning -->
      <v-col cols="12"
        v-if="isEdit && populationDiff > 0"
        class="pt-0 pb-1 px-4 caption text-right error--text"
      >
        {{ populationDiff === 1
            ? $t('Views.Evaluations.stepEvaluatedSelection.population_diff_singular')
            : $t('Views.Evaluations.stepEvaluatedSelection.population_diff_plural', {n: `${populationDiff}`})
        }}
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
    <!---------- Actions Buttons ---------->
    <!------------------------------------->
    <v-row class="mt-0">
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
          :disabled="!evaluation.populationCount || loadingDemographics"
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

import XEvaluatedByDemographicSelection from '../components/evaluated-by-demographic-selection.vue'

export default Vue.extend({
  components: {
    XEvaluatedByDemographicSelection
  },
  props: {
    isEdit: Boolean,
    evaluation: Object,
    step: String,
    nextAction: String,
    prevAction: String,
    employees: Array
  },
  data () {
    return {
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
            this.evaluation.leaders = []
            this.evaluation.toLeaders = []

            // Check type
            if (val === 'everybody') {
              this.evaluation.toLeaders = this.employees
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
    }
  },
  computed: {
    ...mapState({
      user: state => state.session.user
    }),
    populationCnt () {
      if (!this.isEdit) {
        return this.evaluation.populationCount
      } else {
        if (['pending', 'in_progress'].includes(this.evaluation.status)) {
          return this.employees.length > this.evaluation.populationCount
            ? this.employees.length
            : this.evaluation.populationCount
        } else {
          return this.evaluation.populationCount
        }
      }
    },
    populationDiff () {
      return this.employees.length - this.evaluation.populationCount
    },
    getSelectType () {
      return [
        {
          value: 'everybody',
          text: this.$t('Views.Evaluations.stepEvaluatedSelection.selectionType.everybody')
        },
        {
          value: 'by_demographic',
          text: this.$t('Views.Evaluations.stepEvaluatedSelection.selectionType.demographic_cuts')
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
