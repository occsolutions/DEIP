<template>
  <v-app>
    <v-main>
      <v-container style="backgorund-coler: grey;">
        <v-card class="mt-10" flat>
          <v-row align="center" justify="center">
            <v-col cols="9" class="mb-12" align="center">
              <img class="hidden-xs-only" src="/img/20200301_occ_solution_logo.png" alt="OCC - Solutions Logo" style="width: 30em;"/>
              <img class="hidden-sm-and-up" src="/img/20200301_occ_solution_logo.png" alt="OCC - Solutions Logo" style="width: 250px;"/>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" align="center">
              <p class="display-1">
                {{ $t('Views.Errors.requireProduct.no_permissions') }}
              </p>
              <span class="headline">
                {{ $t('Views.Errors.requireProduct.ask_permissions') }}
              </span>
              <v-textarea
                :label="$t('Views.Errors.requireProduct.message')"
                no-resize
                v-model="message"
                light
              />
            </v-col>
            <v-col cols="12" align="end">
              <v-btn
                class="mr-3"
                @click="goSuite"
              >
                {{ $t('Views.Errors.requireProduct.go_suite') }}
              </v-btn>
              <v-btn
                color="primary"
                @click="sendMessage"
              >
                {{ $t('Views.Errors.requireProduct.send_message') }}
              </v-btn>
            </v-col>
          </v-row>
        </v-card>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import Vue from 'vue'

import { mapState } from 'vuex'

import customersService from '../../services/customers'

export default Vue.extend({
  data () {
    return {
      message: '',
      suite: null
    }
  },
  computed: {
    ...mapState({
      user: (state) => state.session.user
    })
  },
  methods: {
    sendMessage () {
      if (this.message) {
        return customersService.requestProduct(this.message, 'POR')
          .then(() => this.goSuite())
      }
    },
    goSuite () {
      this.$store.dispatch('session/getSuiteWebHost')
        .then((res) => {
          if (res) {
            location.replace(`${res}/`)
          } else {
            this.$router.push('/404')
          }
        })
    }
  }
})
</script>
