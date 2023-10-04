<template>
  <v-container>
    <template>
      <v-row>
        <v-col>
          <h4 class="display-1">{{ $t('Views.Questionnaires.edit.title') }}</h4>
        </v-col>
      </v-row>
      <v-card class="py-5 px-4">
        <v-tabs light grow
          v-model="tab"
          background-color="transparent"
        >
          <v-tab>{{ $t('Views.Questionnaires.edit.dimentions') }}</v-tab>
          <v-tab>{{ $t('Views.Questionnaires.edit.leader') }}</v-tab>
        </v-tabs>
        <v-tabs-items v-model="tab">
          <v-tab-item>
            <v-card-text class="px-1">
              <v-expansion-panels>
                <v-expansion-panel
                  v-for="(dimention, ix) in evaluations" :key="ix">
                  <!-- Dimension -->
                  <v-expansion-panel-header class="text-uppercase font-weight-bold">
                    {{ getLabel(dimention.label) }}
                  </v-expansion-panel-header>
                  <v-expansion-panel-content>
                    <v-row v-for="(attr, i) in dimention.attrs" :key="i">
                      <!-- Atributo -->
                      <v-col cols="12" xs="12">
                        <v-banner
                          color="grey lighten-3"
                          icon="mdi-note-outline"
                          outlined
                          rounded
                          single-line
                          sticky
                        >{{ getLabel(attr.label) }}</v-banner>
                      </v-col>
                      <!-- Questions with Reference -->
                      <x-input-question
                        v-for="(question, q) in attr.questions" :key="q"
                        :question="question"
                        :slug="questionnaire.slug"
                        :question-types="types"
                        :question-key="q"
                        :lang="lang"
                      />
                    </v-row>
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-expansion-panels>
            </v-card-text>
          </v-tab-item>
          <v-tab-item class="pt-3">
            <!-- Questions with Reference -->
            <x-input-question
              v-for="(question, q) in leader" :key="q"
              :question="question"
              :slug="questionnaire.slug"
              :question-types="types"
              :question-key="q"
              :lang="lang"
            />
          </v-tab-item>
        </v-tabs-items>
        <v-row>
          <v-col class="pl-4">
            <v-btn to="/questionnaires" text>
              {{ $t('Views.Questionnaires.edit.btn_back') }}
            </v-btn>
          </v-col>
        </v-row>
      </v-card>
    </template>
  </v-container>
</template>

<script>

import Vue from 'vue'
import { mapState } from 'vuex'

import questionnairesService from '../../services/questionnaires'
import XInputQuestion from './components/input-question.vue'

export default Vue.extend({
  components: {
    XInputQuestion
  },
  data () {
    return {
      tab: null,
      types: [],
      questionnaire: {},
      evaluations: {},
      leader: {},
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
    getLabel (label) {
      return label && typeof label === 'object' ? label[this.lang] || '' : ''
    },
    getQuestionnaire () {
      this.$store.dispatch('loading/show')
      return questionnairesService.questionsTypes()
        .then(resp => {
          this.types = resp.items
          return questionnairesService.getOne(this.$route.params.slug)
        })
        .then((res) => {
          this.questionnaire = res
          this.$store.dispatch('loading/hide')
          if (!this.questionnaire) {
            this.$router.push('404')
          }
          this.evaluations = JSON.parse(JSON.stringify(this.questionnaire.evaluations))
          delete this.evaluations.leader
          this.leader = JSON.parse(JSON.stringify(this.questionnaire.evaluations.leader))
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
