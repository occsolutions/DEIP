
<template>
  <v-app>
    <v-content>
      <v-container fill-height>
        <v-row align-center justify-center row>
          <v-col cols="12" class="text-center" :class="{'my-2': $vuetify.breakpoint.xsOnly}">
            <img class="hidden-xs-only" src="img/20200301_occ_solution_logo.png" alt="OCC - Solutions logo" style="width: 250px;"/>
            <img class="hidden-sm-and-up" src="img/20200301_occ_solution_logo.png" alt="OCC - Solutions logo" style="width: 130px;"/>
            <div><slot name="image"></slot></div>
            <div class="text-right">
              <slot name="content"></slot>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-content>
    <x-alert :alert="alert"></x-alert>
  </v-app>
</template>

<script>

import Vue from 'vue'

import { mapState } from 'vuex'

export default Vue.extend({
  computed: {
    ...mapState({
      alert: (state) => state.alert
    })
  }
})
</script>
