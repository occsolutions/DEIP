
<template>
  <v-app>
    <v-row no-gutters class="grey lighten-3">
      <v-col cols="12">
        <router-view />
      </v-col>
    </v-row>
  </v-app>
</template>

<script>
import Vue from 'vue'

export default Vue.extend({
  data () {
    return {}
  }
})
</script>
