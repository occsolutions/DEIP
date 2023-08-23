
<template>
  <v-app>
    <v-main>
      <v-container style="backgorund-coler: grey;">
        <v-row align="center" justify="center">
          <v-col cols="12" class="text-center">
            <img class="hidden-xs-only" src="/img/20200301_occ_solution_logo.png" alt="OCC - Solutions Logo" style="width: 25em; height: 25em;"/>
            <img class="hidden-sm-and-up" src="/img/20200301_occ_solution_logo.png" alt="OCC - Solutions Logo" style="width: 250px;"/>
          </v-col>
        </v-row>
        <v-row align="center" justify="center">
          <v-col cols="12" class="mb-3 mt-4">
            <h2 class="display-2 text-center">{{ $t('Views.Operations.summary.title')}}</h2>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" class="text-center">
            <span class="display-1">
              {{
                $route.params.editCount
                  ? $t('Views.Operations.summary.workshop_update_cost')
                  : $t('Views.Operations.summary.workshop_cost')
              }}:
            </span>
            <span class="display-1">
              {{price}} {{ $t('Views.Operations.summary.token_unit') }}
            </span>
          </v-col>
          <v-col cols="12" class="text-center">
            <span class="display-1">{{ $t('Views.Operations.summary.your_balance') }} </span>
            <span class="display-1">
              {{balance}} {{ $t('Views.Operations.summary.token_unit') }}
            </span>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" class="text-center">
            <span>{{ $t('Views.Operations.summary.information') }}</span>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" class="text-center">
            <v-btn :href="operationsLink" color="primary">{{ $t('Views.Operations.summary.get_more_tokens') }}</v-btn>
          </v-col>
          <v-col cols="12" class="text-center">
            <span class="display-1">{{ $t('Views.Operations.summary.or') }}</span>
          </v-col>
          <v-col cols="12" class="text-center">
            <v-btn v-if="$route.params.type === 'individual'" @click="$router.push('/evaluations')" color="primary">{{ $t('Views.Operations.summary.go_to_evaluations_list') }}</v-btn>
            <v-btn v-else @click="$router.push('/evaluations')" color="primary">{{ $t('Views.Operations.summary.go_to_evaluations_list') }}</v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import Vue from 'vue'
import { mapState } from 'vuex'

import evaluationsService from '../../services/evaluations'

export default Vue.extend({
  data () {
    return {
      price: 0,
      balance: 0,
      operationsLink: '',
      type: ''
    }
  },
  computed: {
    ...mapState({
      user: (state) => state.session.user
    })
  },
  created () {
    this.$store.dispatch('loading/show')
    evaluationsService.checkBalance(this.$route.params.type)
      .then(res => {
        this.price = res.productService
        this.balance = res.balance
        if (this.$route.params.type === 'individual') {
          if (!this.$route.params.editCount) {
            return evaluationsService.getCountEvaluated(this.$route.params.slug)
          } else {
            return { count: this.$route.params.editCount }
          }
        }
        return { count: 1 }
      })
      .then((res) => {
        this.price = this.price * res.count
        this.$store.dispatch('loading/hide')
      })
    this.$store.dispatch('session/getSuiteWebHost')
      .then((res) => {
        if (res) {
          this.operationsLink = `${res}/tokens/operations`
        } else {
          this.$router.push('/404')
        }
      })
  }
})
</script>
