
<template>
  <div>
    <validation-provider :rules="rules" v-slot="{ errors }" :vid="vid">
      <v-text-field
        v-model="value"
        :prepend-inner-icon="prependInnerIcon"
        :append-outer-icon="appendOuterIcon"
        :label="label"
        :autofocus="autofocus"
        :name="name || label"
        :type="type"
        :error-messages="errors[0]"
        :error="!!errors[0]"
        @click:append-outer="$store.dispatch('help/display', helpMessage)"
        :light="light"
        :disabled="disabled"
        v-show="show"
        :color="color"
        :background-color="backgroundColor"
        @keypress.enter="keyPressEnter"
        @blur="blur"
        :hide-details="hideDetails"
        :single-line="singleLine"
        :solo="solo"
        :flat="flat"
        :style="inputStyle"
        :class="inputClass"
      >
      <template v-slot:message="props">
        <span>{{ props.message | errorField(name, label) }}</span>
      </template>
      </v-text-field>
    </validation-provider>
  </div>
</template>

<script>
import Vue from 'vue'

export default Vue.extend({
  props: {
    input: [String, Number, Boolean],
    rules: String,
    prependInnerIcon: String,
    appendOuterIcon: String,
    helpMessage: Object,
    label: String,
    name: String,
    type: String,
    autofocus: Boolean,
    light: Boolean,
    disabled: Boolean,
    vid: String,
    color: String,
    backgroundColor: String,
    onKeypressEnter: Function,
    onBlur: Function,
    show: {
      type: Boolean,
      default: true
    },
    hideDetails: Boolean,
    singleLine: Boolean,
    solo: Boolean,
    flat: Boolean,
    inputStyle: String,
    inputClass: String
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
    blur () {
      if (this.onBlur) {
        this.onBlur()
      }
    },
    keyPressEnter () {
      if (this.onKeypressEnter) {
        this.$emit('onKeypressEnter')
      }
    }
  }
})
</script>
