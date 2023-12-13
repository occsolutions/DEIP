
<template>
  <v-row>
    <!------------------------------------------------------------------------>
    <!------------------------ Demographics Selectors ------------------------>
    <!------------------------------------------------------------------------>
    <v-col cols="12" class="pt-0 px-4">
      <x-filter-demographic-items
        :additional-segmentation="additionalSegmentation"
        :cuts-selected="cutsSelected"
        :poll-id="$route.params.id"
        @receivers-modified="handleReceiversModified($event)"
        @demographics-filtered="setDemographicsFiltered($event)"
        @answers-fetched="handleReportButton($event)"
        @demographics-selects="demographicsSelects = $event"
        @loading="loadingFilters = $event"
      ></x-filter-demographic-items>
    </v-col>

    <!------------------------------------------------------------------------>
    <!---------------------------- Action Buttons ---------------------------->
    <!------------------------------------------------------------------------>
    <v-col cols="12" class="py-5 text-center">
      <v-btn large
        :loading="loadingBtn"
        :disabled="disableButton || disableGenerateButton"
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
        :disableButtonModal="disableButtonModal || balance > price"
        @result="verifySpend"
        @update="checkBalance">
      </x-confirm-spend-dialog>

      <v-dialog v-model="showModal" width="400px">
        <v-card>
          <v-card-text class="pt-9 pb-6 text-center">
            <h6>{{ $t('Views.Evaluations.report.no_answers_modal_msg') }}</h6>
          </v-card-text>
          <v-card-actions class="pa-2">
            <v-btn large block
              color="#3898d9"
              class="white--text"
              @click="showModal = !showModal"
            >
              {{ $t('Views.Evaluations.report.input_accept') }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-col>
  </v-row>
</template>

<style scoped>
  ::v-deep .small-label .v-label {
    font-size: 14px !important;
    color: #222222;
  }
  .filters-table {
    border-radius: 4px 0 0 4px;
    border: 1px solid #CCCCCC;
  }
  .filters-table tbody tr:hover {
    cursor: default;
    background-color: transparent !important;
  }
  ::v-deep .filters-table th {
    background-color: #DDDDDD;
  }
  ::v-deep .filters-table td {
    vertical-align: middle;
  }
  ::v-deep .filters-table .bordered-header {
    border-radius: 4px 0 0 0;
  }
  ::v-deep .filters-table .no-border {
    border-bottom: none !important;
  }
  ::v-deep .filters-table .spaced-cell {
    padding-top: 5px;
    padding-bottom: 4px;
  }
</style>

<script>
import Vue from 'vue'

import evaluationsService from '../../../services/evaluations'
import XFilterDemographicItems from '../components/filter-demographic-items.vue'

export default Vue.extend({
  name: 'generate-demographic-report',
  components: {
    XFilterDemographicItems
  },
  props: {
    pollId: String,
    additionalSegmentation: Object,
    disableButton: Boolean,
    lang: String
  },
  data () {
    return {
      cutsSelected: {},
      demographicsSelects: {},
      loadingFilters: false,
      showModal: false,
      loadingBtn: false,
      showModalConfirm: false,
      disableButtonModal: true,
      disableGenerateButton: true,
      noBalanceResponse: false,
      balance: 0,
      price: 0
    }
  },
  watch: {
    disableButton (val) {
      this.disableButtonModal = val
    }
  },
  computed: {
    //
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
      return evaluationsService.generateReportDemographic(this.pollId, this.cutsSelected.listOfDemographics)
        .then(() => {
          this.$store.dispatch(
            'alert/success',
            this.$t('Views.Evaluations.report.demographic.operation_init')
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
      if (!this.balance && !this.price) {
        this.$store.dispatch('loading/show')
        this.loadingBtn = true
        return evaluationsService.checkBalance('by_population')
          .then((res) => {
            this.balance = res.balance
            this.price = res.productService
            this.showModalConfirm = true
          })
          .finally(() => {
            this.$store.dispatch('loading/hide')
          })
      } else {
        this.showModalConfirm = true
      }
    },
    verifySpend ($event) {
      if ($event === 1) {
        this.runGenerateReport()
      } else {
        this.loadingBtn = false
      }
      this.showModalConfirm = false
    },
    handleReceiversModified (e) {
      this.disableGenerateButton = !e
    },
    setDemographicsFiltered (e) {
      this.demographicsFiltered = e
    },
    handleReportButton (e) {
      this.disableGenerateButton = !e
      this.showModal = e
    }
  }
})
</script>
