<template>
  <v-row row justify-center>
    <v-dialog
      v-model="loading.show"
      persistent
      fullscreen
      content-class="loading-dialog"
    >
      <v-container fill-height>
        <v-row row justify="center" align="center">
          <v-progress-circular
            :size="70"
            :width="7"
            color="primary"
            indeterminate
          ></v-progress-circular>
        </v-row>
      </v-container>
    </v-dialog>
  </v-row>
</template>

<script>
import Vue from 'vue'
import { mapState } from 'vuex'

export default Vue.extend({
  computed: {
    ...mapState({
      loading: state => state.loading || {}
    })
  }
})
</script>

<style>
  .loading-dialog {
    background-color: rgba(0, 0, 0, 0.5);
  }
</style>
