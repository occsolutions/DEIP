<template>
  <v-dialog fullscreen hide-overlay persistent no-click-animation
    v-model="show"
  >
    <v-card tile class="wellcome-dialog">
      <v-container fluid>
        <v-row row wrap>
          <v-col cols="12" class="mt-4 text-center grey--text text--darken-1">
            <section class="enterprise-logo">
              <img src="/img/20200301_occ_solution_logo.png" v-if="!evaluation.enterprise.logo"/>
              <img v-else :src="evaluation.enterprise.logo" alt="Enterprise Logo"/>
            </section>
            <br>
            <h2 class="mt-3 mx-3"
              :class="{
                'display-1': !$vuetify.breakpoint.xs,
                'headline': $vuetify.breakpoint.xs
              }"
              style="color: #42A5F5;"
            >
              {{ $t('Views.Evaluations.evaluation.information_1') }}
            </h2>
            <h3 class="my-7 mx-3"
              :class="{
                'display-2': !$vuetify.breakpoint.xs,
                'title': $vuetify.breakpoint.xs
              }"
              style="color: #42A5F5;"
            >
              {{ evaluation.displayName || evaluation.name }}
            </h3>
            <p class="mt-4 mx-5 px-5"
              v-html="$t('Views.Evaluations.evaluation.wellcomeDialog.wellcome_instructions', { deadline: this.deadLine })"
            ></p>
            <p class="mt-8 mx-5 px-5"
              v-html="$t('Views.Evaluations.evaluation.wellcomeDialog.must_accept_policy_to_continue')"
            ></p>
            <v-row>
              <!-- Policy Checkbox -->
              <v-col cols="12">
                <v-checkbox hide-details
                  v-model="acceptedPolicies"
                  :readonly="loading"
                  class="ma-0 mx-auto"
                  style="max-width: 350px;"
                >
                  <template v-slot:label>
                    <span class="d-inline-block pr-1">
                      {{ $t('Views.Evaluations.evaluation.wellcomeDialog.i_accept_the') }}
                    </span>
                    <a target="_blank"
                      :href="policyUrl"
                      @click.stop
                    >
                      {{ $t('Views.Evaluations.evaluation.wellcomeDialog.policy') }}
                    </a>
                  </template>
                </v-checkbox>
              </v-col>

              <!-- Begin Button -->
              <v-col cols="12">
                <v-btn large
                  class="mt-4"
                  color="primary"
                  :loading="loading"
                  :disabled="!acceptedPolicies"
                  @click="beginPoll()"
                >
                  {{ $t('Views.Evaluations.evaluation.wellcomeDialog.input_start_poll') }}
                </v-btn>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script>
import Vue from 'vue'
import evaluationsService from '../../../services/evaluations'

export default Vue.extend({
  props: {
    startDialog: Boolean,
    evaluation: Object
  },
  data () {
    return {
      policyUrl: process.env.VUE_APP_DEIP_POLICY_URL,
      loading: false,
      acceptedPolicies: false,
      deadLine: '',
      show: false
    }
  },
  watch: {
    startDialog: {
      handler () {
        this.show = this.startDialog
        if (this.startDialog) {
          this.setDeadLine()
        }
      },
      immediate: true
    }
  },
  methods: {
    setDeadLine () {
      const months = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']
      const [date, time] = this.evaluation.validUntil.split('T')
      const [year, month, day] = date.split('-')
      let [hour, min, sec] = time.split('.')[0].split(':')
      const ampm = hour >= 12 ? ' pm' : ' am'
      hour = (hour % 12) || 12
      this.deadLine = `${day} ${months[month - 1]} de ${year}, ${hour}:${min}:${sec} ${ampm}`
    },
    beginPoll () {
      this.loading = true
      evaluationsService.acceptPolicy(this.$route.params.tokenId, this.policyUrl)
        .then(() => {
          this.$emit('close')
        })
        .catch(err => {
          this.$store.dispatch('alert/error', this.$t(`errors.${err.code}`))
        })
        .finally(() => {
          this.loading = false
        })
    }
  }
})
</script>
