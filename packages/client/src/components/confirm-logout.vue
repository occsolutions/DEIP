
<template>
  <v-dialog
    v-model="show"
    persistent
    max-width="370px">
    <v-card>
      <v-card-title class="pt-1 pb-0 px-3">
        {{ $t('auth.close_session') }}
      </v-card-title>
      <v-card-text class="pt-10 pb-12 text-center">
        {{ $t('auth.confirm_logout') }}
      </v-card-text>
      <v-card-actions class="pt-0">
        <v-spacer></v-spacer>
        <v-btn :disabled="loading" @click="cancel()">
          {{ $t('Components.ConfirmationModal.input_cancel') }}
        </v-btn>
        <v-btn
          color="error"
          :loading="loading"
          @click="confirm()"
        >
          {{ $t('auth.close_session') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>

import Vue from 'vue'

export default Vue.extend({
  props: {
    show: Boolean
  },
  data () {
    return {
      loading: false
    }
  },
  methods: {
    confirm () {
      this.loading = true
      this.$store.dispatch('session/signOut')
        .then(() => this.$router.push('/auth/sign-in'))
    },
    cancel () {
      this.$emit('close')
    }
  }
})
</script>
