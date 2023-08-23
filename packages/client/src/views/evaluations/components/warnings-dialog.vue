<template>
  <v-dialog v-model="modalWarnings" width="70em">
    <v-card>
      <v-card-title
        class="headline grey lighten-2"
        style="padding: 1em"
        primary-title
      >
        {{ $t('Views.Evaluations.stepEvaluatedSelection.warningsDialog.warnings_list') }}
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12" v-if="errors.evaluatedDuplicated.length">
            <v-alert v-for="(evaluatedDuplicated, $idx) in filteredEvaluatedDuplicated" :key="`evaluatedDuplicated-${$idx}-${evaluatedDuplicated.id}`"
              type="warning" dense text>
              {{ $t('Views.Evaluations.stepEvaluatedSelection.warningsDialog.the_member') }} <strong>{{ evaluatedDuplicated.firstName }} {{ evaluatedDuplicated.lastName }} </strong>
              {{ $t('Views.Evaluations.stepEvaluatedSelection.warningsDialog.multiple_appears_warning') }}
            </v-alert>
          </v-col>
          <v-col cols="12" v-if="errors.evaluatedNotFound.length">
            <v-alert type="warning" dense text>
              {{ $t('Views.Evaluations.stepEvaluatedSelection.warningsDialog.evaluated_not_found_warning') }}
              <ul>
                <li v-for="(evaluatedNotFound, $idx) in filteredEvaluatedNotFound" :key="`evaluatedNotFound-${$idx}-${evaluatedNotFound.id}`">
                  {{ evaluatedNotFound }}
                </li>
              </ul>
            </v-alert>
          </v-col>
        </v-row>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" class="text-uppercase" large text
          @click="hideModalWarnings"
        >
          {{ $t('Views.Evaluations.stepEvaluatedSelection.warningsDialog.input_close') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>

import Vue from 'vue'

export default Vue.extend({
  props: {
    errors: Object
  },
  data () {
    return {
      modalWarnings: true
    }
  },
  computed: {
    filteredEvaluatedNotFound () {
      return this.errors.evaluatedNotFound.filter(this.filter)
    },
    filteredEvaluatedDuplicated () {
      return this.errors.evaluatedDuplicated.filter(this.filter)
    }
  },
  methods: {
    hideModalWarnings () {
      this.$emit('hideModalWarnings')
    },
    filter (element, idx, self) {
      return self.indexOf(element) === idx
    }
  }
})
</script>
