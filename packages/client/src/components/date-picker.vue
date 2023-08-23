<template>
  <v-dialog
    ref="dialog"
    v-model="showPicker"
    :return-value.sync="date"
    persistent
    :disabled="readonly"
    width="290px"
  >
    <template v-slot:activator="{ on }">
      <ValidationProvider v-slot="{ errors }" :name="name" :rules="rules" :vid="vid" :ref="reff">
        <v-text-field
          v-bind:style="readonly ? 'cursor: not-allowed !important;' : ''"
          :filled="readonly"
          v-model="computedDateFormatted"
          :label="label"
          :outline="outline"
          readonly
          v-on="on"
          :name="name"
          :error="!!errors[0] || !!errorMessages[0]"
          :error-messages="errors[0] || errorMessages[0]"
          :append-outer-icon="help ? $t('help.icon') : ''"
          @click:append-outer="help ? $store.dispatch('help/display', { title: help.title, text: help.text }) : ''"
        ></v-text-field>
      </ValidationProvider>
    </template>
    <v-date-picker
      v-model="date"
      scrollable
      color="primary"
      locale="es"
      :max="max"
    >
      <v-spacer></v-spacer>
      <v-btn @click="showPicker = false">{{ $t('Components.DatePicker.inputCancel') }}</v-btn>
      <v-btn color="primary" @click="pickDate">{{ $t('Components.DatePicker.inputAccept') }}</v-btn>
    </v-date-picker>
  </v-dialog>
</template>

<script>

import Vue from 'vue'

export default Vue.extend({
  props: {
    reff: String,
    label: {
      type: String,
      required: true
    },
    value: [Date, String],
    errorMessages: {
      type: Array,
      default: () => ([])
    },
    name: {
      type: String,
      required: true
    },
    outline: Boolean,
    readonly: Boolean,
    help: Object,
    max: String,
    rules: String,
    vid: String
  },
  data () {
    return {
      showPicker: false,
      date: null
    }
  },
  computed: {
    computedDateFormatted () {
      return this.formatDate(this.date)
    }
  },
  watch: {
    date () {
      this.dateFormatted = this.formatDate(this.date)
    },
    value: {
      handler () {
        if (!this.value) {
          this.date = null
          this.$emit('date-picked', '')
        } else if (typeof this.value === 'string') {
          if (new Date(this.value).toString() === 'Invalid Date') {
            this.date = null
            this.$emit('date-picked', '')
          } else if (this.value.indexOf('-') === -1) {
            this.date = null
            this.$emit('date-picked', '')
          } else {
            const date = this.value.split('T')
            this.date = date[0]
          }
        }
      },
      immediate: true
    }
  },
  methods: {
    formatDate (date) {
      if (!date) return null
      const [year, month, day] = date.split('-')
      return day ? `${day}/${month}/${year}` : ''
    },
    pickDate () {
      this.$refs.dialog.save(this.date)
      this.$emit('date-picked', this.date)
    }
  }
})
</script>
