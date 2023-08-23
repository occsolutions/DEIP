<template>
  <v-row row justify-center>
    <v-dialog
      v-model="dialog"
      fullscreen
      hide-overlay
    >
      <v-card>
        <v-container fluid style="height: 100vh;">
          <v-row justify="center" align-content="center" align="center" class="fill-height">
            <v-col
              cols="12"
              class="text-center grey--text text--darken-1"
            >
              <img :src="icon" width="220"/>

              <h2 class="mt-5 error--text" :class="{'display-1': $vuetify.breakpoint.xsOnly, 'display-2': $vuetify.breakpoint.smAndUp}">{{ text }}</h2>
              <v-btn
                v-if="button"
                @click="goBack()"
                class="mt-4"
                color="primary"
                large
              >{{ $t('input.back') }}</v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import Vue from 'vue'

export default Vue.extend({
  props: {
    dialog: Boolean,
    icon: String,
    text: String,
    button: {
      type: Boolean,
      default: false,
      optional: true
    }
  },
  methods: {
    goBack () {
      this.$router.go(-1)
    }
  }
})
</script>
