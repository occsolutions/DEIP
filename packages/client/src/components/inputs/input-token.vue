
<template>
  <v-card elevation="4" height="36" style="border-radius:40px;" class="px-1">
    <v-row dense>
      <v-col cols="3" xs="12">
        <v-btn block icon small @click="minusQty">-</v-btn>
      </v-col>
      <v-col cols="6" xs="12" class="pa-0">
        <input
          v-model="value"
          type="number"
          step="1"
          style="inputQty"
          class="text-center inputQty title"
          oninput="validity.valid||(value='');"
          required
          block
          :min="min"
          :max="max"
          :disabled="disabled"
          :v-show="show"
          :color="color"
          :background-color="backgroundColor"
          @keypress.enter="keyPressEnter"
        >
      </v-col>
      <v-col cols="3" xs="12">
        <v-btn block icon small @click="plusQty">+</v-btn>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
import Vue from 'vue'

export default Vue.extend({
  props: {
    input: [String, Number],
    min: [String, Number],
    max: [String, Number],
    name: String,
    light: Boolean,
    disabled: Boolean,
    color: String,
    backgroundColor: String,
    onKeypressEnter: Function,
    show: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    value: {
      get () { return this.input },
      set (val) { this.setValue(val) }
    }
  },
  methods: {
    setValue (val) {
      this.$emit('updateInput', val)
    },
    keyPressEnter () {
      if (this.onKeypressEnter) {
        this.$emit('onKeypressEnter')
      }
    },
    plusQty () {
      if (this.value < this.max) {
        this.value++
      }
    },
    minusQty () {
      if (this.value > this.min) {
        this.value--
      }
    }
  }
})
</script>
<style scoped>
  /* Chrome, Safari, Edge, Opera */
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none !important;
    margin: 0 !important;
  }

  /* Firefox */
  input[type=number] {
    -moz-appearance:textfield;
  }

  .inputQty {
    width: 100%;
    height: 100%;
  }
</style>
