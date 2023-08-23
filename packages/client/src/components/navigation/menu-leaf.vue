
<template>
  <v-list-item
    :to="endPath"
    :href="endGoTo"
    :class="{ 'x-list-leaf': !onRoot }"
    style="background-color: #3b3b3b !important"
  >
    <v-list-item-action>
      <v-icon>{{ icon }}</v-icon>
    </v-list-item-action>
    <v-list-item-content>
      <v-list-item-title>{{ $t(`Components.Navigation.${title}`) }}</v-list-item-title>
    </v-list-item-content>
  </v-list-item>
</template>

<script>

import Vue from 'vue'

export default Vue.extend({
  props: {
    icon: String,
    title: String,
    path: String,
    onRoot: Boolean,
    goto: String,
    gotoHost: Object
  },
  computed: {
    endPath () {
      return !this.goto || !this.gotoHost[this.goto] ? this.path : ''
    },
    endGoTo () {
      return this.goto && this.gotoHost[this.goto] ? `${this.gotoHost[this.goto]}${this.path}` : ''
    }
  }
})
</script>

<style scoped>
.x-list-leaf {
  padding-left: 32px !important;
}
</style>
