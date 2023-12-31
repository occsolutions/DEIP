
import additionalDemographics1Service from '../../../services/additional-demographics1'
import additionalDemographics2Service from '../../../services/additional-demographics2'
import countriesService from '../../../services/countries'
import headquartersService from '../../../services/headquarters'
import academicDegreesService from '../../../services/academic-degrees'
import gendersService from '../../../services/genders'
import jobTypesService from '../../../services/job-types'
import departmentsService from '../../../services/departments'
import chargesService from '../../../services/charges'
import evaluationsService from '../../../services/evaluations'
import formatItemsGeneral from '../../../utils/form-format-items-list'

import resolver from '../../../utils/resolver'

import XFilterAdditionalSegmentation from './filter-additional-segmentation'

const formatRes = items => {
  return items.map((item) => {
    return {
      value: item.id,
      text: item.name,
      refId: item.countryId
    }
  })
}

const formatEnterprisesValue = items => {
  return items.map((item) => {
    return {
      value: item.id,
      text: item.translate.label
    }
  })
}

export default {
  components: {
    XFilterAdditionalSegmentation
  },
  data () {
    return {
      totalDemographicFiltered: [],
      demographicFilter: {},
      segmentationKeys: [],
      genders: [],
      min: 0,
      max: 100,
      countries: [],
      headquarters: [],
      raw_headquarters: [],
      jobTypes: [],
      departments: [],
      charges: [],
      academicDegrees: [],
      additionalDemographics1: [],
      additionalDemographics2: [],
      demographicsIds: [],
      answers: [],
      totalReceivers: 0
    }
  },
  props: {
    additionalSegmentation: Object,
    cutsSelected: Object,
    pollId: String
  },
  computed: {
    headquarterDisabled () {
      return !this.cutsSelected.countrySelect || !this.cutsSelected.countrySelect.length
    },
    computedHeadquarterHint () {
      return this.headquarterDisabled ? this.$t('Views.Evaluations.stepEvaluatedSelection.select_country_first') : ''
    },
    getSelectAge () {
      return [
        {
          value: [0, 25],
          text: this.$t('Views.Evaluations.stepEvaluatedSelection.ranges.age_low', { n: 25 })
        },
        {
          value: [25, 35],
          text: this.$t('Views.Evaluations.stepEvaluatedSelection.ranges.age_range', { n: 25, p: 35 })
        },
        {
          value: [35, 45],
          text: this.$t('Views.Evaluations.stepEvaluatedSelection.ranges.age_range', { n: 35, p: 45 })
        },
        {
          value: [45, 50],
          text: this.$t('Views.Evaluations.stepEvaluatedSelection.ranges.age_range', { n: 45, p: 50 })
        },
        {
          value: [50, 200],
          text: this.$t('Views.Evaluations.stepEvaluatedSelection.ranges.age_upper', { n: 50 })
        }
      ]
    },
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
    setTotalReceivers () {
      this.totalReceivers = this.totalDemographicFiltered.length
      this.cutsSelected.totalReceivers = this.totalDemographicFiltered.length
      this.$set(this.cutsSelected, 'demographics', this.totalDemographicFiltered)
      this.$emit('receivers-modified', Object.keys(this.cutsSelected.listOfDemographics).length > 0)
    },
    calculatePopulation () {
      this.setTotalReceivers()
    },
    calculateTotal (event, key) {
      this.demographicFilter[key] = event
      if (!event || event.length === 0) {
        delete this.demographicFilter[key]
      }

      this.cutsSelected.listOfDemographics = this.demographicFilter

      if (this.demographicFilter.headquarters && !this.demographicFilter.countries) {
        delete this.demographicFilter.headquarters
        this.cutsSelected.headquarterSelect = []
      }
      this.updateTotalDemographicFiltered()
    },
    updateTotalDemographicFiltered () {
      this.totalDemographicFiltered = []
      this.totalDemographicFiltered = this.cutsSelected.totalPopulation.filter(demographic => {
        let flag = false
        for (const key in this.demographicFilter) {
          if (key === 'departments') {
            flag = this.demographicFilter[key].includes(demographic.departmentId)
          } else if (key === 'jobTypes') {
            flag = this.demographicFilter[key].includes(demographic.jobTypeId)
          } else if (key === 'genders') {
            flag = this.demographicFilter[key] === demographic.genderId
          } else if (key === 'countries') {
            flag = this.demographicFilter[key].includes(demographic.countryId)
          } else if (key === 'headquarters') {
            flag = this.demographicFilter[key].includes(demographic.headquarterId)
          } else if (key === 'charges') {
            flag = this.demographicFilter[key].includes(demographic.chargeId)
          } else if (key === 'academicDegrees') {
            flag = this.demographicFilter[key].includes(demographic.academicDegreeId)
          } else if (key === 'additionalDemographics1') {
            flag = this.demographicFilter[key].includes(demographic.additionalDemographic1Id)
          } else if (key === 'additionalDemographics2') {
            flag = this.demographicFilter[key].includes(demographic.additionalDemographic2Id)
          } else if (key === 'age') {
            flag = demographic.age >= this.demographicFilter[key][0] && demographic.age < this.demographicFilter[key][1]
          } else if (key === 'antiquity') {
            flag = demographic.antiquity >= this.demographicFilter[key][0] && demographic.antiquity < this.demographicFilter[key][1]
          }

          if (!flag) {
            break
          }
        }

        this.segmentationKeys.forEach(key => {
          if (this.demographicFilter[key]) {
            flag = this.demographicFilter[key].includes(demographic[key])
          }
        })

        this.$emit('demographics-filtered', this.demographicFilter)
        this.$emit('demographics-selects', {
          additionalDemographics1: this.additionalDemographics1,
          additionalDemographics2: this.additionalDemographics2,
          departments: this.departments,
          charges: this.charges,
          academicDegrees: this.academicDegrees,
          jobTypes: this.jobTypes,
          genders: this.genders,
          getSelectAntiquity: this.getSelectAntiquity,
          getSelectAge: this.getSelectAge,
          countries: this.countries,
          headquarters: this.headquarters,
          raw_headquarters: this.raw_headquarters
        })

        return flag
      })

      this.calculatePopulation()
    },
    getHeadquarters (id) {
      headquartersService.list(id).then((res) => {
        this.headquarters = this.headquarters.concat(formatRes(res.items))
        this.headquarters = this.headquarters.filter(item => this.cutsSelected.countrySelect.includes(item.refId))
      }).catch(this.headquarters = [])
    },
    calculatedAge (date) {
      const today = new Date()
      const bd = new Date(date)
      let age = today.getFullYear() - bd.getFullYear()
      const m = today.getMonth() - bd.getMonth()
      if (m < 0 || (m === 0 && today.getDate() < bd.getDate())) age--
      return age
    },
    calculateAntiquity (date) {
      const diff = new Date().getTime() - new Date(date).getTime()
      return diff / (1000 * 60 * 60 * 24 * 365.25)
    },
    setSegmentationKey (e) {
      if (!this.segmentationKeys.includes(`segmentation${e}Id`)) {
        this.segmentationKeys.push(`segmentation${e}Id`)
      }
    },
    getOthersTag (n) {
      return this.$t('Views.Evaluations.stepEvaluatedSelection.others', { n })
    }
  },
  created () {
    this.$emit('loading', true)
    resolver
      .all({
        participants: evaluationsService.getParticipantsByPoll(this.pollId),
        genders: gendersService.list(),
        jobTypes: jobTypesService.list(),
        departments: departmentsService.list(),
        charges: chargesService.list(),
        countries: countriesService.listByEnterprise(),
        academicDegrees: academicDegreesService.listFromSuite(),
        rawHeadquarters: headquartersService.fetchByEnterprise(),
        additionalDemographics1: additionalDemographics1Service.list(),
        additionalDemographics2: additionalDemographics2Service.list()
      })
      .then((res) => {
        this.additionalDemographics1 = formatEnterprisesValue(res.additionalDemographics1.items)
        this.additionalDemographics2 = formatEnterprisesValue(res.additionalDemographics2.items)
        this.academicDegrees = formatEnterprisesValue(res.academicDegrees.items)
        this.countries = formatItemsGeneral(res.countries.items)
        this.totalAnswers = res.participants.length

        this.cutsSelected.totalPopulation = res.participants.map(item => {
          item.segmentation.forEach(x => {
            item.demographics[`segmentation${x.segmentationId}Id`] = x.detailId
          })
          item.demographics.age = this.calculatedAge(item.demographics.birthdate)
          item.demographics.antiquity = this.calculateAntiquity(item.demographics.admission)
          return item.demographics
        })

        this.genders = formatEnterprisesValue(res.genders.items)
        this.jobTypes = formatEnterprisesValue(res.jobTypes.items)
        this.departments = formatEnterprisesValue(res.departments.items)
        this.charges = formatEnterprisesValue(res.charges.items)
        this.raw_headquarters = res.rawHeadquarters

        this.$emit('answers-fetched', !this.totalAnswers)
        this.$emit('loading', false)
      })
  }
}
