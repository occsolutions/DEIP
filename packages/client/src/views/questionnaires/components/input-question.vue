<template>
  <v-row>
    <v-col cols="12">
      <v-tooltip bottom color="blue" >
        <template v-slot:activator="{ on }" >
          <v-text-field light outlined hide-details
            name="question"
            v-model="label"
            v-on="on"
            color="blue"
            append-icon="mdi-content-save-edit-outline"
            @keypress.enter="sendForm()"
            @blur="sendForm()"
          ></v-text-field>
        </template>
        <span>
          {{ $t('Views.Questionnaires.edit.tooltip_info') }}
        </span>
      </v-tooltip>
    </v-col>
    <v-col cols="12" class="pt-0">
      <v-alert dense outlined text type="info">
        <v-row align="center">
          <v-col class="grow">
            <strong>{{ type.title[lang] }}</strong> {{ type.descriptions[lang] }}
          </v-col>
          <v-col class="shrink" v-if="type.type !== 'open'">
            <v-dialog scrollable persistent
              v-model="dialog"
              max-width="600px"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  v-bind="attrs"
                  v-on="on"
                >
                {{ $t('Views.Questionnaires.edit.options') }}
                </v-btn>
              </template>
              <v-card>
                <v-card-title>
                  <span class="text-h5">
                    <strong>{{ type.title[lang] }}</strong>:
                    {{ $t('Views.Questionnaires.edit.options') }}
                  </span>
                </v-card-title>
                <v-card-text>
                  <v-container>
                    <v-row v-for="(option, idx) in options" :key="idx">
                      <v-col v-if="isOptionsEditable" cols="10">
                        <v-text-field
                          :label="$t('Views.Questionnaires.edit.input_option_label')"
                          v-model="option.label[lang]"
                          required
                        ></v-text-field>
                        <v-text-field
                          class="m-l-4"
                          :label="$t('Views.Questionnaires.edit.input_option_value')"
                          v-model="option.value"
                          required
                        ></v-text-field>
                      </v-col>
                      <v-col v-else cols="12">
                        <v-text-field
                          :label="$t('Views.Questionnaires.edit.input_option_label')"
                          v-model="option.label[lang]"
                          readonly disabled
                        ></v-text-field>
                        <v-text-field
                          class="m-l-4"
                          :label="$t('Views.Questionnaires.edit.input_option_value')"
                          v-model="option.value"
                          readonly disabled
                        ></v-text-field>
                      </v-col>
                      <v-col cols="6" sm="1" class="d-flex justify-center align-center" v-if="isOptionsEditable">
                        <v-btn icon outlined rounded
                          color="red lighten-1"
                          :disabled="options.length <= 1"
                          @click="minusOption(idx)"
                        ><v-icon dark>mdi-minus</v-icon></v-btn>
                      </v-col>
                      <v-col cols="6" sm="1" class="d-flex justify-center align-center" v-if="isOptionsEditable">
                        <v-btn icon outlined rounded
                          color="green lighten-1"
                          @click="plusOption(idx)"
                        ><v-icon dark>mdi-plus</v-icon></v-btn>
                      </v-col>
                      <v-col cols="12"><v-divider></v-divider></v-col>
                    </v-row>
                    <v-row>
                      <v-col cols="12">
                        <small>{{ $t('Views.Questionnaires.edit.selection') }}</small>
                      </v-col>
                      <v-col cols="12" sm="6">
                        <v-text-field disabled
                          v-model.number="min"
                          :label="$t('Views.Questionnaires.edit.input_min')"
                          :readonly="!isMinEditable"
                          Cdisabled="!isMinEditable"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6">
                        <v-text-field disabled
                          v-model.number="limit"
                          :label="$t('Views.Questionnaires.edit.input_limit')"
                          :readonly="!isLimitEditable"
                          Cdisabled="!isLimitEditable"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn
                    color="blue darken-1"
                    text
                    @click="dialog = false"
                  >
                  {{ $t('Views.Questionnaires.edit.btn_close') }}
                  </v-btn>
                  <v-btn
                    color="blue darken-1"
                    text
                    @click="sendOptions"
                    v-if="editable.length"
                  >
                  {{ $t('Views.Questionnaires.edit.btn_save') }}
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-col>
        </v-row>
      </v-alert>
    </v-col>
  </v-row>
</template>

<script>

import Vue from 'vue'

import questionnairesService from '../../../services/questionnaires'

export default Vue.extend({
  props: {
    slug: {
      type: String,
      required: true
    },
    questionKey: {
      type: String,
      required: true
    },
    questionTypes: {
      type: Array,
      required: true
    },
    lang: {
      type: String,
      required: true
    },
    question: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      dialog: false,
      label: '',
      type: {},
      options: [],
      min: 1,
      limit: undefined
    }
  },
  computed: {
    editable () {
      return this.type.editable || []
    },
    isOptionsEditable () {
      return Boolean(this.editable.length && this.editable.indexOf('options') !== -1)
    },
    isMinEditable () {
      return Boolean(this.editable.length && this.editable.indexOf('min') !== -1)
    },
    isLimitEditable () {
      return Boolean(this.editable.length && this.editable.indexOf('limit') !== -1)
    }
  },
  methods: {
    sendForm () {
      this.$store.dispatch('loading/show')
      return questionnairesService.edit(this.slug, {
        key: this.questionKey,
        lang: this.lang,
        label: this.label
      })
        .then(() => {
          this.$store.dispatch('alert/success', this.$t('Views.Questionnaires.edit.edited_succesfully'))
          this.$store.dispatch('loading/hide')
        }).catch(() => {
          this.$store.dispatch('alert/error', this.$t('Views.Questionnaires.edit.edited_error'))
          this.$store.dispatch('loading/hide')
        })
    },
    plusOption (idx) {
      const label = {}
      label[this.lang] = ''
      if (idx !== undefined) {
        const temp = []
        for (let i = 0; i < this.options.length; i++) {
          temp.push(this.options[i])
          if (i === idx) {
            temp.push({ label, value: '' })
          }
        }
        this.$set(this, 'options', JSON.parse(JSON.stringify(temp)))
      } else {
        this.options.push({ label, value: '' })
      }
    },
    minusOption (idx) {
      if (this.options.length <= 1) {
        return
      }
      this.options.splice(idx, 1)
    },
    validate () {
      if (this.min <= 0) {
        return 'option_edit_valid_min'
      }
      if (this.options.length < this.min) {
        return 'option_edit_valid_length'
      }
      if (this.limit && (!Number.isInteger(this.min) || !Number.isInteger(this.limit))) {
        return 'option_edit_valid_interget'
      }
      const exist = []
      for (let i = 0; i < this.options.length; i++) {
        if (!this.options[i].label[this.lang] || !this.options[i].value) {
          return 'option_edit_valid_option_required'
        }
        if (exist.indexOf(this.options[i].value) !== -1) {
          return 'option_edit_valid_option_value_unique'
        }
        exist.push(this.options[i].value)
      }
      return true
    },
    sendOptions () {
      this.$store.dispatch('loading/show')
      const isValid = this.validate()
      if (isValid !== true) {
        this.$store.dispatch('alert/error', this.$t(`Views.Questionnaires.edit.${isValid}`))
        return this.$store.dispatch('loading/hide')
      }
      return questionnairesService.editOptions(this.slug, {
        key: this.questionKey,
        lang: this.lang,
        min: this.min,
        limit: this.limit || undefined,
        options: this.options
      })
        .then(() => {
          this.$store.dispatch('alert/success', this.$t('Views.Questionnaires.edit.edited_succesfully'))
          this.$store.dispatch('loading/hide')
          this.dialog = false
        }).catch(() => {
          this.$store.dispatch('alert/error', this.$t('Views.Questionnaires.edit.edited_error'))
          this.$store.dispatch('loading/hide')
        })
    }
  },
  created () {
    this.label = (this.question.label || {})[this.lang]
    this.type = this.questionTypes.find(qt => qt.type === this.question.type)
    this.options = (this.type.options || []).length ? this.type.options : this.question.options
    this.min = this.type.min || this.question.min
    this.limit = this.type.limit || this.question.limit
    if (!this.options.length) {
      this.plusOption()
    }
  }
})
</script>
