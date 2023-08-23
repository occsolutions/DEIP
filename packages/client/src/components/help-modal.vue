
<template>
  <v-dialog
    @keydown.esc="$store.dispatch('help/hide')"
    v-model="help.show"
    max-width="600px"
  >
    <v-card>
      <v-toolbar light flat>
        <v-toolbar-title>{{ help.title }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn icon light @click="hide">
            <v-icon>close</v-icon>
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>

      <v-card-text v-html="help.text" style="text-align:justify"></v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>

import Vue from 'vue'
import { mapState } from 'vuex'

export default Vue.extend({
  computed: {
    ...mapState({
      help: (state) => state.help
    })
  },
  methods: {
    hide () {
      this.$store.dispatch('help/hide')
    }
  }
})
</script>
