
<template>
  <div>
    <validation-provider :rules="rules" v-slot="{ errors }">
      <v-select
        :items="items"
        v-model="value"
        :attach="attach"
        :chips="chips"
        :multiple="multiple"
        :prepend-inner-icon="prependInnerIcon"
        :append-outer-icon="appendOuterIcon"
        :label="label"
        :autofocus="autofocus"
        :name="name || label"
        :error-messages="errors[0]"
        :error="!!errors[0]"
        @click:append-outer="$store.dispatch('help/display', helpMessage)"
        :light="light"
        :disabled="disabled"
        @change="change"
      >
        <template v-slot:message="props">
          <span>{{ props.message | errorField(name, label) }}</span>
        </template>
      </v-select>
    </validation-provider>
  </div>
</template>

<script>
import Vue from 'vue'

export default Vue.extend({
  props: {
    items: Array,
    input: [String, Number, Array],
    attach: Boolean,
    chips: Boolean,
    multiple: Boolean,
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
    onChange: Function
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
    change () {
      this.onChange()
    }
  }
})
</script>
