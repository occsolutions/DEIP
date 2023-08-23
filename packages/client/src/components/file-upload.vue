
<template>
  <div>
    <v-text-field hide-details
      :label="label"
      @click="pickFile"
      prepend-icon="mdi-attachment"
      :value="fileName"
      :name="name"
      readonly
      :append-outer-icon="help ? $t('help.icon') : ''"
      @click:append-outer="$store.dispatch('help/display', { title: help.title, text: help.text })"
    ></v-text-field>

    <ValidationProvider :rules="rules" v-slot="{ validate, errors }" :name="label">
      <div>
        <input type="file"
        style="display:none;"
        :ref="reff"
        :extensions="extensions.join()"
        @change="filePicked($event) || validate($event)">
        <p id="error" class="pl-8 error--text"><small>{{ errors[0] }}</small></p>
      </div>
    </ValidationProvider>
  </div>
</template>

<script>

import Vue from 'vue'

export default Vue.extend({
  props: {
    label: {
      type: String,
      required: true
    },
    reff: {
      type: String,
      required: true
    },
    extensions: {
      type: Array,
      required: true
    },
    value: {
      type: [String, File],
      required: true
    },
    name: {
      type: String,
      required: true
    },
    help: {
      type: Object,
      required: false
    },
    rules: {
      type: String,
      required: false
    }
  },
  data () {
    return {
      fileName: ''
    }
  },
  methods: {
    pickFile () {
      this.$refs[this.reff].click()
    },
    filePicked (e) {
      const { files } = e.target
      const file = files[0]

      if (file !== undefined) {
        const fr = new FileReader()
        fr.readAsDataURL(file)
        fr.addEventListener('load', () => {
          this.fileName = file.name
          this.$emit('file-picked', file)
        })
      } else {
        this.fileName = ''
      }
    }
  }
})
</script>
