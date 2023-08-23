
<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <h4 class="display-1 mb-3">{{ $t('Components.Navigation.open_questions') }}</h4>
      </v-col>

      <v-col cols="12">
        <v-card>
          <v-row >
            <v-col cols="12" class="pa-5 headline">
              {{ $t('Views.OpenQuestions.list.title') }}
              <v-divider></v-divider>
            </v-col>
          </v-row>
          <v-card-text>
            <v-container grid-list-md text-xs-center>
              <v-row wrap>
                <v-col cols="12"
                  v-for="(question, index) in formatedQuestions"
                  v-bind:key="index"
                  class="py-0"
                >
                  <v-tooltip bottom color="blue" >
                    <template v-slot:activator="{ on }" >
                      <v-text-field outlined persistent-hint
                        v-model="question.label"
                        v-on="on"
                        :append-icon="question.icon || 'mdi-content-save-edit-outline'"
                        :name="question.name"
                        :color="question.color || 'blue'"
                        @keyup.enter="editQuestion(question)"
                      ></v-text-field>
                    </template>
                    <span>
                      {{ $t('Views.OpenQuestions.edit.tooltip_info') }}
                    </span>
                  </v-tooltip>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import Vue from 'vue'
import { mapState } from 'vuex'

import openQuestionService from '../../services/open-questions'

export default Vue.extend({
  data () {
    return {
      formatedQuestions: [],
      language: '',
      languages: [],
      openQuestions: []
    }
  },
  methods: {
    getOpenQuestions () {
      this.$store.dispatch('loading/show')
      openQuestionService.list()
        .then((resp) => {
          this.openQuestions = resp
          this.language = 'es'
        })
        .catch((error) => {
          this.$store.dispatch('alert/error', this.$t(`errors.${error.code}`))
        })
        .finally(() => {
          this.$store.dispatch('loading/hide')
        })
    },
    formatQuestionsByLanguage () {
      this.formatedQuestions = this.openQuestions.map((openQ) => ({
        name: openQ.name,
        color: 'blue',
        icon: 'mdi-content-save-edit-outline',
        label: openQ.question[this.language]
      }))
    },
    changeColor (item, success) {
      item.icon = success ? 'mdi-check-bold' : 'mdi-cancel'
      item.color = success ? 'green' : 'red'
    },
    defaultColors (item) {
      item.color = 'blue'
      item.icon = 'mdi-content-save-edit-outline'
    },
    questionEmpty (item) {
      this.$store.dispatch('alert/error', this.$t('Views.OpenQuestions.edit.question_empty'))
      this.changeColor(item)
    },
    editQuestion (item) {
      if (item.label === '') {
        this.questionEmpty(item)
      } else {
        const newData = JSON.parse(JSON.stringify(this.openQuestions))
        const editingQuestion = newData.find(q => q.name === item.name)
        const oldlabel = editingQuestion.question[this.language]
        editingQuestion.question[this.language] = item.label

        openQuestionService.updateQuestion(editingQuestion)
          .then(() => {
            this.$store.dispatch('alert/success', this.$t('Views.OpenQuestions.edit.edited_succesfully'))
            this.changeColor(item, true)
          })
          .catch((err) => {
            this.$store.dispatch('alert/error', this.$t(`errors.${err.code}`))
            item.label = oldlabel
            this.changeColor(item)
          })
      }
    }
  },
  created () {
    this.getOpenQuestions()
  },
  computed: {
    ...mapState({
      user: state => state.session.user
    })
  },
  watch: {
    language () {
      this.formatQuestionsByLanguage()
    }
  }
})
</script>
