<template>
  <v-container>
    <v-row>
      <v-col>
        <h4 class="display-1"> {{ $t('Views.Questionnaires.editQuestionnaire.title') }} </h4>
      </v-col>
    </v-row>
    <v-card class="px-4">
      <ValidationObserver
        v-slot="{ handleSubmit }"
      >
        <form @submit.prevent="handleSubmit(saveQuestionnaire)">
          <v-row>
            <v-col cols="12">
              <x-inputs-input
                :input="form.name"
                @updateInput="($event) => form.name = $event"
                :label="$t('Views.Questionnaires.editQuestionnaire.input_name')"
                rules="required"
                autofocus
                light
                name="name"
              />
            </v-col>
            <template v-if="$route.params.slug !== 'base-questionnaire'">
              <v-col cols="12" sm="6">
                <x-inputs-autocomplete
                  :items="assignationTypes"
                  :input="form.assignationType"
                  @updateInput="($event) => form.assignationType = $event"
                  clearable
                  light
                  :label="$t('Views.Questionnaires.editQuestionnaire.input_asignation_type')"
                  name="assign_type"
                />
              </v-col>
              <v-col cols="12" sm="6">
                <x-inputs-autocomplete
                  :items="assignations"
                  :input="form.assignationFor"
                  @updateInput="($event) => form.assignationFor = $event"
                  light
                  :label="$t('Views.Questionnaires.editQuestionnaire.input_assign_to')"
                  name="assign_for"
                  :rules="form.assignationType ? 'required' : ''"
                />
              </v-col>
            </template>
          </v-row>
          <v-row>
            <v-col align="end">
              <v-btn
                text
                to="/questionnaires"
              >
                {{ $t('Views.Questionnaires.editQuestionnaire.btn_cancel') }}
              </v-btn>
              <v-btn
                type="submit"
                color="primary"
              >
                {{ $t('Views.Questionnaires.editQuestionnaire.btn_update') }}
              </v-btn>
            </v-col>
          </v-row>
        </form>
      </ValidationObserver>
    </v-card>
  </v-container>
</template>

<script>
import Vue from 'vue'

import resolver from '../../utils/resolver'

import questionnairesService from '../../services/questionnaires'
import customersService from '../../services/customers'
import sectorsService from '../../services/sectors'

export default Vue.extend({
  data () {
    return {
      form: {
        name: '',
        assignationType: '',
        assignationFor: ''
      },
      assignationTypes: [
        { text: '', value: 'customer' },
        { text: '', value: 'enterprise' },
        { text: '', value: 'sector' }
      ],
      customersResponse: [],
      sectorsRespone: []
    }
  },
  created () {
    this.assignationTypes.forEach(assignation => { assignation.text = this.$t(`Views.Questionnaires.editQuestionnaire.input_option_${assignation.value}`) })
    resolver
      .all({
        customers: customersService.shortListWithEnterprises(),
        sectors: sectorsService.list(),
        questionnaire: questionnairesService.getOne(this.$route.params.slug)
      })
      .then((res) => {
        this.customersResponse = res.customers
        this.sectorsRespone = res.sectors.items
        this.form.name = res.questionnaire.name
        this.form.assignationType = res.questionnaire.assignationType
        this.form.assignationFor = res.questionnaire.assignationFor
      })
  },
  computed: {
    assignations () {
      switch (this.form.assignationType) {
        case 'customer':
          return this.customersResponse.map((customer) => ({
            text: customer.name,
            value: customer.id
          }))
        case 'enterprise': {
          const assignations = []
          for (const customer of this.customersResponse) {
            assignations.push({ header: customer.name })
            for (const enterprise of customer.enterprises) {
              assignations.push({
                text: enterprise.name,
                value: enterprise.id
              })
            }
            assignations.push({ divider: true })
          }
          return assignations
        }
        case 'sector':
          return this.sectorsRespone.map((sector) => {
            return {
              text: sector.translate ? sector.translate.label : sector.code,
              value: sector.id
            }
          })
      }
      return []
    }
  },
  methods: {
    saveQuestionnaire () {
      return questionnairesService.updateInfo(this.$route.params.slug, this.form)
        .then(() => {
          this.$store.dispatch('alert/success', this.$t('Views.Questionnaires.editQuestionnaire.updated_succesfully'))
          this.$router.push('/questionnaires')
        }).catch(() => {
          this.$store.dispatch('alert/success', this.$t('Views.Questionnaires.editQuestionnaire.updated_error'))
        })
    }
  }
})
</script>
