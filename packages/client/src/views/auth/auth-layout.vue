
<template>
  <v-app>
    <v-main class="background">
      <v-container fill-height>
        <v-row align-center justify-center row :style="isRegisterPersonal ? 'padding-left: 10.5em; padding-top: 5em' : 'padding-left: 14em; padding-top: 5em;'">
          <v-col class="text-center" cols="12" sm="10" md="4" lg="8" :style="isRegisterPersonal ? 'height: 20%; max-width: 52em' : 'height: 20%; max-width: 45em'">
            <v-card class="elevation-12 mt-2 pt-6" outlined>
              <img :src="`http://${baseUrl}/img/20200301_occ_solution_logo.png`" alt="OCC - Solutions Logo" style="width: 35%; display:block; margin:auto;" />
              <v-card-text>
                <router-view />
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
    <x-alert :alert="alert"></x-alert>
  </v-app>
</template>

<script>
import { mapState } from 'vuex'
import Vue from 'vue'

export default Vue.extend({
  data () {
    return {
      changeClass: false,
      baseUrl: document.location.host,
      isRegisterPersonal: false
    }
  },
  computed: {
    ...mapState({
      alert: state => state.alert
    })
  },
  watch: {
    $route (to) {
      this.isRegisterPersonal = to.name === 'SignUpPersonal'
    }
  },
  created () {
    this.isRegisterPersonal = this.$route.name === 'SignUpPersonal'
  }
})
</script>
