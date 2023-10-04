
<template>
    <v-container flat>
      <v-card flat>
        <ValidationObserver v-slot="{ handleSubmit }">
          <v-form @submit.prevent="handleSubmit(changeStep)">
            <v-row>
              <v-col cols="12" class="pa-3 headline">
                {{ $t('Views.Evaluations.stepDate.title') }}
                <v-divider></v-divider>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" sm="3">
                <x-date-picker
                  ref="delivered"
                  :rules="edit ? 'required' : 'required|dateNowAfter'"
                  v-model="evaluation.deliveredAt.value"
                  :readonly="readonly"
                  @date-picked="evaluation.deliveredAt.value = $event"
                  :label="$t('Views.Evaluations.stepDate.date_delivery')"
                  :append-outer-icon="$t('help.icon')"
                  :help="$t('help.engagement.create.deliveredAt')"
                  :name="$t('Views.Evaluations.stepDate.date_delivery')"
                ></x-date-picker>
              </v-col>

              <v-col cols="12" sm="3">
                <v-autocomplete
                  :filled="readonly"
                  v-bind:style="readonly ? 'cursor: not-allowed;' : ''"
                  :items="hours"
                  persistent-hint
                  v-model="evaluation.deliveredAt.hour"
                  light
                  :label="$t('Views.Evaluations.stepDate.hours')"
                  autofocus
                  name="hours"
                  :disabled="readonly"
                  :data-vv-as="$t('Views.Evaluations.stepDate.hours') | lowerCase"
                ></v-autocomplete>
              </v-col>

              <v-col cols="12" sm="3">
                <x-date-picker
                  v-model="evaluation.validUntil.value"
                  @date-picked="evaluation.validUntil.value = $event"
                  :label="$t('Views.Evaluations.stepDate.poll_valid_until')"
                  :name="$t('Views.Evaluations.stepDate.poll_valid_until')"
                  :help="$t('help.engagement.create.validUntil')"
                  ref="valid_until"
                  :rules="'required|dateNowAfter:@' + $t('Views.Evaluations.stepDate.date_delivery')"
                ></x-date-picker>
              </v-col>

              <v-col cols="12" sm="3">
                <v-autocomplete
                  :items="hours"
                  persistent-hint
                  v-model="evaluation.validUntil.hour"
                  light
                  :label="$t('Views.Evaluations.stepDate.hours_valid_until')"
                  autofocus
                  name="hours_valid_until"
                  :data-vv-as="$t('Views.Evaluations.stepDate.hours_valid_until') | lowerCase"
                ></v-autocomplete>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <v-autocomplete
                  :filled="readonly"
                  v-bind:style="readonly ? 'cursor: not-allowed;' : ''"
                  persistent-hint
                  :items="timeZones"
                  v-model="evaluation.timeZone"
                  light
                  :label="$t('Views.Evaluations.stepDate.time_zone')"
                  name="selection_type"
                  :data-vv-as="$t('Views.Evaluations.stepDate.time_zone') | lowerCase"
                  :append-outer-icon="$t('help.icon')"
                  :disabled="readonly"
                  @click:append-outer="$store.dispatch('help/display', $t('help.engagement.create.timezone'))"
                ></v-autocomplete>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" class="reminder">
                <v-switch
                  v-model="switchDate"
                  :label="$t('Views.Evaluations.stepDate.want_send_reminders')"
                  :append-icon="$t('help.icon')"
                  @click:append="$store.dispatch('help/display', $t('help.engagement.create.reminders'))"
                />
              </v-col>
            </v-row>

            <v-row
              align-center justify-start row fill-height
              v-bind:key="index" v-for="(reminder,index) in evaluation.reminders"
              v-show="switchDate"
            >
              <v-col cols="12" sm="7" md="3" class="mr-2" >
                <x-date-picker
                  v-model="evaluation.reminders[index].value"
                  @date-picked="evaluation.reminders[index].value = $event"
                  :label="$t('Views.Evaluations.stepDate.title')"
                  :rules="switchDate ?
                    `required|dateBetween:${validateUntil.ref},${validateUntil.finish},${evaluation.reminders[index].hour}` : ''
                  "
                  :name="$t('Views.Evaluations.stepDate.the_reminders')"
                  vid="Views.Evaluations.stepDate.the_reminders"
                  :reff="`child_picker${index}`"
                  ref="parent_picker"
                ></x-date-picker>
              </v-col>
              <v-col cols="12" sm="4" md="3">
                <x-inputs-autocomplete
                  :items="hours"
                  :input="evaluation.reminders[index].hour"
                  @updateInput="($event) => evaluation.reminders[index].hour = $event"
                  light
                  :label="$t('Views.Evaluations.stepDate.hours')"
                  name="hours"
                  rules="required"
                  :bind-style="readonly ? 'cursor: not-allowed;' : ''"
                  autofocus
                  :append-outer-icon="$t('help.icon')"
                  :help-message="$t('help.engagement.create.timezone')"
                />
              </v-col>
              <!-- ADD/REMOVE REMINDERS -->
              <v-col cols="12" sm="12" md="5" v-if="evaluation.reminders.length == index + 1" class="pt-5">
                <v-btn outlined rounded
                  color="red"
                  class="mr-2"
                  @click="evaluation.status !== 'completed' ? deleteReminder(index) : {}"
                >
                  {{ $t('Views.Evaluations.stepDate.trash') }}
                </v-btn>

                <v-btn outlined rounded
                  color="green"
                  @click="evaluation.status !== 'completed' ? addReminder(index) : {}"
                >
                  {{ $t('Views.Evaluations.stepDate.add') }}
                </v-btn>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" sm="6">
                <v-btn
                  block
                  large
                  @click="changeStep(true)"
                >{{ $t(prevAction) }}</v-btn>
              </v-col>
              <v-col cols="12" sm="6">
                <v-btn
                  color="primary"
                  block
                  large
                  type="submit"
                >{{ $t(nextAction) }}</v-btn>
              </v-col>
            </v-row>
          </v-form>
        </ValidationObserver>
      </v-card>
    </v-container>
</template>

<script>
import Vue from 'vue'

export default Vue.extend({
  props: {
    evaluation: Object,
    step: String,
    nextAction: String,
    prevAction: String,
    timeZones: Array,
    autoSwitchDate: Boolean
  },
  data () {
    return {
      edit: Boolean(this.$route.params.slug),
      hours: [],
      switchDate: false
    }
  },
  computed: {
    validateUntil: function () {
      const { deliveredAt, validUntil } = this.evaluation
      return {
        ref: new Date(`${deliveredAt.value} ${deliveredAt.hour}:00`).getTime(),
        finish: new Date(`${validUntil.value} ${validUntil.hour}:00`).getTime()
      }
    },
    readonly () {
      return this.evaluation.status !== 'pending'
    }
  },
  watch: {
    autoSwitchDate () {
      this.switchDate = this.autoSwitchDate
    },
    switchDate (val) {
      if (val && !this.evaluation.reminders.length) {
        this.evaluation.reminders.push({
          value: '',
          hour: '23:00'
        })
      }
    }
  },
  methods: {
    validateReminders () {
      if (this.evaluation.reminders && this.evaluation.reminders.length > 0) {
        for (const rem of this.evaluation.reminders) {
          const remTime = new Date(`${rem.value} ${rem.hour}:00`).getTime()
          if (this.validateUntil.ref < remTime) {
            if (this.validateUntil.finish < remTime && rem.value !== '') {
              return false
            }
          } else if (rem.value !== '') {
            return false
          }
        }
      }
      return true
    },
    validateReminderDate (rem) {
      if (rem.value !== '') {
        const remTime = new Date(`${rem.value} ${rem.hour}:00`).getTime()
        if (this.validateUntil.ref > remTime || this.validateUntil.finish < remTime) {
          return [this.$t('Views.Evaluations.stepDate.invalid_reminder_date')]
        }
      }
      return []
    },
    getOffsetObject () {
      const text = this.evaluation.timeZone
      const arr = []
      this.timeZones.forEach(element => {
        if (element.text === `${text}`) {
          arr.push(element)
        }
      })
      return arr
    },
    validTimeZone () {
      const offsetObj = this.getOffsetObject()
      if (offsetObj.length < 1) {
        return false
      }
      const date = new Date()
      const utc = date.getTime() + (date.getTimezoneOffset() * 60000)
      const newDate = new Date(utc + (3600000 * (parseFloat(offsetObj[0].offset))))
      const dates = this.validateUntil
      if (dates) {
        return newDate.getTime() < dates.ref
      } else {
        return false
      }
    },
    changeStep (isBack = false) {
      if (isBack) {
        this.$emit('changeStep', this.evaluation, +this.step - 1)
        return
      }
      if (!this.switchDate) {
        this.evaluation.reminders = []
      }
      if ((this.readonly || this.validTimeZone()) && this.validateUntil.ref < this.validateUntil.finish && this.validateReminders()) {
        this.$emit('changeStep', this.evaluation, isBack ? +this.step - 1 : +this.step + 1)
      } else {
        this.$store.dispatch('alert/error', this.$t('errors.error_select_dates'))
      }
    },
    getHours () {
      for (let i = 0; i < 24; i++) {
        i < 10 ? this.hours.push('0' + i + ':00') : this.hours.push(i + ':00')
      }
    },
    addReminder (i) {
      this.$refs.parent_picker[i].$refs['child_picker' + i].validate()
        .then(res => {
          if (res.valid) {
            this.evaluation.reminders.length === 5
              ? this.$store.dispatch('alert/error', this.$t('errors.validator/reminders'))
              : this.evaluation.reminders.push({
                value: '',
                hour: '23:00'
              })
          }
        })
    },
    deleteReminder (index) {
      if (this.evaluation.reminders.length === 1) {
        this.$store.dispatch('alert/error', this.$t('errors.validator/delete_reminder'))
      } else {
        this.evaluation.reminders.splice(index, 1)
      }
    }
  },
  created () {
    this.getHours()
  }
})
</script>

<style>
  .reminder div.v-input__control {
    -webkit-box-flex: 0;
    -ms-flex-positive: 0;
    flex-grow: 0;
    width: auto;
  }
</style>
