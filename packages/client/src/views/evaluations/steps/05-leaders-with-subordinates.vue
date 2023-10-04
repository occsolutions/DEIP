<template>
  <v-card flat class="py-3 px-3">
    <v-row>
      <v-col cols="12" class="headline">
        {{ $t('Views.Evaluations.stepEvaluatedSelection.leader_title') }}
        <v-divider class="my-1"></v-divider>
      </v-col>
    </v-row>
    <v-card-subtitle class="pa-1 pb-4 body-2 text-justify">
      {{ $t('Views.Evaluations.stepEvaluatedSelection.leader_desc') }}
    </v-card-subtitle>

    <!------------------------------------->
    <!------------- LEADERS --------------->
    <!------------------------------------->
    <x-evaluated-leaders-selection v-if="evaluation.populationCount"
      :is-edit="isEdit"
      :employees="evaluation.toLeaders"
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

import XEvaluatedLeadersSelection from '../components/evaluated-leaders-selection.vue'

export default Vue.extend({
  components: {
    XEvaluatedLeadersSelection
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
    //
  },
  computed: {
    ...mapState({
      user: state => state.session.user
    })
  },
  methods: {
    changeStep (isBack = false) {
      this.$emit('changeStep', this.evaluation, isBack ? +this.step - 1 : +this.step + 1)
    }
  }
})
</script>
