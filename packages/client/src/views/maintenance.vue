
<template>
  <v-app>
    <v-main>
      <v-container fill-height>
        <v-row align-center justify-center row>
          <v-col
            cols="12"
            :class="{'my-2': $vuetify.breakpoint.xsOnly}"
            style="position: relative;"
          >
            <div
              class="text-center text-uppercase"
              :style="stylingTitle"
              :class="classingTitle"
            >
              {{ $t('maintenance') }}
            </div>

            <img src="static/img/en-construccion.png" alt="Building" style="width: 100%;"/>

            <div
              class="headline"
              :style="stylingText"
              v-html="$t('maintenance_text')"
            ></div>
            <v-btn class="mt-3" color="primary" to="/">{{ $t('input.back_home') }}</v-btn>
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
  computed: {
    ...mapState({
      alert: (state) => state.alert
    }),
    stylingTitle () {
      return this.$vuetify.breakpoint.name === 'xs' ? '' : 'position: absolute; top: 70px'
    },
    classingTitle () {
      return this.$vuetify.breakpoint.name === 'xs' ? 'title mb-3' : 'display-2'
    },
    stylingText () {
      return this.$vuetify.breakpoint.name === 'xs' ? 'text-align: center;' : 'position: absolute; top: 150px'
    }
  },
  methods: {

  }
})
</script>
