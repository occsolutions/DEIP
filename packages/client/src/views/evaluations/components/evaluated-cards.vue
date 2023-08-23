<template>
  <v-row>
    <v-col xs="12" sm="3" v-for="(evaluated, n) in evaluation.evaluated" :key="n" >
      <v-card>
        <v-toolbar dense color="primary" flat class="white--text">
          <v-toolbar-title>
            <h2 class="subtitle">
              {{ evaluated.employee.firstName }}
              {{ evaluated.employee.lastName }}
            </h2>
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon class="white--text" @click="deleteEvaluated(n)">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text>
          <h1 class="my-2">{{ $t('evaluations.evaluators') }}</h1>
          <span>
            {{evaluated.leadersEvaluators.length}} {{ evaluated.leadersEvaluators.length !== 1 ? $t('evaluations.leaders') : $t('evaluations.leader') }}
          </span> <br>
          <span>
            {{evaluated.pairsEvaluators.length}} {{ evaluated.pairsEvaluators.length !== 1 ? $t('evaluations.pairs') : $t('evaluations.pair') }}
          </span> <br>
          <span>
            {{evaluated.dependentsEvaluators.length}} {{ evaluated.dependentsEvaluators.length !== 1 ? $t('evaluations.dependents') : $t('evaluations.dependent') }}
          </span> <br>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            class="text-capitalize text-center"
            @click="showList(evaluated)"
          >
            {{ $t('evaluations.show_list') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>

import Vue from 'vue'

export default Vue.extend({
  props: {
    evaluation: Object
  },
  methods: {
    showList (evaluated) {
      this.$emit('showList', evaluated)
    },
    deleteEvaluated (index) {
      this.$emit('deleteEvaluated', index)
    }
  }
})
</script>
