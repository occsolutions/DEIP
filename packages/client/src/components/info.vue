
<template>
  <v-alert
    :value="showAlert"
    type="info"
    color="cyan darken-2"
    v-bind:style="styleWidth"
  > {{ text }}
  </v-alert>
</template>

<script>

import Vue from 'vue'

export default Vue.extend({
  props: {
    show: {
      type: Boolean,
      default: true
    },
    width: {
      type: Number,
      default: 100
    },
    text: String
  },
  data: () => ({
    showAlert: true
  }),
  what: {
    show () {
      this.showAlert = this.show
    }
  },
  computed: {
    styleWidth () {
      return {
        width: `${this.width}%`
      }
    }
  }
})
</script>
