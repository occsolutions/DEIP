
<template>
  <v-dialog
    v-model="showDialog"
    fullscreen
    persistent
    no-click-animation
  >
    <v-container fluid fill-height style="background-color: white;">
      <v-layout class="fill-height layout" column>
        <v-flex>
          <!-- Void -->
        </v-flex>
        <div class="text-center mx-n3 pt-6 px-6" style="background-color: white;">

          <img src="/img/actual-culture-img4.png" width="200"/>

          <h2
            class="mt-5 success--text"
            :class="{
              'display-1': $vuetify.breakpoint.xsOnly,
              'display-2': $vuetify.breakpoint.smAndUp
            }"
          >
            {{ $t('Views.Evaluations.evaluation.evaluation_completed') }}
          </h2>
          <p class="mt-10">
            {{ $t('Views.Evaluations.evaluation.endDialog.text_1') }}
          </p>
          <v-btn
            color="primary"
            class="py-5"
            @click="goToIndividualReport()"
          >
            {{ $t('Views.Evaluations.evaluation.endDialog.btn_report') }}
          </v-btn>

          <p class="mt-10 mb-0">
            {{
              alreadySent || sent
                ? $t('Views.Evaluations.evaluation.endDialog.text_3')
                : $t('Views.Evaluations.evaluation.endDialog.text_2')
            }}
          </p>
          <ValidationObserver>
            <ValidationProvider rules="required|email" v-slot="{valid}">
              <v-text-field
                v-model="email"
                :placeholder="$t('help.employee.create.email.title')"
                color="primary"
                class="mx-auto"
                style="max-width: 370px;"
              >
                <template v-slot:append>
                  <v-btn tile
                    color="primary"
                    class="ma-0"
                    :disabled="!valid"
                    @click="sendEmail()"
                  >
                    {{
                      alreadySent || sent
                        ? $t('Views.Evaluations.evaluation.endDialog.btn_resend')
                        : $t('Views.Evaluations.evaluation.endDialog.btn_send')
                    }}
                  </v-btn>
                </template>
              </v-text-field>
            </ValidationProvider>
          </ValidationObserver>
          <br>
        </div>
        <v-flex>
          <!-- Void -->
        </v-flex>
      </v-layout>
    </v-container>
  </v-dialog>
</template>

<script>
import Vue from 'vue'
import evaluationsService from '../../../services/evaluations'

export default Vue.extend({
  props: {
    lang: String,
    evaluatedEmployee: Object,
    sentEmail: String,
    showDialog: Boolean
  },
  data () {
    return {
      email: '',
      individualReportRoute: this.$router.resolve({
        name: 'individualResults'
      }),
      sent: false
    }
  },
  computed: {
    alreadySent () {
      return this.sentEmail !== ''
    }
  },
  watch: {
    alreadySent (val) {
      this.email = val ? this.sentEmail : ''
    }
  },
  methods: {
    goToIndividualReport () {
      window.open(this.individualReportRoute.href, '_blank')
    },
    sendEmail () {
      this.$store.dispatch('loading/show')
      const evaluatedName = `${this.evaluatedEmployee.employeeEnterprise.firstName} ${this.evaluatedEmployee.employeeEnterprise.lastName}`
      evaluationsService.sendIndividualResultsEmail(this.$route.params.tokenId, {
        lang: this.lang,
        email: this.email,
        subject: this.$t('Views.Evaluations.evaluation.endDialog.email_subject'),
        name: evaluatedName,
        body: this.$t('Views.Evaluations.evaluation.endDialog.email_body'),
        url: this.individualReportRoute.href
      })
        .then(() => {
          this.$store.dispatch('loading/hide')
          this.sent = true
          this.$store.dispatch('alert/success', this.$t('Views.Evaluations.evaluation.endDialog.email_sent'))
        })
        .catch((err) => {
          this.$store.dispatch('loading/hide')
          this.$store.dispatch('alert/error', this.$t(`errors.${err.code}`))
        })
    }
  }
})
</script>
