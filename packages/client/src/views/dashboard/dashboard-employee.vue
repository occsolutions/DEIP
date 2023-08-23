<template>
  <v-row justify="center">
    <template v-if="info.length">
      <v-col align="center" xs="12" sm="4" v-for="(activity, k) in info" :key="k">
        <v-card>
          <v-toolbar dense class="mb-3">
            <v-toolbar-title class="text-capitalize center--text">{{ activity.evaluation.displayName || activity.evaluation.name }}</v-toolbar-title>
          </v-toolbar>
          <v-hover
            v-slot:default="{ hover }"
          >
            <v-row>
              <v-col cols="12" align="center">
                <v-progress-circular
                  :rotate="360"
                  :size="120"
                  :width="15"
                  :value="Math.floor(activity.score)"
                  color="primary"
                  class="around"
                  @click="$router.push(`/evaluations/por/${activity.token}`)"
                >
                  <span class="justify-center minipercentage" v-if="!hover"> {{ Math.floor(activity.score) }}% </span>
                  <p v-else>
                    <small color="rgb(56, 153, 218)" v-if="activity.score > 0 && activity.score < 100"> {{ $t('Views.Dashboard.employee.input_continue') }} <br> </small>
                    <small color="rgb(56, 153, 218)" v-else-if="activity.score === 0"> {{ $t('Views.Dashboard.employee.input_start') }} <br> </small>
                    <small color="rgb(56, 153, 218)" v-else> {{ $t('Views.Dashboard.employee.input_completed') }} <br></small>
                    <v-icon size="35" color="rgb(56, 153, 218)" v-if="activity.score < 100">play_arrow</v-icon>
                    <v-icon size="35" color="rgb(56, 153, 218)" v-else>fa-check</v-icon>
                  </p>
                </v-progress-circular>
              </v-col>
            </v-row>
          </v-hover>
          <v-row>
            <v-col class="px-8">
              <v-btn
                color="primary"
                @click="$router.push(`/evaluations/por/${activity.token}`)"
                block
              >
                {{ $t('Views.Dashboard.employee.input_reply') }}
              </v-btn>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </template>
    <v-col cols="12" align="centered" class="py-10" v-else>
      <h1 class="display-2 my-10 text-center" style="color: #90a4ae">
        {{ $t('Views.Dashboard.employee.no_pending_activities') }}
      </h1>
    </v-col>
  </v-row>
</template>

<script>

import Vue from 'vue'

export default Vue.extend({
  props: {
    info: {
      type: [Object, Array]
    }
  },
  data () {
    return {}
  }
})
</script>

<style lang="css" scoped>
.minipercentage{
  font-size: 2em !important;
}
</style>
