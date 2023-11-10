
<template>
  <v-dialog
    v-model="showDialog"
    fullscreen
    persistent
    no-click-animation
  >
    <v-container fluid fill-height style="background-color: white;">
      <v-layout class="fill-height layout" column>
        <v-flex>
          <!-- Void -->
        </v-flex>
        <div class="text-center mx-n3 pt-6 px-6" style="background-color: white;">

          <img src="/img/actual-culture-img4.png" width="200"/>

          <h2
            class="mt-5 success--text"
            :class="{
              'display-1': $vuetify.breakpoint.xsOnly,
              'display-2': $vuetify.breakpoint.smAndUp
            }"
          >
            {{ $t('Views.Evaluations.evaluation.evaluation_completed') }}
          </h2>
        </div>
        <v-flex>
          <!-- Void -->
        </v-flex>
      </v-layout>
    </v-container>
  </v-dialog>
</template>

<script>
import Vue from 'vue'

export default Vue.extend({
  props: {
    lang: String,
    showDialog: Boolean
  },
  data () {
    return {
      //
    }
  },
  computed: {
    //
  },
  watch: {
    //
  },
  methods: {
    //
  }
})
</script>
