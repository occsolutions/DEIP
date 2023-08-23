
<template>
  <v-row row wrap align-center>
    <v-col sm="4" cols="8">
      <label class="label"><strong>{{ label }}</strong></label>
    </v-col>
    <v-col cols="12" md="8">
      <v-row row wrap>
        <v-col cols="6" md="6">
          <v-menu
            v-model="startMenu"
            :close-on-content-click="false"
            lazy
            transition="scale-transition"
          >
            <template v-slot:activator="{ on }">
              <v-text-field
                v-model="formattedStart"
                label="Desde"
                prepend-icon="event"
                readonly
                clearable
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="value.start"
              :allowed-dates="allowedDatesForStart"
              locale="es"
              @input="startMenu = false"
            ></v-date-picker>
          </v-menu>
        </v-col>
        <v-col cols="6" md="6">
          <v-menu
            v-model="endMenu"
            :close-on-content-click="false"
            lazy
            transition="scale-transition"
          >
            <template v-slot:activator="{ on }">
              <v-text-field
                v-model="formattedEnd"
                label="Hasta"
                prepend-icon="event"
                readonly
                clearable
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="value.end"
              :allowed-dates="allowedDatesForEnd"
              locale="es"
              @input="endMenu = false"
            ></v-date-picker>
          </v-menu>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>

import Vue from 'vue'

export default Vue.extend({
  props: {
    value: Object,
    label: {
      type: String,
      default: 'Fecha'
    }
  },
  data () {
    return {
      formattedStart: '',
      formattedEnd: '',
      startMenu: false,
      endMenu: false
    }
  },
  watch: {
    'value.start' (value) {
      this.formattedStart = this.formatDate(value)
    },
    'value.end' (value) {
      this.formattedEnd = this.formatDate(value)
    },
    formattedStart (value) {
      if (!value) {
        this.value.start = null
      }
    },
    formattedEnd (value) {
      if (!value) {
        this.value.end = null
      }
    }
  },
  methods: {
    formatDate (date) {
      if (!date) {
        return ''
      }
      const [year, month, day] = date.split('-')
      return `${day}/${month}/${year}`
    },
    allowedDatesForStart (start) {
      const startDate = new Date(start)
      const lessThanEnd = !this.value.end || startDate.getTime() <= new Date(this.value.end)
      return this.notFutureDate(startDate) && lessThanEnd
    },
    allowedDatesForEnd (end) {
      const endDate = new Date(end)
      const greaterThanStart = !this.value.start || endDate.getTime() >= new Date(this.value.start)
      return this.notFutureDate(endDate) && greaterThanStart
    },
    notFutureDate (date) {
      return date.getTime() < (new Date()).getTime()
    }
  }
})
</script>
