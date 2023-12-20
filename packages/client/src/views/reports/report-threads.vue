
<template>
  <v-expansion-panels tile>
    <v-expansion-panel
      v-for="(thread, $index) in threads"
      :key="$index"
    >
      <v-expansion-panel-header disable-icon-rotate>
        <span class="expansion-title text-uppercase grey--text text--darken-3">
          <span v-if="thread.data.type === 'organizational'">
            {{ $t('Views.Evaluations.report.general_title') }}
          </span>
          <span v-else-if="thread.data.type === 'by_demographic'">
            {{ $t('Views.Evaluations.report.demographic_title') }}
          </span>
        </span>
        <template v-slot:actions>
          <span
            v-if="thread.data.progress !== 100"
            class="caption d-inline-block mt-1 mr-2 grey--text text--darken-1 font-weight-bold"
          >
            {{ thread.data.progress || 0 }}%
          </span>
          <v-icon color="primary" v-if="thread.status === 'pending'">
            mdi-progress-clock
          </v-icon>
          <v-icon color="primary" v-else-if="thread.status === 'in_progress' || thread.status === 'in_action'">mdi-progress-alert</v-icon>
          <v-icon color="red" v-else-if="thread.status === 'failed'">mdi-alert-circle</v-icon>
          <v-icon color="primary" v-else>mdi-check-circle</v-icon>
        </template>
      </v-expansion-panel-header>
      <v-expansion-panel-content>
        <v-row v-if="thread.data.type === 'by_demographic'">
          <v-col class="text-center">
            <v-chip
              class="my-0 mx-1 px-6 grey--text text--darken-3"
              v-for="(demographic, $i) in getDemographicChip(thread.data.criteria)"
              :key="$i"
            >
              <span class="font-weight-bold body-2">
                {{ demographic ? demographic.toUpperCase() : '' }}
              </span>
            </v-chip>
          </v-col>
        </v-row>

        <v-row v-if="thread.status !== 'completed'">
          <v-col cols="12">
            <v-progress-linear
              color="light-blue"
              height="10"
              :value="thread.data.progress"
              striped
            ></v-progress-linear>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" class="text-center pt-0">
            <!-- ORGANIZATIONAL DOWNLOAD -->
            <x-download-organizational-report
              v-if="thread.data.type === 'organizational'"
              :key="orgKey"
              :poll-id="$route.params.id"
              :thread="thread"
              :evaluation-data="evaluation"
              @pdfRenderedOrg="orgKey++"
            ></x-download-organizational-report>

            <!-- DEMOGRAPHIC DOWNLOAD -->
            <x-download-demographic-report
              v-else
              :key="demoKey"
              :poll-id="$route.params.id"
              :thread="thread"
              :evaluation-data="evaluation"
              :demographic-cuts="demographics"
              :criteria-labels="getDemographicChip(thread.data.criteria)"
              @pdfRenderedDemo="demoKey++"
            ></x-download-demographic-report>
          </v-col>
        </v-row>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<style scoped>
  .expansion-title span {
    font-size: 14px !important;
  }
</style>

<script>

import { mapState } from 'vuex'

import XDownloadOrganizationalReport from './organizational/download-report'
import XDownloadDemographicReport from './demographic/download-report'

export default {
  name: 'report-threads',
  components: {
    XDownloadOrganizationalReport,
    XDownloadDemographicReport
  },
  props: {
    threads: Array,
    evaluation: Object,
    demographics: Object
  },
  data () {
    return {
      orgKey: 1,
      demoKey: 1
    }
  },
  watch: {
    //
  },
  computed: {
    ...mapState({
      user: (state) => state.session.user
    })
  },
  methods: {
    getTranslation (tag) {
      return this.$t(`reports.demographicCuts.${tag}`)
    },
    getDemographicChip (criteria) {
      const demographicKeys = {
        academicDegrees: 'academicDegree',
        additionalDemographics1: 'optionalDemo2',
        additionalDemographics2: 'optionalDemo1',
        age: 'age',
        antiquity: 'antiquity',
        charges: 'charge',
        countries: 'country',
        departments: 'departments',
        genders: 'gender',
        headquarters: 'headquarter',
        jobTypes: 'jobTypes'
      }

      const labels = []
      for (const key of Object.keys(criteria)) {
        // const filter = criteria[key]
        if (Object.keys(demographicKeys).includes(key)) {
          labels.push(this.demographics[demographicKeys[key]]?.label)
        } else {
          // Segmentation
          const segmentationId = parseInt(key.replace(/[^0-9]/g, ''))
          for (const key in this.evaluation.additionalSegmentation) {
            if (this.evaluation.additionalSegmentation[key].id === segmentationId) {
              labels.push(this.evaluation.additionalSegmentation[key].trans[this.user.lang].label)
            }
          }
        }
      }
      return labels
    }
  }
}
</script>
