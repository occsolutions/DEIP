<template>
  <v-row>
    <v-col xs-9>
      <v-text-field
        v-model="color"
        light
        :outlined="outlined"
        :label="label"
        :name="name"
        prepend-icon="color_lens"
        @click="pickColor"
        :error-messages="errorMessages"
        :data-vv-as="dataVvAs"
      ></v-text-field>
    </v-col>
    <v-col xs-3>
      <div
        :style="{ background: color || initial }"
        style="width: 50%; height: 72%;"
        @click="pickColor"></div>
    </v-col>
    <input
      type="color"
      style="display: none"
      ref="color"
      @change="onColorChange"
    >
  </v-row>
</template>

<script>

import Vue from 'vue'

export default Vue.extend({
  props: {
    label: {
      type: String,
      required: true
    },
    value: {
      type: String,
      required: true
    },
    initial: {
      type: String,
      default: '#fff'
    },
    errorMessages: {
      type: Array,
      required: true
    },
    dataVvAs: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    outlined: Boolean
  },
  data () {
    return {
      color: null
    }
  },
  watch: {
    value: {
      handler () {
        this.color = this.value
      },
      immediate: true
    }
  },
  methods: {
    pickColor () {
      this.$refs.color.click()
    },
    onColorChange ($event) {
      this.color = $event.target.value
      this.$emit('colorChanged', this.color)
    }
  }
})
</script>
