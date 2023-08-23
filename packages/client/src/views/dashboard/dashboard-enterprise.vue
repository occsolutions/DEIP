
<template>
  <v-container>
    <v-row>
      <v-col>
        <v-card>
          <v-toolbar dense class="mb-3 white--text" color="primary">
            <v-toolbar-title class="center--text">{{ $t('Views.Dashboard.enterprise.title') }}</v-toolbar-title>
          </v-toolbar>
          <v-card-text v-if="info.evaluations && info.evaluations.length">
            <v-row justify="center">
              <v-col cols="12" md="5" v-for="evaluation in info.evaluations" :key="evaluation._id">
                <v-card>
                  <v-toolbar dense class="mb-3">
                    <v-toolbar-title class="center--text">{{ evaluation.name }}</v-toolbar-title>
                  </v-toolbar>
                  <v-card-text>
                    <v-row>
                      <v-col md="6" xs="12" align="center">
                        <span> {{ $t('Views.Dashboard.enterprise.status') }} </span>
                      </v-col>
                      <v-col md="6" xs="12" align="center" class="hidden-xs-only">
                        <span> {{ $t('Views.Dashboard.enterprise.answers_percent') }} </span>
                      </v-col>
                      <v-col md="6" xs="12" align="center">
                        <v-chip
                          :color="evaluation.status === 'completed' ? 'success' : (evaluation.status === 'in_progress' ? 'primary' : 'warning')"
                          outlined
                        >
                          {{ $t(`Views.Dashboard.enterprise.status_${evaluation.status}`) }}
                        </v-chip>
                      </v-col>
                      <v-col md="6" xs="12" align="center" class="hidden-xs-only">
                        <v-progress-circular
                          :rotate="360"
                          :size="100"
                          :width="15"
                          :value="(evaluation.answers * 100) / evaluation.team"
                          color="primary"
                        >
                          {{ ((evaluation.answers * 100) / evaluation.team).toFixed(2) }}%
                        </v-progress-circular>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col xs="12" md="6">
                        {{ $t('Views.Dashboard.enterprise.team_members') }}
                        <v-chip outlined>
                          {{evaluation.team}}
                        </v-chip>
                      </v-col>
                      <v-col xs="12" md="6">
                        {{ $t('Views.Dashboard.enterprise.received') }}
                        <v-chip outlined>
                          {{evaluation.answers}}
                        </v-chip>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col align="center">
                        <v-btn
                          color="primary"
                          :to="`/evaluations/${evaluation.slug}/details`"
                          outlined
                          rounded
                          class="text-capitalize"
                        >
                          {{ $t('Views.Dashboard.enterprise.input_view_details') }}
                        </v-btn>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-btn color="primary" to="/evaluations" block>
                  {{ $t('Views.Dashboard.enterprise.go_list') }}
                </v-btn>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-text v-else>
            <v-row>
              <v-col align="center">
                <span class="headline">{{ $t('Views.Dashboard.enterprise.no_evaluation_culture') }} </span>
              </v-col>
            </v-row>
            <v-row>
              <v-col align="center">
                <v-btn
                  color="primary"
                  to="/evaluations/create"
                  outlined
                >
                  {{ $t('Views.Dashboard.enterprise.go_creation') }}
                </v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>

import Vue from 'vue'

export default Vue.extend({
  props: {
    info: Object
  }
})
</script>
