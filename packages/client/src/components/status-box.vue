
<template>
  <v-chip small label outline :color="statusMap[status].color">
    <strong>{{ statusMap[status].label }}</strong>
  </v-chip>
</template>

<script>

import Vue from 'vue'

export default Vue.extend({
  props: {
    status: {
      type: [String, Boolean],
      required: true
    },
    statusMap: {
      type: Object,
      required: true
    }
  }
})
</script>
