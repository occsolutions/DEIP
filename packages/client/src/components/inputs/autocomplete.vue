
<template>
  <div>
    <validation-provider :rules="rules" v-slot="{ errors }">
      <v-autocomplete
        :items="items"
        v-model="value"
        :light="light"
        :label="label"
        :name="name || label"
        :append-outer-icon="appendOuterIcon"
        @click:append-outer="$store.dispatch('help/display', helpMessage)"
        :disabled="disabled"
        :error-messages="errors[0]"
        :error="!!errors[0]"
        :clearable="clearable"
        @change="change"
        :persistent-hint="persistentHint"
        :messages="messages"
        :color="color"
        :background-color="backgroundColor"
        :filled="filled"
        v-bind:style="bindStyle"
        :readonly="readonly"
        :return-object="returnObject"
        :multiple="multiple"
        :outlined="outlined"
        :chips="chips"
      >
        <template v-slot:message="props">
          <span>{{ props.message | errorField(name, label) }}</span>
        </template>
      </v-autocomplete>
    </validation-provider>
  </div>
</template>

<script>
import Vue from 'vue'

export default Vue.extend({
  props: {
    items: Array,
    light: Boolean,
    input: [String, Number, Array, Object],
    rules: String,
    disabled: Boolean,
    appendOuterIcon: String,
    helpMessage: Object,
    label: String,
    name: String,
    type: String,
    autofocus: Boolean,
    clearable: Boolean,
    onChange: Function,
    persistentHint: Boolean,
    messages: String,
    color: String,
    backgroundColor: String,
    filled: Boolean,
    bindStyle: String,
    readonly: Boolean,
    returnObject: Boolean,
    multiple: Boolean,
    outlined: Boolean,
    chips: Boolean
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
      if (this.onChange) {
        this.onChange()
      }
    }
  }
})
</script>
