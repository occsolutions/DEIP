
<template>
  <v-row row wrap>
    <v-col cols="5">
      <h3 class="text-center">{{ availableLabel }}</h3>
      <v-list class="scrollable-list py-0">
        <template v-for="item in availableItems">
          <v-list-item
            :class="{ 'selected': item === focusedAvailableItem }"
            :key="item.text"
            ripple
            @click="focusedAvailableItem = item"
            @dblclick.native="addToSelection"
          >
            {{ item.text }}
          </v-list-item>
        </template>
      </v-list>
    </v-col>

    <v-col cols="2" pa-2>
      <v-row align-center fill-height row wrap>
        <v-col cols="12">
          <v-btn
            block
            @click="addToSelection"
            :disabled="!focusedAvailableItem"
          >
            <span v-if="$vuetify.breakpoint.smAndUp">
              Agregar
            </span>
            <v-icon>keyboard_arrow_right</v-icon>
          </v-btn>
          <v-btn
            block
            @click="removeFromSelection"
            :disabled="!focusedSelectedItem"
          >
            <v-icon>keyboard_arrow_left</v-icon>
            <span v-if="$vuetify.breakpoint.smAndUp">
              Quitar
            </span>
          </v-btn>
        </v-col>
        <v-col cols="12" v-if="sortable">
          <v-btn
            block
            @click="moveItemUp"
            :disabled="!focusedSelectedItem"
          >
            <span v-if="$vuetify.breakpoint.smAndUp">
              Arriba
            </span>
            <v-icon v-if="$vuetify.breakpoint.xsOnly">
              keyboard_arrow_up
            </v-icon>
          </v-btn>
          <v-btn
            block
            @click="moveItemDown"
            :disabled="!focusedSelectedItem"
          >
            <span v-if="$vuetify.breakpoint.smAndUp">
              Abajo
            </span>
            <v-icon v-if="$vuetify.breakpoint.xsOnly">
              keyboard_arrow_down
            </v-icon>
          </v-btn>
        </v-col>
        <v-col cols="12" v-if="defaultAvailableItems && defaultSelectedItems">
          <v-btn
            block
            @click="reset"
          >
            Por defecto
          </v-btn>
        </v-col>
      </v-row>
    </v-col>

    <v-col cols="5">
      <h3 class="text-center">{{ selectedLabel }}</h3>
      <v-list class="scrollable-list py-0">
        <template v-for="item in selectedItems">
          <v-list-item-title
            :class="{ 'selected': item === focusedSelectedItem }"
            :key="item.text"
            ripple
            @click="focusedSelectedItem = item"
            @dblclick.native="removeFromSelection"
          >
            {{ item.text }}
          </v-list-item-title>
        </template>
      </v-list>
    </v-col>
  </v-row>
</template>

<script>

import Vue from 'vue'

export default Vue.extend({
  props: {
    allItems: {
      type: Array,
      required: true
    },
    initialSelection: {
      type: Array,
      default: () => []
    },
    sortable: Boolean,
    defaultAvailableItems: Array,
    defaultSelectedItems: Array,
    availableLabel: String,
    selectedLabel: String
  },

  data () {
    return {
      availableItems: [],
      selectedItems: [],
      focusedAvailableItem: null,
      focusedSelectedItem: null
    }
  },

  created () {
    this.allItems.forEach((item) => {
      const available = this.initialSelection.find((it) => it.text === item.text) === undefined
      if (available) {
        this.availableItems.push(item)
      } else {
        this.selectedItems.push(item)
      }
    })

    this.focusedAvailableItem = this.availableItems[0]
    this.focusedSelectedItem = this.selectedItems[0]
  },

  methods: {
    addToSelection () {
      this.selectedItems.push(this.focusedAvailableItem)

      const idx = this.availableItems.indexOf(this.focusedAvailableItem)
      this.availableItems.splice(idx, 1)

      this.focusedAvailableItem = this.availableItems[Math.min(idx, this.availableItems.length - 1)]

      this.$emit('change', this.selectedItems)
    },
    removeFromSelection () {
      this.availableItems.push(this.focusedSelectedItem)

      const idx = this.selectedItems.indexOf(this.focusedSelectedItem)
      this.selectedItems.splice(idx, 1)

      this.focusedSelectedItem = this.selectedItems[Math.min(idx, this.selectedItems.length - 1)]

      this.$emit('change', this.selectedItems)
    },
    moveItemDown () {
      const idx = this.selectedItems.indexOf(this.focusedSelectedItem)
      if (this.selectedItems.length > idx + 1) {
        this.$set(this.selectedItems, idx, this.selectedItems[idx + 1])
        this.$set(this.selectedItems, idx + 1, this.focusedSelectedItem)

        this.$emit('change', this.selectedItems)
      }
    },
    moveItemUp () {
      const idx = this.selectedItems.indexOf(this.focusedSelectedItem)
      if (idx > 0) {
        this.$set(this.selectedItems, idx, this.selectedItems[idx - 1])
        this.$set(this.selectedItems, idx - 1, this.focusedSelectedItem)

        this.$emit('change', this.selectedItems)
      }
    },
    reset () {
      this.availableItems = this.defaultAvailableItems.slice()
      this.selectedItems = this.defaultSelectedItems.slice()

      this.$emit('change', this.selectedItems)
    }
  }
})
</script>

<style>
  .selected {
    background: #2E6B9C;
    color: white;
  }
  .scrollable-list {
    height: 350px;
    overflow-y: scroll;
    border: 1px black solid;
  }
  .scrollable-list .v-list__tile {
    min-height: 38px;
    height: auto !important;
    padding: 8px;
  }
</style>

<style scoped>
  .v-btn {
    min-width: 36px;
  }
</style>
