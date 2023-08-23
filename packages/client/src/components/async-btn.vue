
<template>
  <v-btn
    :active-class="activeClass"
    :color="color"
    :block="block"
    :disabled="disabled"
    :large="large"
    :rounded="rounded"
    :outlined="outlined"
    :small="small"

    :loading="loading"
    @click.prevent="execute"
  ><slot/></v-btn>
</template>

<script>

import Vue from 'vue'

export default Vue.extend({
  props: {
    // v-btn most used props
    activeClass: String,
    color: {
      type: String,
      default: 'primary'
    },
    disabled: Boolean,
    large: Boolean,
    outlined: Boolean,
    small: Boolean,
    block: Boolean,
    rounded: Boolean,
    // own props
    action: {
      type: Function,
      required: true
    }
  },
  data () {
    return {
      loading: false
    }
  },
  methods: {
    execute () {
      const promise = this.action()
      if (Promise.resolve(promise) !== promise) {
        throw new Error('Action must return a promise')
      }

      this.loading = true
      promise
        .then(() => { this.loading = false })
        .catch((e) => {
          this.loading = false
          throw e
        })
    }
  }
})
</script>
