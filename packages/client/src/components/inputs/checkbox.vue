
<template>
  <div>
    <validation-provider :rules="rules" v-slot="{ errors }">
      <v-checkbox
        v-model="value"
        :label="label"
        :error-messages="errors[0]"
        :error="!!errors[0]"
        :name="name || label"
        :light="light"
        :disabled="disabled"
      >
        <template v-slot:message="props">
          <span>{{ props.message | errorField(name, label) }}</span>
        </template>
      </v-checkbox>
    </validation-provider>
  </div>
</template>

<script>
import Vue from 'vue'

export default Vue.extend({
  props: {
    input: Boolean,
    rules: String,
    label: String,
    name: String,
    type: String,
    light: Boolean,
    disabled: Boolean
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
    }
  }
})
</script>
