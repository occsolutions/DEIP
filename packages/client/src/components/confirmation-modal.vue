
<template>
  <v-dialog
    v-model="show"
    persistent
    max-width="560px">
    <v-card>
      <v-toolbar light flat>
        <v-toolbar-title>{{ title }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn icon light @click="hideModal">
            <v-icon>close</v-icon>
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <v-card-text>
        <div class="text-center">
          <slot name="question"></slot>
        </div>
        <div v-if="!reversible">
          <div class="mt-9 mb-5 body-2 text-center red--text">
            {{ $t('Components.ConfirmationModal.no_reversible_msg') }}
          </div>
        </div>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="hideModal">
          <v-icon v-if="icon && $vuetify.breakpoint.smAndUp">close</v-icon>&nbsp;{{ $t('Components.ConfirmationModal.input_cancel') }}
        </v-btn>
        <x-async-btn
          :color="color"
          class="white--text"
          :action="confirm"
        ><v-icon v-if="icon && $vuetify.breakpoint.smAndUp">{{ icon }}</v-icon>&nbsp;{{ btnSave || $t('Components.ConfirmationModal.input_save') }}
        </x-async-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>

import Vue from 'vue'

export default Vue.extend({
  props: {
    show: Boolean,
    reversible: Boolean,
    title: String,
    icon: String,
    action: Function,
    color: {
      type: String,
      default: 'primary'
    },
    btnSave: String
  },
  methods: {
    confirm () {
      return this.action()
        .then(() => this.hideModal())
    },
    hideModal () {
      this.$emit('close')
    }
  }
})
</script>
