
<template>
  <x-status-box :status="availability" :statusMap="statusMap"></x-status-box>
</template>

<script>

import Vue from 'vue'

export default Vue.extend({
  props: {
    availability: String
  },
  data () {
    return {
      statusMap: {
        assigned: {
          color: 'orange',
          label: 'Asignado'
        },
        available: {
          color: 'green',
          label: 'Disponible'
        }
      }
    }
  }
})
</script>
