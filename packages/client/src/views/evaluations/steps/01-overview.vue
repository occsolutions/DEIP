<template>
  <v-container flat>
    <v-card flat>
      <ValidationObserver v-slot="{ handleSubmit }">
        <v-form @submit.prevent="handleSubmit(changeStep)">
          <v-row>
            <v-col cols="12" class="pa-3 headline">
              {{ $t('Views.Evaluations.stepOverview.title') }}
              <v-divider></v-divider>
            </v-col>
          </v-row>
          <v-row>

            <v-col cols="12">
              <v-tooltip bottom color='blue'>
                <template v-slot:activator="{ on }">
                    <x-inputs-input
                    :input="evaluation.name"
                    @updateInput="($event) => evaluation.name = $event"
                    :append-outer-icon="$t('help.icon')"
                    :label="$t('Views.Evaluations.stepOverview.input_name')"
                    rules="required"
                    autofocus
                    light
                    name="poll_name"
                    :help-message="$t('help.engagement.create.name')"
                    v-on="on"
                  ></x-inputs-input>
                </template>
                <span>{{ $t('Views.Evaluations.stepOverview.tooltip_input_name') }}</span>
              </v-tooltip>
            </v-col>
            <v-col cols="12">
              <v-switch
                v-model="switchName"
                color="primary"
                :label="$t('Views.Evaluations.stepOverview.want_external_name')"
              ></v-switch>
              <v-tooltip
                bottom
                color='blue'
              >
                <template v-slot:activator="{ on }">
                  <x-inputs-input
                    v-on="on"
                    v-show="switchName"
                    :input="evaluation.displayName"
                    @updateInput="($event) => evaluation.displayName = $event"
                    :append-outer-icon="$t('help.icon')"
                    :label="$t('Views.Evaluations.stepOverview.input_display_name')"
                    :rules="switchName ? 'required' : ''"
                    autofocus
                    light
                    name="poll_name"
                    :help-message="$t('help.engagement.create.displayName')"
                  ></x-inputs-input>
                </template>
                <span>{{ $t('Views.Evaluations.stepOverview.tooltip_input_display_name') }}</span>
              </v-tooltip>
            </v-col>
            <!-- Load/Update Participants Reminder -->
            <v-col cols="12" sm="8" class="pt-5 caption primary--text">
              {{ $t('help.engagement.create.remember_load_update_collaborators') }}
            </v-col>
            <!-- Engagement Participant Count -->
            <v-col cols="12" sm="4" v-if="totalReceptors" class="text-right headline">
              {{ $t('Views.Evaluations.create.total_receptors', {n: `${totalReceptors}`}) }}
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
                class="white--text"
                type="submit"
                large
                block
              >{{ $t(nextAction) }}
              </v-btn>
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
    totalReceptors: [Object, Number],
    evaluation: Object,
    step: String,
    nextAction: String,
    prevAction: String,
    autoSwitchName: Boolean
  },
  data () {
    return {
      switchName: false
    }
  },
  watch: {
    autoSwitchName () {
      this.switchName = this.autoSwitchName
    }
  },
  methods: {
    changeStep (isBack = false) {
      if (!this.switchName) {
        this.evaluation.displayName = ''
      }
      this.$emit('changeStep', this.evaluation, isBack ? +this.step - 1 : +this.step + 1)
    }
  }
})
</script>
