
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

      <x-confirm-spend-dialog
        :confirmText="$t('Views.Evaluations.report.confirm_report_title')"
        :costText="$t('Views.Evaluations.report.report_cost')"
        :showModalConfirm="showModalConfirm"
        :balance="balance"
        :price="price"
        :noBalanceResponse="noBalanceResponse"
        :disableButtonModal="balance > price"
        @result="verifySpend"
        @update="checkBalance">
      </x-confirm-spend-dialog>

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
      showModalConfirm: false,
      disableButtonModal: true,
      noBalanceResponse: false,
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
        this.checkBalance()
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
          this.showModalConfirm = false
          this.$emit('reportGenerated')
        })
        .catch((err) => {
          if (err.code === 'suite-fail/evaluation/spend-fail') {
            this.noBalanceResponse = true
            this.disableButtonModal = true
            this.$store.dispatch('alert/error', this.$t('errors.no_balance'))
          } else {
            this.$store.dispatch('alert/error', this.$t(`errors.${err.code}`))
          }
        })
        .finally(() => {
          this.loadingBtn = false
          this.$store.dispatch('loading/hide')
        })
    },
    checkBalance () {
      this.$store.dispatch('loading/show')
      this.loadingBtn = true
      return evaluationsService.checkBalance('organizational')
        .then((res) => {
          this.balance = res.balance
          this.price = res.productService
          this.showModalConfirm = true
        })
        .finally(() => {
          this.$store.dispatch('loading/hide')
        })
    },
    verifySpend ($event) {
      if ($event === 1) {
        this.runGenerateReport()
      } else {
        this.loadingBtn = false
      }
      this.showModalConfirm = false
    }
  }
})
</script>
