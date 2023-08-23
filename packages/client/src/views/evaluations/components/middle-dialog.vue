
<template>
  <v-dialog
    v-model="show"
    fullscreen
    hide-overlay
  >
    <v-card>
      <v-container fluid>
        <v-row row wrap>
          <v-col cols="12"
            class="text-center grey--text text--darken-1"
            style="margin: 30px auto!important;"
          >
            <img src="/img/actual-culture-img4.png" width="220"/>
            <h2 class="display-3 mt-5 warning--text">{{ $t('Views.Evaluations.evaluation.middleDialog.middle') }}</h2>

            <v-row justify="center">
              <v-col cols="12">
                <v-btn
                  @click="close"
                  class="mt-4"
                  color="primary"
                  large
                >{{ $t('Views.Evaluations.evaluation.middleDialog.input_continue') }}</v-btn>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script>
import Vue from 'vue'

export default Vue.extend({
  props: {
    middleDialog: Boolean
  },
  data () {
    return {
      show: false
    }
  },
  watch: {
    middleDialog: {
      handler () {
        this.show = this.middleDialog
      },
      immediate: true
    }
  },
  methods: {
    close () {
      this.show = false
      this.$emit('close')
    }
  }
})
</script>
