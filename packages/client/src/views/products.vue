<template>
  <v-container>
    <v-card flat class="text-center" :style="$route.params.product === 'pulse' ? 'margin-top: 10em' : 'margin-top: 3em'">
      <img :src="$route.params.product === 'dml' ? `/img/logo_${$route.params.product}360.png` : `/img/logo_${$route.params.product}.png`" style="max-width: 60%">
    </v-card>
  </v-container>
</template>

<script>

import Vue from 'vue'

export default Vue.extend({
  components: {},
  data () {
    return {}
  },
  computed: {},
  watch: {},
  methods: {}
})
</script>
