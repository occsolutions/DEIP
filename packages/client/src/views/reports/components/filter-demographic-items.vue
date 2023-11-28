
<template>
  <v-form
    lazy-validation
    data-vv-scope="form-2"
  >
    <v-container v-if="displayComponent" class="pt-0">
      <v-container grid-list-md class="pt-0">
        <v-row row wrap
          align="center"
          justify="center"
        >
          <v-col cols="12">
            <p class="mb-0 body-2 text-center">{{ $t('engagementReport.demographic_desc2') }}</p>
          </v-col>

          <!-- Department -->
          <v-col cols="12" sm="6"
            v-ripple="{ center: true }"
            v-bind:style="'margin-right:auto'"
          >
            <template>
              <v-autocomplete
                multiple
                outlined
                :items="departments"
                persistent-hint
                v-model="cutsSelected.departmentIds"
                light
                :label="$t('pulses.departments')"
                name="departments"
                @change="calculateTotal($event, 'departments')"
              >
                <template v-slot:selection="{ item, index }">
                  <v-chip v-if="index === 0">
                    <span>{{ item.text }}</span>
                  </v-chip>
                  <span
                    v-if="index === 1"
                    class="grey--text caption"
                  >({{ getOthersTag(cutsSelected.departmentIds.length - 1) }})</span>
                </template>
              </v-autocomplete>
            </template>
          </v-col>

          <!-- Charge -->
          <v-col cols="12" sm="6"
            v-ripple="{ center: true }"
            v-bind:style="'margin-right:auto'"
          >
            <template>
              <v-autocomplete
                multiple
                outlined
                :items="charges"
                persistent-hint
                v-model="cutsSelected.chargeIds"
                light
                :label="$t('pulses.charges')"
                name="charges"
                @change="calculateTotal($event, 'charges')"
              >
                <template v-slot:selection="{ item, index }">
                  <v-chip v-if="index === 0">
                    <span>{{ item.text }}</span>
                  </v-chip>
                  <span
                    v-if="index === 1"
                    class="grey--text caption"
                  >({{ getOthersTag(cutsSelected.chargeIds.length - 1) }})</span>
                </template>
              </v-autocomplete>
            </template>
          </v-col>

          <!-- Academic Degree -->
          <v-col cols="12" sm="6"
            v-ripple="{ center: true }"
            v-bind:style="'margin-right:auto'"
          >
            <template>
              <v-autocomplete
                multiple
                outlined
                :items="academicDegrees"
                persistent-hint
                v-model="cutsSelected.academicDegreeIds"
                light
                :label="$t('pulses.academic_degrees')"
                name="academic_degrees"
                @change="calculateTotal($event, 'academicDegrees')"
              >
                <template v-slot:selection="{ item, index }">
                  <v-chip v-if="index === 0">
                    <span>{{ item.text }}</span>
                  </v-chip>
                  <span
                    v-if="index === 1"
                    class="grey--text caption"
                  >({{ getOthersTag(cutsSelected.academicDegreeIds.length - 1) }})</span>
                </template>
              </v-autocomplete>
            </template>
          </v-col>

          <!-- Job Type -->
          <v-col cols="12" sm="6"
            v-ripple="{ center: true }"
            v-bind:style="'margin-right:auto'"
          >
            <template>
              <v-autocomplete
                multiple
                outlined
                :items="jobTypes"
                persistent-hint
                v-model="cutsSelected.jobTypeIds"
                light
                :label="$t('pulses.job_types')"
                name="job_types"
                @change="calculateTotal($event, 'jobTypes')"
              >
                <template v-slot:selection="{ item, index }">
                  <v-chip v-if="index === 0">
                    <span>{{ item.text }}</span>
                  </v-chip>
                  <span
                    v-if="index === 1"
                    class="grey--text caption"
                  >({{ getOthersTag(cutsSelected.jobTypeIds.length - 1) }})</span>
                </template>
              </v-autocomplete>
            </template>
          </v-col>

          <!-- Age -->
          <v-col cols="12" sm="6"
            v-ripple="{ center: true }"
            v-bind:style="'margin-right:auto'"
          >
            <template>
              <v-autocomplete
                outlined
                :items="getSelectAge"
                v-model="cutsSelected.rangeAge"
                persistent-hint
                light clearable
                :label="$t('pulses.select_age_range')"
                name="select_age_range"
                @change="calculateTotal($event, 'age')"
              ></v-autocomplete>
            </template>
          </v-col>

          <!-- Antiquity -->
          <v-col cols="12" sm="6"
            v-ripple="{ center: true }"
            v-bind:style="'margin-right:auto'"
          >
            <template>
              <v-autocomplete
                outlined
                :items="getSelectAntiquity"
                v-model="cutsSelected.rangeAntiquity"
                persistent-hint
                light clearable
                :label="$t('pulses.select_antiquity_range')"
                name="select_antiquity_range"
                @change="calculateTotal($event, 'antiquity')"
              ></v-autocomplete>
            </template>
          </v-col>

          <!-- Gender -->
          <v-col cols="12" sm="6"
            v-ripple="{ center: true }"
            v-bind:style="'margin-right:auto'"
          >
            <template>
              <v-autocomplete
                outlined
                :items="genders"
                persistent-hint
                v-model="cutsSelected.genderId"
                light clearable
                :label="$t('pulses.genders')"
                name="genders"
                @change="calculateTotal($event, 'genders')"
              ></v-autocomplete>
            </template>
          </v-col>

          <v-col cols="12" sm="6"
            v-if="$vuetify.breakpoint.smAndUp"
            v-bind:style="'margin-right:auto'"
          ></v-col>
          <!-- Country -->
          <v-col cols="12" sm="6"
            v-ripple="{ center: true }"
            v-bind:style="'margin-right:auto'"
          >
            <template>
              <v-autocomplete
                outlined
                multiple
                :items="countries"
                persistent-hint
                v-model="cutsSelected.countrySelect"
                light
                :label="$t('pulses.countries')"
                name="countries"
                @change="getHeadquarters($event); calculateTotal($event, 'countries');"
              >
                <template v-slot:selection="{ item, index }">
                  <v-chip v-if="index === 0">
                    <span>{{ item.text }}</span>
                  </v-chip>
                  <span
                    v-if="index === 1"
                    class="grey--text caption"
                  >({{ getOthersTag(cutsSelected.countrySelect.length - 1) }})</span>
                </template>
              </v-autocomplete>
            </template>
          </v-col>

          <!-- Headquarter -->
          <v-col cols="12" sm="6"
            v-ripple="{ center: true }"
            v-bind:style="'margin-right:auto'"
          >
            <template>
              <v-autocomplete
                outlined
                multiple
                :items="headquarters"
                persistent-hint
                v-model="cutsSelected.headquarterSelect"
                light
                :label="$t('input.headquarter')"
                name="headquarters"
                :disabled="headquarterDisabled"
                :hint="computedHeadquarterHint"
                @change="calculateTotal($event, 'headquarters');"
              >
                <template v-slot:selection="{ item, index }">
                  <v-chip v-if="index === 0">
                    <span>{{ item.text }}</span>
                  </v-chip>
                  <span
                    v-if="index === 1"
                    class="grey--text caption"
                  >({{ getOthersTag(cutsSelected.headquarterSelect.length - 1) }})</span>
                </template>
                <!-- Hint message -->
                <template v-slot:message>
                  <small class="d-inline-block ml-n2 mb-1">{{ computedHeadquarterHint }}</small>
                </template>
              </v-autocomplete>
            </template>
          </v-col>

          <!-- Additional Demographic 1 -->
          <v-col cols="12" sm="6"
            v-ripple="{ center: true }"
            v-bind:style="'margin-right:auto'"
          >
            <template>
              <v-autocomplete
                multiple
                outlined
                :items="additionalDemographics1"
                persistent-hint
                v-model="cutsSelected.additionalDemographics1Ids"
                light
                :label="$t('input.optionalDemo1')"
                name="additional_demographics_1"
                @change="calculateTotal($event, 'additionalDemographics1')"
              >
                <template v-slot:selection="{ item, index }">
                  <v-chip v-if="index === 0">
                    <span>{{ item.text }}</span>
                  </v-chip>
                  <span
                    v-if="index === 1"
                    class="grey--text caption"
                  >({{ getOthersTag(cutsSelected.additionalDemographics1Ids.length - 1) }})</span>
                </template>
              </v-autocomplete>
            </template>
          </v-col>

          <!-- Additional Demographic 2 -->
          <v-col cols="12" sm="6"
            v-ripple="{ center: true }"
            v-bind:style="'margin-right:auto'"
          >
            <template>
              <v-autocomplete
                multiple
                outlined
                :items="additionalDemographics2"
                persistent-hint
                v-model="cutsSelected.additionalDemographics2Ids"
                light
                :label="$t('input.optionalDemo2')"
                name="additional_demographics_2"
                @change="calculateTotal($event, 'additionalDemographics2')"
              >
                <template v-slot:selection="{ item, index }">
                  <v-chip v-if="index === 0">
                    <span>{{ item.text }}</span>
                  </v-chip>
                  <span
                    v-if="index === 1"
                    class="grey--text caption"
                  >({{ getOthersTag(cutsSelected.additionalDemographics2Ids.length - 1) }})</span>
                </template>
              </v-autocomplete>
            </template>
          </v-col>
          <!------------------------------>
        </v-row>
      </v-container>

      <v-row row wrap>
        <v-col :key="totalReceivers" xs6 sm="6" class="pa-3 headline">
          {{ $t('engagementReport.population') }}: {{ totalReceivers }} {{ $t('engagementReport.people') }}
          <v-spacer></v-spacer>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script>
import additionalDemographics1Service from '../../../services/additional-demographics1';
import additionalDemographics2Service from '../../../services/additional-demographics2';
import countriesService from '../../../services/countries';
import headquartersService from '../../../services/headquarters';
import academicDegreesService from '../../../services/academic-degrees';
import gendersService from '../../../services/genders';
import jobTypesService from '../../../services/job-types';
import departmentsService from '../../../services/departments';
import chargesService from '../../../services/charges';
import questionnairesService from '../../../services/questionnaires';
import enterprisesService from '../../../services/enterprises';
import engagementsService from '../../../services/engagements';
import formatItemsGeneral from '../../../utils/form-format-items-list';

import resolver from '../../../utils/resolver';

const formatItems = items => {
  return items.map((item) => {
    return {
      value: item.id,
      text: item.name,
      detail: item.questionnaireDetail,
    };
  });
};

const formatRes = items => {
  return items.map((item) => {
    return {
      value: item.id,
      text: item.name,
      refId: item.countryId
    };
  });
};

const formatEnterprisesValue = items => {
  return items.map((item) => {
    return {
      value: item.id,
      text: item.translate.label,
    };
  });
};

export default {
  data () {
    return {
      totalDemographicFiltered: [],
      demographicFilter: {},
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
      displayComponent: false,
      demographicsIds: [],
      answers: [],
      totalReceivers: 0
    }
  },
  props: {
    cutsSelected: Object,
    pollId: Number,
  },
  computed: {
    headquarterDisabled () {
      return !this.cutsSelected.countrySelect || !this.cutsSelected.countrySelect.length
    },
    computedHeadquarterHint () {
      return this.headquarterDisabled ? this.$t('engagementReport.select_country_first') : ''
    },
    getSelectAge() {
      return [
        {
          value: [0, 25],
          text: this.$t('pulses.age_low', { n: 25 }),
        },
        {
          value: [25, 35],
          text: this.$t('pulses.age_range', { n: 25, p: 35 }),
        },
        {
          value: [35, 45],
          text: this.$t('pulses.age_range', { n: 35, p: 45 }),
        },
        {
          value: [45, 50],
          text: this.$t('pulses.age_range', { n: 45, p: 50 }),
        },
        {
          value: [50, 200],
          text: this.$t('pulses.age_upper', { n: 50 }),
        },
      ]
    },
    getSelectAntiquity() {
      return [
        {
          value: [0, 0.5],
          text: this.$t('pulses.antiquity_low', { n: 6 }),
        },
        {
          value: [0.5, 1],
          text: this.$t('pulses.antiquity_range_single', { n: 6, p: 1 }),
        },
        {
          value: [1, 3],
          text: this.$t('pulses.antiquity_range_one', { n: 1, p: 3 }),
        },
        {
          value: [3, 5],
          text: this.$t('pulses.antiquity_range', { n: 3, p: 5 }),
        },
        {
          value: [5, 10],
          text: this.$t('pulses.antiquity_range', { n: 5, p: 10 }),
        },
        {
          value: [10, 20],
          text: this.$t('pulses.antiquity_range', { n: 10, p: 20 }),
        },
        {
          value: [20, 200],
          text: this.$t('pulses.antiquity_upper', { n: 20 }),
        }
      ]
    },
  },
  methods: {
    setTotalReceivers(demographics) {
      this.$emit('loading', true)
      engagementsService.getTotalReceivers({pollId: this.pollId, demographics})
        .then(res => {
          this.totalReceivers = res.totalReceivers
          this.cutsSelected.totalReceivers = res.totalReceivers
          this.$emit('loading', false)
          this.$set(this.cutsSelected, 'demographics', this.totalDemographicFiltered)
          this.$emit('receivers-modified', this.cutsSelected.totalReceivers > 0);
        })
    },
    calculatePopulation(initial = false) {
      if (!initial) {
        this.setTotalReceivers(this.totalDemographicFiltered)
      }
    },
    calculateTotal(event, key) {
      this.demographicFilter[key] = event;
      if (!event || event.length === 0) delete this.demographicFilter[key];
      this.cutsSelected.listOfDemographics = this.demographicFilter;
      this.updateTotalDemographicFiltered();
    },
    updateTotalDemographicFiltered(isInitial = false) {
      this.totalDemographicFiltered = []
      this.totalDemographicFiltered = this.cutsSelected.totalPopulation.filter(demographic => {
        let flat = false
        for (const key in this.demographicFilter) {
          if (key === 'departments') {
            flat = this.demographicFilter[key].includes(demographic.departmentId);
          } else if (key === 'jobTypes') {
            flat = this.demographicFilter[key].includes(demographic.jobTypeId);
          } else if (key === 'genders') {
            flat = this.demographicFilter[key] === demographic.genderId;
          } else if (key === 'countries') {
            flat = this.demographicFilter[key].includes(demographic.countryId);
          } else if (key === 'headquarters') {
            flat = this.demographicFilter[key].includes(demographic.headquarterId);
          } else if (key === 'charges') {
            flat = this.demographicFilter[key].includes(demographic.chargeId);
          } else if (key === 'academicDegrees') {
            flat = this.demographicFilter[key].includes(demographic.academicDegreeId);
          } else if (key === 'additionalDemographics1') {
            flat = this.demographicFilter[key].includes(demographic.additionalDemographic1Id);
          } else if (key === 'additionalDemographics2') {
            flat = this.demographicFilter[key].includes(demographic.additionalDemographic2Id);
          } else if (key === 'age') {
            flat = demographic.age >= this.demographicFilter[key][0] && demographic.age < this.demographicFilter[key][1];
          } else if (key === 'antiquity') {
            flat = demographic.antiquity >= this.demographicFilter[key][0] && demographic.antiquity < this.demographicFilter[key][1];
          }

          if (!flat) {
            break;
          }
        }
        this.$emit('demographics-filtered', this.demographicFilter);
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
          raw_headquarters: this.raw_headquarters,
        });

        return flat;
      });

      this.calculatePopulation(isInitial);
    },
    getHeadquarters(id) {
      headquartersService.list(id).then((res) => {
        this.headquarters = this.headquarters.concat(formatRes(res.items));
        this.headquarters = this.headquarters.filter(item => this.cutsSelected.countrySelect.includes(item.refId))
      }).catch(this.headquarters = []);
    },
    calculatedAge(date) {
      const today = new Date()
      const bd = new Date(date)
      let age = today.getFullYear() - bd.getFullYear()
      const m = today.getMonth() - bd.getMonth()
      if (m < 0 || (m === 0 && today.getDate() < bd.getDate())) age--
      return age
    },
    calculateAntiquity(date) {
      const diff = new Date().getTime() - new Date(date).getTime()
      return diff / (1000 * 60 * 60 * 24 * 365.25)
    },
    isAnyCutSelected() {
      if (!this.cutsSelected.hasOwnProperty('listOfDemographics')) {
        return false
      } else if (
        this.cutsSelected.listOfDemographics.hasOwnProperty('additionalDemographics1') ||
        this.cutsSelected.listOfDemographics.hasOwnProperty('additionalDemographics2') ||
        this.cutsSelected.listOfDemographics.hasOwnProperty('departments') ||
        this.cutsSelected.listOfDemographics.hasOwnProperty('charges') ||
        this.cutsSelected.listOfDemographics.hasOwnProperty('academicDegrees') ||
        this.cutsSelected.listOfDemographics.hasOwnProperty('jobTypes') ||
        this.cutsSelected.listOfDemographics.hasOwnProperty('genders') ||
        this.cutsSelected.listOfDemographics.hasOwnProperty('antiquity') ||
        this.cutsSelected.listOfDemographics.hasOwnProperty('age') ||
        this.cutsSelected.listOfDemographics.hasOwnProperty('countries') ||
        this.cutsSelected.listOfDemographics.hasOwnProperty('headquarters')
      ){
        return true
      } else {
        return false
      }
    },
    getOthersTag(n) {
      return this.$t('pulses.others', { n })
    },
  },
  created() {
    this.$emit('loading', true);
    resolver
      .all({
        questionnaires: questionnairesService.listByType('engagement'),
        participants: engagementsService.getParticipantsByPollId(this.pollId),
        genders: gendersService.list(),
        jobTypes: jobTypesService.list(),
        departments: departmentsService.list(),
        charges: chargesService.list(),
        // enterprise: enterprisesService.getProfile(),
        countries: countriesService.listByEnterprise(),
        academicDegrees: academicDegreesService.listFromSuite(),
        rawHeadquarters: headquartersService.fetchHeadquartersByEnterprise(),
        additionalDemographics1: additionalDemographics1Service.list(),
        additionalDemographics2: additionalDemographics2Service.list(),
      })
      .then((res) => {
        this.additionalDemographics1 = formatEnterprisesValue(res.additionalDemographics1.items);
        this.additionalDemographics2 = formatEnterprisesValue(res.additionalDemographics2.items);
        this.academicDegrees = formatEnterprisesValue(res.academicDegrees.items);
        this.countries = formatItemsGeneral(res.countries.items);
        this.cutsSelected.questionnaires = formatItems(res.questionnaires.items);
        this.totalAnswers = res.participants.totalAnswers;

        this.cutsSelected.totalPopulation = res.participants.demographics.map(demographic => {
          demographic.age = this.calculatedAge(demographic.birthdate);
          demographic.antiquity = this.calculateAntiquity(demographic.admission);
          return demographic;
        });

        // se eliminó todo el uso de esto
        // const demoItems = res.enterprise.demographicItems.filter(item => item.data === 'master_reference' || item.code === 'age' || item.code === 'antiquity');
        // this.cutsSelected.demographicItems = {
        //   gender: demoItems.filter(item => item.code === 'gender'),
        //   age: demoItems.filter(item => item.code === 'age'),
        //   antiquity: demoItems.filter(item => item.code === 'antiquity'),
        //   country: demoItems.filter(item => item.code === 'country'),
        //   headquarter: demoItems.filter(item => item.code === 'headquarter'),
        //   charge: demoItems.filter(item => item.code === 'charge'),
        //   department: demoItems.filter(item => item.code === 'departments'),
        //   jobType: demoItems.filter(item => item.code === 'jobTypes'),
        //   academicDegrees: demoItems.filter(item => item.code === 'academicDegree'),
        // }

        this.genders = formatEnterprisesValue(res.genders.items);
        this.jobTypes = formatEnterprisesValue(res.jobTypes.items);
        this.departments = formatEnterprisesValue(res.departments.items);
        this.charges = formatEnterprisesValue(res.charges.items);
        this.raw_headquarters = res.rawHeadquarters;
        // this.genders = formatEnterprisesValue(res.enterprise.genders);
        // this.jobTypes = formatEnterprisesValue(res.enterprise.jobTypes);
        // this.departments = formatEnterprisesValue(res.enterprise.departments);
        // this.charges = formatEnterprisesValue(res.enterprise.charges);

        this.updateTotalDemographicFiltered(true);

        this.displayComponent = true;
        this.$emit('answers-fetched', !this.totalAnswers);
        this.$emit('loading', false);
      });
  },
}
</script>
