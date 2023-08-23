<template>
  <v-dialog v-model="showEvaluatedList" width="45em">
    <v-card>
      <v-toolbar color="primary" class="white--text mb-4">
        <v-toolbar-title>
          {{ $t('evaluations.list_of_evaluators_for') }} {{ evaluatedList.employee.employee.firstName }} {{ evaluatedList.employee.employee.lastName }}
        </v-toolbar-title>
      </v-toolbar>

      <v-card-text>
        <v-row>
          <v-col>
            <h2 class="mb-1">{{ $t('evaluations.leaders') }}</h2>
            <span v-if="evaluatedList.leadersEvaluators.length === 0">{{ $t('evaluations.no_leaders') }}</span>
            <v-chip
              outlined
              color="grey darken-2"
              v-for="(leader, k) in mapEvaluators(evaluatedList.leadersEvaluators)" :key="leader.id"
              :close="!evaluation.status || evaluation.status === 'pending'"
              @click:close="deleteEvaluator(k, 'leader')" class="my-1 mx-1">
              {{leader.firstName}} {{leader.lastName}}
            </v-chip>
          </v-col>
          <v-col>
            <h2 class="mb-1">{{ $t('evaluations.pairs') }}</h2>
            <span v-if="evaluatedList.pairsEvaluators.length === 0">{{ $t('evaluations.no_pairs') }}</span>
            <v-chip
              outlined
              color="grey darken-2"
              v-for="(pair, k) in mapEvaluators(evaluatedList.pairsEvaluators)" :key="pair.id"
              :close="!evaluation.status || evaluation.status === 'pending'"
              @click:close="deleteEvaluator(k, 'pair')" class="my-1 mx-1">
              {{pair.firstName}} {{pair.lastName}}
            </v-chip>
          </v-col>
          <v-col>
            <h2 class="mb-1">{{ $t('evaluations.dependents') }}</h2>
            <span v-if="evaluatedList.dependentsEvaluators.length === 0">{{ $t('evaluations.no_dependents') }}</span>
            <v-chip
              outlined
              color="grey darken-2"
              v-for="(dependent, k) in mapEvaluators(evaluatedList.dependentsEvaluators)"
              :close="!evaluation.status || evaluation.status === 'pending'"
              @click:close="deleteEvaluator(k, 'dependent')" :key="dependent.id" class="my-1 mx-1">
              {{dependent.firstName}} {{dependent.lastName}}
            </v-chip>
          </v-col>
        </v-row>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          class="text-uppercase"
          @click="hideList"
        >
          {{ $t('input.close') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>

import Vue from 'vue'

export default Vue.extend({
  props: {
    evaluation: Object,
    evaluatedList: Object
  },
  data () {
    return {
      showEvaluatedList: true
    }
  },
  methods: {
    hideList () {
      this.$emit('hideList')
    },
    findEvaluated () {
      for (const evaluated of this.evaluation.evaluated) {
        if (evaluated.employee.employee.id === this.evaluatedList.employee.employee.id) {
          return evaluated
        }
      }
    },
    deleteEvaluator (index, type) {
      const evaluated = this.findEvaluated()
      switch (type) {
        case 'leader':
          if (evaluated) {
            evaluated.leadersEvaluators.splice(index, 1)
          }
          break
        case 'pair':
          if (evaluated) {
            evaluated.pairsEvaluators.splice(index, 1)
          }
          break
        case 'dependent':
          if (evaluated) {
            evaluated.dependentsEvaluators.splice(index, 1)
          }
          break
      }
    },
    mapEvaluators (evaluators) {
      return evaluators.map((ev) => {
        return ev.firstName ? ev : ev.employee
      })
    }
  }
})
</script>
