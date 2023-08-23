
<template>
    <v-menu
      :nudge-width="296"
      :nudge-bottom="35"
      :nudge-left="160"
      transition="slide-y-transition"
    >
      <template v-slot:activator="{ on }">
        <v-btn
          text
          v-on="on"
        >
          <v-icon large>mdi-apps</v-icon>
        </v-btn>
      </template>
      <v-card style="max-width: 22.7em">
        <v-row>
          <template v-for="item in products">
            <v-col cols="6" :key="item.name" style="cursor: pointer">
              <a :href="item.url">
                <img :src="item.logo || item.defaultLogo"
                  alt="System Logo"
                  style="max-width: 150px"
                />
              </a>
            </v-col>
          </template>
        </v-row>
      </v-card>
    </v-menu>
</template>

<script>

import Vue from 'vue'
import { mapState } from 'vuex'

import ProductsService from '../services/products'

export default Vue.extend({
  data () {
    return {
      products: []
    }
  },
  computed: {
    ...mapState({
      user: (state) => state.session.user
    })
  },
  watch: {
    $route (nextRoute) {
      this.$nextTick(() => this.updateGroups(nextRoute))
    }
  },
  created () {
    this.$store.dispatch('session/getDeipHost')
      .then(res => {
        this.host = res
        return this.$store.dispatch('session/getSuiteWebHost')
      })
      .then(res => {
        if (res) {
          this.$set(this, 'suiteWeb', res)
        }
        return this.getProducts()
      })
      .then(() => {
        this.products.unshift({
          name: 'OCC SUITE',
          logo: `${this.suiteWeb}/img/20200301_occ_solution_logo.png`,
          url: this.suiteWeb
        })
        if (this.host && this.host.reference) {
          const por = this.products.find(prod => prod.id === this.host.reference)
          if (por) {
            this.products.splice(this.products.indexOf(por), 1)
          }
        }
      })
  },
  methods: {
    getProducts () {
      if (this.user.role === 'admin' && this.user.role === this.user.view) {
        return ProductsService.listActive()
          .then(res => { this.products = res })
      } else if (this.user.role === 'customer' || this.user.view === 'customer') {
        return ProductsService.listByCustomer()
          .then(res => { this.products = res })
      }
      return Promise.resolve([])
    }
  }
})
</script>
