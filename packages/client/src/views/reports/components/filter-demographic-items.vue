
<template>
  <v-form lazy-validation data-vv-scope="form-2">
    <v-container class="pt-0">
      <v-container grid-list-md class="pt-0">
        <v-row row wrap
          align="center"
          justify="center"
        >
          <v-col cols="12">
            <p class="mt-5 mb-0 body-2 text-center">{{ $t('Views.Evaluations.report.demographic_desc2') }}</p>
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
                :label="$t('Views.Evaluations.stepEvaluatedSelection.demographic_cuts.departments')"
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
                :label="$t('Views.Evaluations.stepEvaluatedSelection.demographic_cuts.charges')"
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
                :label="$t('Views.Evaluations.stepEvaluatedSelection.demographic_cuts.academic_degrees')"
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
                :label="$t('Views.Evaluations.stepEvaluatedSelection.demographic_cuts.job_types')"
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
                :label="$t('Views.Evaluations.stepEvaluatedSelection.demographic_cuts.select_age_range')"
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
                :label="$t('Views.Evaluations.stepEvaluatedSelection.demographic_cuts.select_antiquity_range')"
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
                :label="$t('Views.Evaluations.stepEvaluatedSelection.demographic_cuts.genders')"
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
                :label="$t('Views.Evaluations.stepEvaluatedSelection.demographic_cuts.countries')"
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
                :label="$t('Views.Evaluations.stepEvaluatedSelection.demographic_cuts.headquarter')"
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
                :label="$t('Views.Evaluations.stepEvaluatedSelection.demographic_cuts.optionalDemo1')"
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
                :label="$t('Views.Evaluations.stepEvaluatedSelection.demographic_cuts.optionalDemo2')"
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
          {{ $t('Views.Evaluations.stepEvaluatedSelection.population') }}:
          {{ totalReceivers }}
          {{ $t('Views.Evaluations.stepEvaluatedSelection.people') }}
          <v-spacer></v-spacer>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script src="./index.js"></script>
