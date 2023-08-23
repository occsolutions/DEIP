
<template>
  <x-async-btn
    class="white--text"
    :action="downloadTemplate"
    >
    <v-icon left>mdi-download</v-icon>
    {{ $t('Views.Evaluations.stepEvaluatedSelection.generateTemplate.download_template') }}
  </x-async-btn>
</template>

<script>
import Vue from 'vue'

import fileDownload from '../../../utils/file-download'

import evaluationsService from '../../../services/evaluations'

export default Vue.extend({
  methods: {
    downloadTemplate () {
      this.$store.dispatch('loading/show')
      return evaluationsService
        .generateTemplate()
        .then((res) => {
          this.$store.dispatch('loading/hide')
          const blob = new Blob([res.template])
          fileDownload(blob, 'plantilla.csv')
        })
        .catch(err => {
          this.$store.dispatch('loading/hide')
          this.$store.dispatch('alert/error', this.$t(`errors.${err.code}`))
        })
    }
  }
})
</script>
