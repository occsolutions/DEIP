
<template>
  <v-container fluid v-if="dataFetched">
    <v-row row wrap>
      <v-col cols="12">
        <h4 class="display-1 left break-name">{{ evaluation.name }}</h4>
        <v-chip disabled
          v-if="evaluation.displayName"
          color="primary"
          class="white--text break-name"
          :class="{ 'right': $vuetify.breakpoint.lg }"
        >
          {{ evaluation.displayName }}
        </v-chip>
      </v-col>

      <!-- Additional Questions -->
      <v-col cols="12" class="mb-1" v-if="computedShowAdditionalsBtn">
        <x-open-pie
          :poll-name="evaluation.displayName || evaluation.name"
          :questions="evaluation.additionalQuestions"
        ></x-open-pie>
      </v-col>

      <v-col cols="12">
        <v-card>
          <!-- Report Type Selector -->
          <v-row no-gutters>
            <v-col cols="12" class="py-3 px-4">
              <v-select
                v-model="reportType"
                :items="reportTypes"
                item-value="value"
                item-text="name"
                :label="$t('Views.Evaluations.report.select_report_type')"
                :menu-props="{ offsetY: true }"
                :disabled="disableNoAnswers"
              />
            </v-col>
          </v-row>

          <!-- General -->
          <v-card-text v-if="reportType === 'organizational'">
            <h5 class="headline mb-2">{{ $t('Views.Evaluations.report.general_title') }}</h5>

            <p>{{ $t('Views.Evaluations.report.general_desc') }}</p>
            <x-generate-organizational-report
              :poll-id="$route.params.id"
              :disable-button="disableNoAnswers"
              :already-generated="computedAlreadyGeneratedOrg"
              @reportGenerated="refreshThreads"
            ></x-generate-organizational-report>
          </v-card-text>

          <!-- Demographic -->
          <v-card-text v-if="reportType === 'by_demographic'">
            <h5 class="headline mb-2">{{ $t('Views.Evaluations.report.demographic_title') }}</h5>

            <p>{{ $t('Views.Evaluations.report.demographic_desc') }}</p>
            <x-generate-demographic-report
              :key="demographicItemsFetched"
              :demographics-fetched="demographicItemsFetched"
              :poll-id="$route.params.id"
              :demographic-items="demographicItems"
              :additional-segmentation="evaluation.additionalSegmentation"
              :disable-button="disableNoAnswers"
              :lang="user.lang"
              @reportGenerated="demographicReportGenerated"
            ></x-generate-demographic-report>
          </v-card-text>

          <v-divider></v-divider>

          <v-card-text v-if="reportThreads.length" class="pa-0">
            <v-row class="mt-1 pr-8">
              <v-col cols="12" sm="8" class="pl-7">
                <h5 class="headline">{{ $t('Views.Evaluations.report.generated_reports') }}</h5>
              </v-col>
              <!-- Refresh Page Button -->
              <v-col cols="12" sm="4" class="pr-8 text-right">
                <template v-if="showUpdateProgressBtn">
                  <span
                    class="caption d-inline-block mt-2 grey--text text--darken-1 cursor-pointer"
                    @click="refreshThreads"
                  >
                    {{ $t('Views.Evaluations.report.input_update_progress') }}
                  </span>
                  <v-btn fab dark x-small
                    absolute
                    right
                    color="primary"
                    class="refresh-fab mr-n1"
                    :loading="loadingRefresh"
                    @click="refreshThreads"
                  >
                    <v-icon>mdi-reload</v-icon>
                  </v-btn>
                </template>
              </v-col>
              <v-col cols="12" class="pt-0 pl-8">
                <p class="mb-0 text-justify"
                  v-html="$t('Views.Evaluations.report.generated_reports_desc')"
                ></p>
              </v-col>
            </v-row>
            <!-- Report Requests -->
            <v-row>
              <v-col cols="12" class="my-0 pt-4 py-0">
                <x-report-threads
                  :key="demographicItemsFetched"
                  :threads="reportThreads"
                  :demographics="demographicItems"
                  :evaluation="evaluation"
                ></x-report-threads>
              </v-col>
            </v-row>
          </v-card-text>

          <!-- Action Buttons -->
          <v-card-actions>
            <v-row row wrap>
              <v-btn large
                class="ml-5 my-3"
                to="/evaluations"
              >
                {{ $t('Views.Evaluations.report.input_back') }}
              </v-btn>
            </v-row>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- No anwers modal -->
    <v-dialog persistent
      v-model="showModal"
      width="444px"
    >
      <v-card>
        <v-card-text class="pt-12 pb-9 px-10 text-center">
          <h5>{{ $t('Views.Evaluations.report.no_answers_modal_msg') }}</h5>
        </v-card-text>
        <v-card-actions>
          <v-btn large block
            color="#3898d9"
            class="white--text"
            to="/evaluations"
          >
            {{ $t('Views.Evaluations.report.input_accept') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>

import { mapState } from 'vuex'

import evaluationsService from '../../services/evaluations'
import demographicItemsService from '../../services/demographic-items'

import XGenerateOrganizationalReport from '../reports/organizational/generate_report'
import XGenerateDemographicReport from '../reports/demographic/generate_report'
import XReportThreads from '../reports/report-threads'
import XOpenPie from '../reports/open-pie'

export default {
  components: {
    XGenerateOrganizationalReport,
    XGenerateDemographicReport,
    XReportThreads,
    XOpenPie
  },
  data () {
    return {
      dataFetched: false,
      reportType: 'organizational',
      reportTypes: [
        { name: this.$t('Views.Evaluations.report.general_title'), value: 'organizational' },
        { name: this.$t('Views.Evaluations.report.demographic_title'), value: 'by_demographic' }
      ],
      disableNoAnswers: false,
      evaluation: {},
      loadingDemographics: false,
      demographicItemsFetched: false,
      demographicItems: {},
      cutsSelected: {},
      showModal: false,
      reportThreads: [],
      loading: false,
      loadingRefresh: false
    }
  },
  watch: {
    reportType (val) {
      if (val === 'by_demographic' && !this.demographicItemsFetched) {
        this.getDemographicItems()
      }
    },
    reportThreads: {
      handler (val) {
        if (val.length) {
          const found = val.find((t) => t.data.type === 'by_demographic')
          if (found) {
            this.getDemographicItems()
          }
        }
      }
    },
    loading (val) {
      val
        ? this.$store.dispatch('loading/show')
        : this.$store.dispatch('loading/hide')
    },
    loadingRefresh (val) {
      this.loading = val
    }
  },
  computed: {
    ...mapState({
      user: (state) => state.session.user
    }),
    computedShowAdditionalsBtn () {
      return this.evaluation.additionalQuestions[0].question !== ''
    },
    showUpdateProgressBtn () {
      let shouldShow = false
      if (this.reportThreads.length) {
        const inProgress = this.reportThreads.find(t => t.data.progress !== 100)
        if (inProgress) {
          shouldShow = true
        }
      }
      return shouldShow
    },
    computedAlreadyGeneratedOrg () {
      let isGenerated = false
      if (this.reportThreads.length) {
        const org = this.reportThreads.find((t) => {
          return t.data.type === 'organizational'
        })
        if (org) {
          isGenerated = true
        }
      }
      return isGenerated
    }
  },
  methods: {
    getInitialData () {
      this.loading = true
      evaluationsService.getOneById(this.$route.params.id)
        .then((res) => {
          this.evaluation = res
          this.dataFetched = true
          if (res.populationCompletedCount > 0) {
            this.getThreads()
          } else {
            this.disableNoAnswers = true
            this.showModal = true
          }
        })
        .catch((err) => {
          this.$store.dispatch('alert/error', this.$t(err.code))
        })
        .finally(() => {
          this.loading = false
        })
    },
    getThreads () {
      this.loadingRefresh = true
      evaluationsService.currentThreadsById(this.$route.params.id)
        .then((res) => {
          this.reportThreads = res
        })
        .catch((err) => {
          this.$store.dispatch('alert/error', this.$t(err.code))
        })
        .finally(() => {
          this.loadingRefresh = false
        })
    },
    getDemographicItems () {
      this.loadingDemographics = true
      demographicItemsService.list()
        .then((res) => {
          if (res.items) {
            res.items.forEach(item => {
              this.demographicItems[item.code] = {
                id: item.id,
                optional: item.optional,
                label: item.translate.label
              }
            })
            this.demographicItemsFetched = true
          }
        })
        .catch((err) => {
          console.log(err)
          this.$store.dispatch('alert/error', this.$t(err.code))
        })
        .then(() => {
          this.loadingDemographics = false
        })
    },
    demographicReportGenerated () {
      this.reportType = 'organizational'
      this.refreshThreads()
    },
    refreshThreads () {
      this.loadingRefresh = true
      this.getThreads()
    }
  },
  created () {
    this.getInitialData()
  }
}
</script>

<style>
  .refresh-fab.v-btn--fab.v-btn--absolute {
    z-index: 3;
  }
  .showRepBtn {
    padding: 10px 32px !important;
    min-height: 44px !important;
    height: unset !important;
  }
  .showRepBtn div.v-btn__content {
    flex: 1 1 auto;
    white-space: unset;
  }
  .break-name {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    max-width: 100%;
  }
  .cursor-pointer {
    cursor: pointer;
  }
</style>
