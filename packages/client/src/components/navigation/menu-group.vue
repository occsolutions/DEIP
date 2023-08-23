
<template>
  <v-list-group
    :class="{'x-list-group': !onRoot}"
    :value="open"
    :prepend-icon="icon"
    :sub-group="!onRoot"
    :style="styleData"
  >
    <v-list-item slot="activator">
      <v-list-item-title>{{ $t(`navigation.${title}`) }}</v-list-item-title>
    </v-list-item>

    <template v-for="groupOrChild in child">
      <x-menu-group
        v-if="groupOrChild.child"
        :key="groupOrChild.title"
        :title="groupOrChild.title"
        :icon="groupOrChild.icon"
        :child="groupOrChild.child"
        :goto="groupOrChild.goto"
        :goto-host="gotoHost"
        :level="level + 1"
      >
      </x-menu-group>
      <x-menu-leaf
        v-else
        :key="groupOrChild.title"
        :title="groupOrChild.title"
        :path="groupOrChild.path"
        :icon="groupOrChild.icon"
        :goto="groupOrChild.goto"
        :goto-host="gotoHost"
      >
      </x-menu-leaf>
    </template>
  </v-list-group>
</template>

<script>

import Vue from 'vue'

import MenuLeaf from './menu-leaf.vue'

export default Vue.extend({
  name: 'x-menu-group',
  props: {
    open: Boolean,
    icon: String,
    title: String,
    child: Array,
    onRoot: Boolean,
    goto: String,
    gotoHost: Object,
    level: {
      type: Number,
      default: 0
    }
  },
  components: {
    XMenuLeaf: MenuLeaf
  },
  data () {
    return {
      styleData: {
        backgroundColor: '#3b3b3b !important',
        paddingLeft: this.onRoot ? 'inherit' : (18 * this.level) + 'px'
      }
    }
  }
})
</script>

<style>
.x-list-group .v-list-group__header {
  padding-left: 16px !important;
}
.x-list-group .v-list__group__header--sub-group {
  transition: none !important;
}
.x-list-group {
  padding-left: 16px;
}
.v-list-item .theme--dark {
  padding: 0 !important;
  display: contents !important;
}
</style>
