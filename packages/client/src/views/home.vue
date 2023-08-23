
<template>
  <v-container fluid grid-list-xl>
    <v-row>
      <v-col cols="12">
        <h4 class="display-1"> {{ $t('Views.Home.title') }} </h4>
      </v-col>
    </v-row>
    <v-row>
      <v-col align="center">
        <img :src="img" style="max-width: 100%; max-height: 900px;" alt="OCC - Solutions Logo"/>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import Vue from 'vue'

export default Vue.extend({
  data () {
    return {
      img: 'img/20200301_occ_solution_logo.png'
    }
  }
})
</script>
