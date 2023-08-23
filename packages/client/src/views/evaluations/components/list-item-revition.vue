
<template>
  <v-list-item>
    <v-list-item-action v-if="icon">
      <v-icon>{{ icon }}</v-icon>
    </v-list-item-action>
    <v-list-item-content>
      <v-list-item-title>
        <h6 class="title">{{ title }}</h6>
      </v-list-item-title>
      <v-list-item-subtitle class="grey--text subheading" v-if="subTitle">
        {{ subTitle }}
      </v-list-item-subtitle>
    </v-list-item-content>
  </v-list-item>
</template>

<script>
import Vue from 'vue'

export default Vue.extend({
  props: {
    icon: String,
    title: {
      type: String,
      required: true
    },
    subTitle: String
  }
})
</script>
