
<template>
  <v-chip
    :label="label"
    :outlined="outlined"
    :color="status ? 'success' : 'error'"
    :class="classes || 'pa-4 subheading'"
  >
    <span v-if="status"><v-icon>mdi-check</v-icon></span>
    <span v-else><v-icon>mdi-close</v-icon></span>
    <span v-if="status">{{ $t('active') }}</span>
    <span v-else>{{ $t('inactive') }}</span>
  </v-chip>
</template>

<script>

import Vue from 'vue'

export default Vue.extend({
  props: {
    label: Boolean,
    outlined: Boolean,
    status: Boolean,
    classes: String
  }
})
</script>
