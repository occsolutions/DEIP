
<template>
  <v-dialog
    v-model="show"
    persistent
    max-width="400px">
    <v-card>
      <v-card-text class="pt-7 pb-5 px-8 text-justify">
        {{ $t('Views.Evaluations.report.organizational.already_generated_report') }}
      </v-card-text>
      <v-card-actions class="pt-0">
        <v-spacer></v-spacer>
        <v-btn
          color="info"
          @click="accept()"
        >
          {{ $t('Views.Evaluations.report.input_accept') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>

import Vue from 'vue'

export default Vue.extend({
  props: {
    show: Boolean
  },
  methods: {
    accept () {
      this.$emit('close')
    }
  }
})
</script>
