
<template>
  <v-row>
    <v-col cols="12" class="py-5 text-center">
      <v-btn large
        :loading="loadingBtn"
        :disabled="disableButton"
        color="primary"
        @click="openDialog()"
      >
        <v-icon class="mr-3">mdi-file-pdf</v-icon>
        {{ $t('Views.Evaluations.report.generate_report') }}
      </v-btn>

      <!-- Dialog already Generated Report -->
      <x-dialog-already-generated-report
        :show.sync="alreadyGeneratedModal"
        @close="alreadyGeneratedModal = false"
      ></x-dialog-already-generated-report>
    </v-col>
  </v-row>
</template>

<script>
import Vue from 'vue'

import evaluationsService from '../../../services/evaluations'
import XDialogAlreadyGeneratedReport from './components/dialog-already-generated-report'

export default Vue.extend({
  name: 'generate-organizational-report',
  components: {
    XDialogAlreadyGeneratedReport
  },
  props: {
    pollId: String,
    disableButton: Boolean,
    alreadyGenerated: Boolean
  },
  data () {
    return {
      loadingBtn: false,
      disableButtonModal: true,
      alreadyGeneratedModal: false,
      balance: 0,
      price: 0
    }
  },
  watch: {
    disableButton (val) {
      this.disableButtonModal = val
    }
  },
  methods: {
    openDialog () {
      if (this.alreadyGenerated) {
        this.alreadyGeneratedModal = true
      } else {
        this.runGenerateReport()
      }
    },
    runGenerateReport () {
      this.$store.dispatch('loading/show')
      return evaluationsService.generateReportOrganizational(this.pollId)
        .then(() => {
          this.$store.dispatch(
            'alert/success',
            this.$t('Views.Evaluations.report.organizational.operation_init')
          )
          this.$emit('reportGenerated')
        })
        .catch((err) => {
          this.$store.dispatch('alert/error', this.$t(`errors.${err.code}`))
        })
        .finally(() => {
          this.loadingBtn = false
          this.$store.dispatch('loading/hide')
        })
    }
  }
})
</script>
