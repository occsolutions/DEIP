<template>
  <div class="mt-n3 px-3">
    <v-row v-if="loadingDemographics">
      <v-col cols="12" class="pt-6 pb-4 px-0 text-center">
        <v-progress-circular indeterminate
          :width="4"
          :size="54"
          color="primary"
        ></v-progress-circular>
        <p class="caption grey--text text--darken-2">
          {{ $t('Views.Evaluations.stepEvaluatedSelection.please_wait') }}..
        </p>
      </v-col>
    </v-row>

    <v-row v-else align-center justify-center row wrap>

      <!-- Department -->
      <v-col
        cols="12"
        sm="6"
        v-if="(evaluation.demographicItems.department || []).length > 0"
        v-ripple="{ center: true }"
        v-bind:style="'margin-right:auto'"
      >
        <template>
          <x-inputs-autocomplete outlined chips multiple light
            :disabled="isEdit"
            :filled="evaluation.status !== 'pending'"
            v-bind:style="evaluation.status !== 'pending' ? 'cursor: not-allowed;' : ''"
            :readonly="evaluation.status !== 'pending'"
            :items="demographicLists.departments"
            :input="evaluation.departmentIds"
            :label="$t('Views.Evaluations.stepEvaluatedSelection.demographic_cuts.departments')"
            name="departments"
            @updateInput="getDemographicFilteredEmployees($event, 'departmentIds')"
          >
            <template v-slot:selection="{ item, index }">
              <v-chip v-if="index === 0">
                <span>{{ item.text }}</span>
              </v-chip>
              <span
                v-if="index === 1"
                class="grey--text caption"
              >(+{{ evaluation.departmentIds.length - 1 }} otros)</span>
            </template>
          </x-inputs-autocomplete>
        </template>
      </v-col>

      <!-- Charge -->
      <v-col
        cols="12"
        sm="6"
        v-if="(evaluation.demographicItems.charge || []).length > 0"
        v-ripple="{ center: true }"
        v-bind:style="'margin-right:auto'"
      >
        <template>
          <x-inputs-autocomplete outlined chips multiple light
            :disabled="isEdit"
            :filled="evaluation.status !== 'pending'"
            v-bind:style="evaluation.status !== 'pending' ? 'cursor: not-allowed;' : ''"
            :readonly="evaluation.status !== 'pending'"
            :items="demographicLists.charges"
            :input="evaluation.chargeIds"
            :label="$t('Views.Evaluations.stepEvaluatedSelection.demographic_cuts.charges')"
            name="charges"
            @updateInput="getDemographicFilteredEmployees($event, 'chargeIds')"
          >
            <template v-slot:selection="{ item, index }">
              <v-chip v-if="index === 0">
                <span>{{ item.text }}</span>
              </v-chip>
              <span
                v-if="index === 1"
                class="grey--text caption"
              >(+{{ evaluation.chargeIds.length - 1 }} otros)</span>
            </template>
          </x-inputs-autocomplete>
        </template>
      </v-col>

      <!-- Academic Degree -->
      <v-col
        cols="12"
        sm="6"
        v-if="(evaluation.demographicItems.academicDegrees || []).length > 0"
        v-ripple="{ center: true }"
        v-bind:style="'margin-right:auto'"
      >
        <template>
          <x-inputs-autocomplete outlined chips multiple light
            :disabled="isEdit"
            :filled="evaluation.status !== 'pending'"
            v-bind:style="evaluation.status !== 'pending' ? 'cursor: not-allowed;' : ''"
            :readonly="evaluation.status !== 'pending'"
            :items="demographicLists.academicDegrees"
            :input="evaluation.academicDegreeIds"
            :label="$t('Views.Evaluations.stepEvaluatedSelection.demographic_cuts.academic_degrees')"
            name="academic_degrees"
            @updateInput="getDemographicFilteredEmployees($event, 'academicDegreeIds')"
          >
            <template v-slot:selection="{ item, index }">
              <v-chip v-if="index === 0">
                <span>{{ item.text }}</span>
              </v-chip>
              <span
                v-if="index === 1"
                class="grey--text caption"
              >(+{{ evaluation.academicDegreeIds.length - 1 }} otros)</span>
            </template>
          </x-inputs-autocomplete>
        </template>
      </v-col>

      <!-- Job Type -->
      <v-col
        cols="12"
        sm="6"
        v-if="(evaluation.demographicItems.jobType || []).length > 0"
        v-ripple="{ center: true }"
        v-bind:style="'margin-right:auto'"
      >
        <template>
          <x-inputs-autocomplete outlined chips multiple light
            :disabled="isEdit"
            :filled="evaluation.status !== 'pending'"
            v-bind:style="evaluation.status !== 'pending' ? 'cursor: not-allowed;' : ''"
            :readonly="evaluation.status !== 'pending'"
            :items="demographicLists.jobTypes"
            :input="evaluation.jobTypeIds"
            :label="$t('Views.Evaluations.stepEvaluatedSelection.demographic_cuts.job_types')"
            name="job_types"
            @updateInput="getDemographicFilteredEmployees($event, 'jobTypeIds')"
          >
            <template v-slot:selection="{ item, index }">
              <v-chip v-if="index === 0">
                <span>{{ item.text }}</span>
              </v-chip>
              <span
                v-if="index === 1"
                class="grey--text caption"
              >(+{{ evaluation.jobTypeIds.length - 1 }} otros)</span>
            </template>
          </x-inputs-autocomplete>
        </template>
      </v-col>

      <!-- Age -->
      <v-col
        cols="12"
        sm="6"
        v-if="(evaluation.demographicItems.age || []).length > 0"
        v-ripple="{ center: true }"
        v-bind:style="'margin-right:auto'"
      >
        <template>
          <x-inputs-autocomplete outlined chips light clearable
            :disabled="isEdit"
            :filled="evaluation.status !== 'pending'"
            v-bind:style="evaluation.status !== 'pending' ? 'cursor: not-allowed;' : ''"
            :readonly="evaluation.status !== 'pending'"
            :items="demographicLists.getSelectAge"
            :input="evaluation.rangeAge"
            :label="$t('Views.Evaluations.stepEvaluatedSelection.demographic_cuts.select_age_range')"
            name="select_age_range"
            @updateInput="getDemographicFilteredEmployees($event, 'rangeAge')"
          ></x-inputs-autocomplete>
        </template>
      </v-col>

      <!-- Antiquity -->
      <v-col
        cols="12"
        sm="6"
        v-ripple="{ center: true }"
        v-if="(evaluation.demographicItems.antiquity || []).length > 0"
        v-bind:style="'margin-right:auto'"
      >
        <template>
          <x-inputs-autocomplete outlined chips light clearable
            :disabled="isEdit"
            :filled="evaluation.status !== 'pending'"
            v-bind:style="evaluation.status !== 'pending' ? 'cursor: not-allowed;' : ''"
            :readonly="evaluation.status !== 'pending'"
            :items="getSelectAntiquity"
            :input="evaluation.rangeAntiquity"
            :label="$t('Views.Evaluations.stepEvaluatedSelection.demographic_cuts.select_antiquity_range')"
            name="select_antiquity_range"
            @updateInput="getDemographicFilteredEmployees($event, 'rangeAntiquity')"
          ></x-inputs-autocomplete>
        </template>
      </v-col>

      <!-- Gender -->
      <v-col
        cols="12"
        sm="6"
        v-if="(evaluation.demographicItems.gender || []).length > 0"
        v-ripple="{ center: true }"
        v-bind:style="'margin-right:auto'"
      >
        <template>
          <x-inputs-autocomplete outlined chips light clearable
            :disabled="isEdit"
            :filled="evaluation.status !== 'pending'"
            v-bind:style="evaluation.status !== 'pending' ? 'cursor: not-allowed;' : ''"
            :readonly="evaluation.status !== 'pending'"
            :items="demographicLists.genders"
            :input="evaluation.genderId"
            :label="$t('Views.Evaluations.stepEvaluatedSelection.demographic_cuts.genders')"
            name="genders"
            @updateInput="getDemographicFilteredEmployees($event, 'genderId')"
          ></x-inputs-autocomplete>
        </template>
      </v-col>

      <v-col cols="12" sm="6"
        v-if="$vuetify.breakpoint.smAndUp"
        v-bind:style="'margin-right:auto'"
      ></v-col>
      <!-- Country -->
      <v-col
        cols="12"
        sm="6"
        v-if="(evaluation.demographicItems.country || []).length > 0"
        v-ripple="{ center: true }"
        v-bind:style="'margin-right:auto'"
      >
        <template>
          <x-inputs-autocomplete outlined chips multiple light
            :disabled="isEdit"
            :filled="evaluation.status !== 'pending'"
            v-bind:style="evaluation.status !== 'pending' ? 'cursor: not-allowed;' : ''"
            :readonly="evaluation.status !== 'pending'"
            :items="demographicLists.countries"
            :input="evaluation.countrySelect"
            :label="$t('Views.Evaluations.stepEvaluatedSelection.demographic_cuts.countries')"
            name="countries"
            @updateInput="getDemographicFilteredEmployees($event, 'countrySelect');"
          >
            <template v-slot:selection="{ item, index }">
              <v-chip v-if="index === 0">
                <span>{{ item.text }}</span>
              </v-chip>
              <span
                v-if="index === 1"
                class="grey--text caption"
              >(+{{ evaluation.countrySelect.length - 1 }} otros)</span>
            </template>
          </x-inputs-autocomplete>
        </template>
      </v-col>

      <!-- Headquarter -->
      <v-col
        cols="12"
        sm="6"
        v-if="(evaluation.demographicItems.headquarter || []).length > 0"
        v-ripple="{ center: true }"
        v-bind:style="'margin-right:auto'"
      >
        <template>
          <x-inputs-autocomplete outlined chips multiple light persistent-hint
            :disabled="isEdit || evaluation.countrySelect.length === 0"
            :filled="evaluation.status !== 'pending'"
            v-bind:style="evaluation.status !== 'pending' ? 'cursor: not-allowed;' : ''"
            :readonly="evaluation.status !== 'pending'"
            :items="headquarters"
            :input="evaluation.headquarterSelect"
            :label="$t('Views.Evaluations.stepEvaluatedSelection.demographic_cuts.headquarter')"
            name="headquarters"
            @updateInput="getDemographicFilteredEmployees($event, 'headquarterSelect');"
          >
            <template v-slot:selection="{ item, index }">
              <v-chip v-if="index === 0">
                <span>{{ item.text }}</span>
              </v-chip>
              <span
                v-if="index === 1"
                class="grey--text caption"
              >(+{{ evaluation.headquarterSelect.length - 1 }} otros)</span>
            </template>
          </x-inputs-autocomplete>
        </template>
      </v-col>

      <!-- Additional Demographic 1 -->
      <v-col
        cols="12"
        sm="6"
        v-if="(evaluation.demographicItems.optionalDemo1 || []).length > 0"
        v-ripple="{ center: true }"
        v-bind:style="'margin-right:auto'"
      >
        <template>
          <x-inputs-autocomplete outlined chips multiple light
            name="additionalDemographics1"
            :disabled="isEdit"
            :filled="evaluation.status !== 'pending'"
            :readonly="evaluation.status !== 'pending'"
            :items="demographicLists.additionalDemographics1"
            :input="evaluation.additionalDemographic1Ids"
            :label="$t('Views.Evaluations.stepEvaluatedSelection.demographic_cuts.optionalDemo1')"
            v-bind:style="evaluation.status !== 'pending' ? 'cursor: not-allowed;' : ''"
            @updateInput="getDemographicFilteredEmployees($event, 'additionalDemographic1Ids')"
          ></x-inputs-autocomplete>
        </template>
      </v-col>

      <!-- Additional Demographic 2 -->
      <v-col
        cols="12"
        sm="6"
        v-if="(evaluation.demographicItems.optionalDemo2 || []).length > 0"
        v-ripple="{ center: true }"
        v-bind:style="'margin-right:auto'"
      >
        <template>
          <x-inputs-autocomplete outlined chips multiple light
            name="additionalDemographics2"
            :disabled="isEdit"
            :filled="evaluation.status !== 'pending'"
            :readonly="evaluation.status !== 'pending'"
            :items="demographicLists.additionalDemographics2"
            :input="evaluation.additionalDemographic2Ids"
            :label="$t('Views.Evaluations.stepEvaluatedSelection.demographic_cuts.optionalDemo2')"
            v-bind:style="evaluation.status !== 'pending' ? 'cursor: not-allowed;' : ''"
            @updateInput="getDemographicFilteredEmployees($event, 'additionalDemographic2Ids')"
          ></x-inputs-autocomplete>
        </template>
      </v-col>

      <!-- Total -->
      <v-col cols="12" class="pt-0 pb-6 px-8 headline text-right">
        {{ $t('Views.Evaluations.create.total_receptors', {n: `${totalFilteredEmployees}`}) }}
      </v-col>
    </v-row>
  </div>
</template>

<script>

import Vue from 'vue'

import countriesService from '../../../services/countries'
import headquartersService from '../../../services/headquarters'
import academicDegreesService from '../../../services/academic-degrees'

import enterprisesService from '../../../services/enterprises'
import formatItemsGeneral from '../../../utils/form-format-items-list'

import resolver from '../../../utils/resolver'

import employeesServices from '../../../services/employees'

const formatRes = items => {
  return items.map(item => {
    return {
      value: item.id,
      text: item.name,
      refId: item.countryId
    }
  })
}

const formatEnterprisesValue = items => {
  return items.map(item => {
    return {
      value: item.id,
      text: item.translate.label
    }
  })
}

export default Vue.extend({
  props: {
    isEdit: Boolean,
    evaluation: Object,
    demographicLists: Object
  },
  data () {
    return {
      loadingDemographics: false,
      totalFilteredEmployees: 0,
      demographicRefs: {
        genderId: '',
        departmentIds: [],
        academicDegreeIds: [],
        jobTypeIds: [],
        countrySelect: [],
        headquarterSelect: [],
        chargeIds: [],
        rangeAge: [],
        rangeAntiquity: [],
        additionalDemographic1Ids: [],
        additionalDemographic2Ids: []
      },
      headquarters: []
    }
  },
  watch: {
    loadingDemographics (val) {
      this.$emit('loadingDemographics', val)
    }
  },
  computed: {
    getSelectAntiquity () {
      return [
        {
          value: [0, 0.5],
          text: this.$t('Views.Evaluations.stepEvaluatedSelection.ranges.antiquity_low', { n: 6 })
        },
        {
          value: [0.5, 1],
          text: this.$t('Views.Evaluations.stepEvaluatedSelection.ranges.antiquity_range_single', { n: 6, p: 1 })
        },
        {
          value: [1, 3],
          text: this.$t('Views.Evaluations.stepEvaluatedSelection.ranges.antiquity_range_one', { n: 1, p: 3 })
        },
        {
          value: [3, 5],
          text: this.$t('Views.Evaluations.stepEvaluatedSelection.ranges.antiquity_range', { n: 3, p: 5 })
        },
        {
          value: [5, 10],
          text: this.$t('Views.Evaluations.stepEvaluatedSelection.ranges.antiquity_range', { n: 5, p: 10 })
        },
        {
          value: [10, 20],
          text: this.$t('Views.Evaluations.stepEvaluatedSelection.ranges.antiquity_range', { n: 10, p: 20 })
        },
        {
          value: [20, 200],
          text: this.$t('Views.Evaluations.stepEvaluatedSelection.ranges.antiquity_upper', { n: 20 })
        }
      ]
    }
  },
  methods: {
    clearFilters () {
      for (const key of Object.keys(this.demographicRefs)) {
        if (key === 'genderId') {
          this.evaluation[key] = ''
        } else {
          this.evaluation[key] = []
        }
      }
    },
    setTotalReceivers () {
      this.evaluation.populationCount = this.totalFilteredEmployees
      this.evaluation.totalPrice = this.evaluation.price * this.totalFilteredEmployees
    },
    iniGetSelectAge () {
      this.demographicLists.getSelectAge = [
        [0, 25],
        [25, 35],
        [35, 45],
        [45, 50],
        [50, 200]
      ].map(range => {
        const option = { value: range, text: '' }
        if (!range[0] || range[1] > 50) {
          option.text = this.$t(
            `Views.Evaluations.stepEvaluatedSelection.ranges.${!range[0] ? 'age_low' : 'age_upper'}`,
            { n: range[0] || range[1] }
          )
        } else {
          option.text = this.$t('Views.Evaluations.stepEvaluatedSelection.ranges.age_range', {
            n: range[0],
            p: range[1]
          })
        }
        return option
      })
    },
    async getDemographicFilteredEmployees (event, key) {
      this.evaluation[key] = event
      if (key === 'genderId') {
        this.demographicRefs[key] = event || ''
      } else if (key === 'countrySelect') {
        this.demographicRefs[key] = event || []
        await this.getHeadquarters(event)
      } else {
        this.demographicRefs[key] = event || []
      }

      let flag = false
      for (const i in this.demographicRefs) {
        const filter = this.demographicRefs[i]
        if (typeof filter === 'number' && filter !== '') flag = true
        if (typeof filter === 'object' && filter.length) flag = true
        if (flag) break
      }

      if (flag) {
        this.$store.dispatch('loading/show')
        await employeesServices.getDemographicParticipants(this.demographicRefs)
          .then((res) => {
            this.totalFilteredEmployees = res.total
          })
          .finally(() => {
            this.$store.dispatch('loading/hide')
          })
      } else {
        this.totalFilteredEmployees = 0
      }
      this.evaluation.populationCount = this.totalFilteredEmployees
      this.evaluation.totalPrice = this.evaluation.price * this.evaluation.populationCount
    },
    getHeadquarters (country_id) {
      headquartersService.list(country_id)
        .then(res => {
          this.headquarters = this.headquarters.concat(formatRes(res.items))
          this.headquarters = this.headquarters.filter(item =>
            this.evaluation.countrySelect.includes(item.refId)
          )
        })
        .catch((this.headquarters = []))
    },
    checkedDemographic () {
      const listItems = [
        { item: 'departmentIds', name: 'departments' },
        { item: 'chargeIds', name: 'charges' },
        { item: 'academicDegreeIds', name: 'academicDegrees' },
        { item: 'jobTypeIds', name: 'jobTypes' },
        { item: 'genderId', name: 'genders' },
        { item: 'rangeAntiquity', name: 'antiquity' },
        { item: 'rangeAge', name: 'age' },
        { item: 'countrySelect', name: 'countries' },
        { item: 'headquarterSelect', name: 'headquarters' },
        { item: 'additionalDemographic1Ids', name: 'additionalDemographic1' },
        { item: 'additionalDemographic2Ids', name: 'additionalDemographic2' }
      ]
      let k = -1
      while (++k < listItems.length) {
        if (listItems[k].name === 'genders' && this.evaluation.selectionDetails[listItems[k].item]) {
          this.evaluation.genderId = this.evaluation.selectionDetails.genderId
          this.demographicRefs.genders = this.evaluation.genderId
        } else if (this.evaluation.selectionDetails[listItems[k].item] &&
            this.evaluation.selectionDetails[listItems[k].item].length
        ) {
          this.evaluation[listItems[k].item] = this.evaluation.selectionDetails[listItems[k].item]
          this.demographicRefs[listItems[k].name] = this.evaluation[listItems[k].item]
        }
      }
      this.totalFilteredEmployees = this.evaluation.populationCount
    },
    loadDemographicData () {
      this.loadingDemographics = true
      this.iniGetSelectAge()
      resolver
        .all({
          enterprise: enterprisesService.getProfile(),
          countries: countriesService.listByEnterprise(),
          academicDegrees: academicDegreesService.listFromSuite()
        })
        .then(res => {
          this.demographicLists.academicDegrees = formatEnterprisesValue(
            res.academicDegrees.items
          )
          this.demographicLists.countries = formatItemsGeneral(res.countries.items)
          const demoItems = res.enterprise.demographicItems.filter(
            item =>
              item.data === 'master_reference' ||
              item.code === 'age' ||
              item.code === 'antiquity'
          )

          this.evaluation.demographicItems = {
            gender: demoItems.filter(item => item.code === 'gender'),
            age: demoItems.filter(item => item.code === 'age'),
            antiquity: demoItems.filter(item => item.code === 'antiquity'),
            country: demoItems.filter(item => item.code === 'country'),
            headquarter: demoItems.filter(item => item.code === 'headquarter'),
            charge: demoItems.filter(item => item.code === 'charge'),
            department: demoItems.filter(item => item.code === 'departments'),
            jobType: demoItems.filter(item => item.code === 'jobTypes'),
            academicDegrees: demoItems.filter(item => item.code === 'academicDegree'),
            optionalDemo1: demoItems.filter(item => item.code === 'optionalDemo1'),
            optionalDemo2: demoItems.filter(item => item.code === 'optionalDemo2')
          }
          this.demographicLists.genders = formatEnterprisesValue(res.enterprise.genders)
          this.demographicLists.jobTypes = formatEnterprisesValue(res.enterprise.jobTypes)
          this.demographicLists.departments = formatEnterprisesValue(res.enterprise.departments)
          this.demographicLists.charges = formatEnterprisesValue(res.enterprise.charges)
          this.demographicLists.additionalDemographics1 = formatEnterprisesValue(res.enterprise.additionalDemographic1)
          this.demographicLists.additionalDemographics2 = formatEnterprisesValue(res.enterprise.additionalDemographic2)
          if (this.isEdit) {
            this.checkedDemographic()
          } else {
            this.setTotalReceivers()
          }
          this.$emit('demographicDataLoaded', true)
        })
        .finally(() => {
          this.loadingDemographics = false
        })
    }
  }
})
</script>
