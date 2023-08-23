
<template>
  <v-app>
    <v-main>
      <v-container style="backgorund-coler: grey;">
        <v-row align="center" justify="center">
          <v-col cols="9" class="mb-12">
            <img class="hidden-xs-only" src="/img/20200301_occ_solution_logo.png" alt="OCC - Solutions Logo" style="width: 50em;"/>
            <img class="hidden-sm-and-up" src="/img/20200301_occ_solution_logo.png" alt="OCC - Solutions Logo" style="width: 250px;"/>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <p class="display-2 text-center">
              {{ $t('errors.required_enterprise_p1') }}
              <br/> {{$t('errors.required_enterprise_p2')}}
            </p>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>

import Vue from 'vue'
import { mapState } from 'vuex'

export default Vue.extend({
  methods: {
    redirect () {
      this.$store.dispatch('session/getSuiteHost')
        .then((res) => {
          if (res && res.clientUrl) {
            let urlSuite = res.clientUrl
            if (res.clientPort && res.clientPort !== 80) {
              urlSuite = `${urlSuite}:${res.clientPort}`
            }
            location.replace(`${urlSuite}/enterprises`)
          } else {
            this.$router.push('/404')
          }
        })
    }
  },
  computed: {
    ...mapState({
      user: (state) => state.session.user
    })
  },
  created () {
    setTimeout(() => this.redirect(), 5000)
  }
})
</script>
