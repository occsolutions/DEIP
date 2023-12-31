<template>
  <v-dialog v-model="show" width="44em" persistent>
    <v-card>
      <v-card-title
        class="headline white--text primary lighten-2 pb-4"
        primary-title
      >
        {{ $t('Views.Evaluations.stepEvaluatedSelection.addEvaluatorDialog.add_evaluated') }}
      </v-card-title>

      <v-card-text class="pt-12">
        <v-row>
          <v-col cols="12">
            <ValidationObserver v-slot="{ handleSubmit }">
              <v-form @submit.prevent="handleSubmit(pushEvaluator)">
                <v-row>
                  <v-col cols="12">
                    <x-inputs-autocomplete
                      :items="filterEmployees()"
                      :input="evaluated"
                      @updateInput="($event) => evaluated = $event"
                      light
                      :label="$t('Views.Evaluations.stepEvaluatedSelection.addEvaluatorDialog.evaluated')"
                      name="evaluated"
                      rules="required"
                      autofocus
                      multiple
                      return-object
                    />
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" sm="6">
                    <v-btn
                      block
                      large
                      @click="closeDialog"
                    >{{ $t('Views.Evaluations.stepEvaluatedSelection.addEvaluatorDialog.input_cancel') }}</v-btn>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-btn
                      color="primary"
                      block
                      large
                      type="submit"
                    >{{ $t('Views.Evaluations.stepEvaluatedSelection.addEvaluatorDialog.input_save') }}</v-btn>
                  </v-col>
                </v-row>
              </v-form>
            </ValidationObserver>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>

import Vue from 'vue'

export default Vue.extend({
  props: {
    employees: Array,
    evaluation: Object,
    keyEvaluated: {
      type: String,
      default: 'evaluated'
    }
  },
  data () {
    return {
      show: true,
      evaluated: []
    }
  },
  methods: {
    employeeMapper (employee) {
      const emp = employee.firstName ? employee : employee.employee
      if (emp.text) {
        return emp
      } else {
        return {
          text: `${emp.firstName} ${emp.lastName}`,
          value: emp.id,
          ...emp
        }
      }
    },
    closeDialog () {
      this.$emit('closeDialog')
    },
    pushEvaluator () {
      this.$emit('pushEvaluator', this.evaluated)
    },
    filterEmployees () {
      return this.evaluation[this.keyEvaluated].length ? this.employees.filter(employee => {
        return !this.evaluation[this.keyEvaluated].find(evaluated => {
          return evaluated.id === employee.id
        })
      }).map(this.employeeMapper) : this.employees.map(this.employeeMapper)
    }
  }
})
</script>
