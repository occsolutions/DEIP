
<template>
  <v-row>
    <!------------------------------------------------------------------------>
    <!--------------------- Segmentation Selection Table --------------------->
    <!------------------------------------------------------------------------>
    <v-col cols="12" v-if="tableItems.length" class="pt-0 px-4">
      <p class="mb-0 body-2 text-right font-weight-bold">
        {{ $t('Views.Evaluations.report.demographic.selected') }}:
        {{ selectedFiltersCount }}
      </p>
      <v-simple-table dense class="filters-table">
        <template v-slot:default>
          <tbody>
            <tr v-for="(item, i) in tableItems" :key="`s-${i}-${item.id}`">
              <th v-if="item.type === 'header'" class="pt-2 pr-0 pl-3 grey--text text--darken-2">
                {{ item.label }}
              </th>
              <td v-else class="pr-0 pl-3">
                <v-checkbox dense hide-details
                  v-model="item.selected"
                  :ripple="false"
                  :label="item.label"
                  :disabled="(optionalAnswerCount[item.code] && optionalAnswerCount[item.code] === 0) || (selectedFiltersCount > 0 && !item.selected)"
                  color="primary"
                  class="mt-1 mb-2 small-label"
                  style="max-width: fit-content;"
                ></v-checkbox>
              </td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
      <p class="mb-0 ml-1 caption primary--text font-weight-bold">
        {{ $t('Views.Evaluations.report.demographic.table_legend') }}
      </p>
    </v-col>

    <!------------------------------------------------------------------------>
    <!---------------------------- Action Buttons ---------------------------->
    <!------------------------------------------------------------------------>
    <v-col cols="12" class="py-5 text-center">
      <v-btn large
        :loading="loadingBtn"
        :disabled="disableButton || !selectedFiltersCount"
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

export default Vue.extend({
  name: 'generate-demographic-report',
  components: {
    //
  },
  props: {
    pollId: String,
    demographicsFetched: Boolean,
    demographicItems: Object,
    additionalSegmentation: Object,
    disableButton: Boolean,
    lang: String
  },
  data () {
    return {
      timeout: null,
      loadingBtn: false,
      showModalConfirm: false,
      disableButtonModal: true,
      noBalanceResponse: false,
      tableItems: [],
      balance: 0,
      price: 0,
      dictionary: {
        age: 'birthdate',
        gender: 'genderId',
        antiquity: 'admission',
        departments: 'departmentId',
        charge: 'chargeId',
        jobTypes: 'jobTypeId',
        country: 'countryId',
        headquarter: 'headquarterId',
        academicDegree: 'academicDegreeId',
        optionalDemo1: 'additionalDemographic1Id',
        optionalDemo2: 'additionalDemographic2Id'
      },
      optionalAnswerCount: {}
    }
  },
  watch: {
    disableButton (val) {
      this.disableButtonModal = val
    },
    demographicItems: {
      handler (val) {
        const keys = Object.keys(val)
        const demographics = [{
          id: 0,
          type: 'header',
          label: this.$t('Views.Evaluations.report.demographic.demographic_cuts')
        }]
        for (const key of keys) {
          demographics.push({
            id: val[key].id,
            type: 'demographic',
            code: key,
            field: this.dictionary[key],
            selected: false,
            is_optional: val[key].optional,
            label: val[key].label
          })
        }
        demographics.sort((a, b) => a.id - b.id)
        this.tableItems = [...this.tableItems, ...demographics]
      },
      immediate: true,
      deep: true
    },
    additionalSegmentation: {
      handler (val) {
        const keys = Object.keys(val)
        const segmentations = [{
          id: 0,
          type: 'header',
          label: this.$t('Views.Evaluations.report.demographic.additional_segmentation')
        }]
        let segCnt = 0
        for (const key of keys) {
          if (val[key].selected) {
            segmentations.push({
              id: val[key].id,
              type: 'segmentation',
              code: key,
              selected: false,
              is_optional: true,
              label: val[key].trans[this.lang].label
            })
            segCnt++
          }
        }

        if (segCnt) {
          segmentations.sort((a, b) => a.id - b.id)
          this.tableItems = [...this.tableItems, ...segmentations]
        }
      },
      immediate: true,
      deep: true
    },
    demographicsFetched: {
      handler (val) {
        if (val) {
          setTimeout(() => {
            this.optionalDemographics = this.tableItems.filter(x => {
              return x.is_optional && x.type === 'demographic'
            })
            if (this.optionalDemographics.length > 0) {
              this.countOptionalAnswers('demographic', this.optionalDemographics)
            }

            this.optionalSegmentation = this.tableItems.filter(x => {
              return x.is_optional && x.type === 'segmentation'
            })
            if (this.optionalSegmentation.length > 0) {
              this.countOptionalAnswers('segmentation', this.optionalSegmentation)
            }
          }, 140)
        }
      },
      immediate: true
    }
  },
  computed: {
    selectedFiltersCount () {
      const selected = this.tableItems.filter(x => x.selected === true)
      return selected.length
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
      const selectedTableItems = this.tableItems.filter(item => item.selected === true).map(x => {
        return {
          id: x.id,
          type: x.type,
          code: x.code,
          field: x.field
        }
      })
      this.$store.dispatch('loading/show')
      return evaluationsService.generateReportDemographic(this.pollId, selectedTableItems)
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
    countOptionalAnswers (type, data) {
      evaluationsService.countAnswersByOptionalCuts(this.pollId, type, data)
        .then((res) => {
          this.optionalAnswerCount = {
            ...this.optionalAnswerCount,
            ...res
          }
        })
        .catch((err) => {
          this.$store.dispatch('alert/error', this.$t(`errors.${err.code}`))
        })
        .finally(() => {
          this.$store.dispatch('loading/hide')
        })
    }
  }
})
</script>
