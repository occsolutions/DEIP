<template>
  <v-container>
    <template>
      <v-row>
        <v-col>
          <h4 class="display-1">{{ $t('Views.Questionnaires.edit.title') }}</h4>
        </v-col>
      </v-row>
      <v-card>
        <v-card-text>
          <v-expansion-panels>
            <v-expansion-panel
              v-for="(dimention, ix) in evaluations" :key="ix">
              <!-- Dimension -->
              <v-expansion-panel-header class="text-uppercase font-weight-bold">
                {{ $t(`Views.Questionnaires.edit.d_${ dimention }`) }}
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-row v-for="(variable, i) in Object.keys(questionnaire.evaluations[dimention])" :key="i">
                  <!-- Variable -->
                  <v-col cols="12" xs="12">
                    <v-banner
                      color="grey lighten-3"
                      icon="mdi-note-outline"
                      outlined
                      rounded
                      single-line
                      sticky
                    >{{ $t(`Views.Questionnaires.edit.v_${ variable }`) }}</v-banner>
                  </v-col>
                  <!-- Questions with Reference -->
                  <v-col cols="12" v-for="(question, q) in questionnaire.evaluations[dimention][variable]" :key="index + '-' + q">
                    <v-tooltip bottom color="blue" >
                      <template v-slot:activator="{ on }" >
                        <v-text-field
                          light outlined
                          :label="(question.reference || {})[lang]"
                          name="question"
                          v-model="(question.question || {})[lang]"
                          @keypress.enter="sendForm"
                          @blur="sendForm"
                          v-on="on"
                          outline
                          append-icon="mdi-content-save-edit-outline"
                          color="blue"
                        ></v-text-field>
                      </template>
                      <span>
                        {{ $t('Views.Questionnaires.edit.tooltip_info') }}
                      </span>
                    </v-tooltip>
                  </v-col>
                </v-row>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
          <v-row>
            <v-col align="end">
              <v-btn to="/questionnaires" text>
                {{ $t('Views.Questionnaires.edit.btn_back') }}
              </v-btn>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </template>
  </v-container>
</template>

<script>

import Vue from 'vue'
import { mapState } from 'vuex'

import questionnairesService from '../../services/questionnaires'

export default Vue.extend({
  data () {
    return {
      questionnaire: {},
      evaluations: [],
      lang: 'es'
    }
  },
  computed: {
    ...mapState({
      user: (state) => state.session.user
    })
  },
  created () {
    this.getQuestionnaire()
  },
  methods: {
    getQuestionnaire () {
      this.$store.dispatch('loading/show')
      return questionnairesService.getOne(this.$route.params.slug)
        .then((res) => {
          this.questionnaire = res
          this.$store.dispatch('loading/hide')
          if (!this.questionnaire) {
            this.$router.push('404')
          }
          this.evaluations = Object.keys(this.questionnaire.evaluations)
        }).catch(() => {
          this.$store.dispatch('loading/hide')
          this.$router.push('404')
        })
    },
    sendForm () {
      this.$store.dispatch('loading/show')
      return questionnairesService.edit(this.questionnaire.slug, this.questionnaire)
        .then(() => {
          this.$store.dispatch('alert/success', this.$t('Views.Questionnaires.edit.edited_succesfully'))
          this.$store.dispatch('loading/hide')
        }).catch(() => {
          this.$store.dispatch('alert/error', this.$t('Views.Questionnaires.edit.edited_error'))
          this.$store.dispatch('loading/hide')
        })
    }
  }
})
</script>
