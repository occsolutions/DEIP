<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h4 class="display-1">
          {{ $t(`Views.Indices.${mode}.title`) }}
          <span v-if="editingGroup" class="display-1 font-italic">
            {{ $t(`Views.Indices.list.i_${editingGroup}`) }}
          </span>
        </h4>
      </v-col>
    </v-row>
    <v-card class="mt-2 pa-4">
      <!-- LIST -->
      <v-row v-if="mode === 'list'">
        <v-col>
          <x-data-table
            :headers="headers"
            :parent-fetch-data="getIndices"
            :options="options"
            :reload="reloadTable"
            no-data="Views.Indices.list.no_data"
            @offReload="offReload"
          >
            <template v-slot:structure="prop">
              <td class="text-left text-capitalize pt-3">
                {{ $t(`Views.Indices.list.i_${prop.item.name}`) }}
              </td>
              <td class="text-center pt-1" style="width: 17%;">
                <v-tooltip bottom color="primary">
                  <template v-slot:activator="{ on }">
                    <v-btn text icon
                      v-on="on"
                      @click="changeMode(prop.item.name)"
                    >
                      <v-icon small>fa-edit</v-icon>
                    </v-btn>
                  </template>
                  <span>{{ $t('Views.Indices.list.btn_edit') }}</span>
                </v-tooltip>
              </td>
            </template>
          </x-data-table>
        </v-col>
      </v-row>
      <template v-else>
        <v-card-text class="elevation-2">
          <!-- EDIT -->
          <v-row>
            <!-- Questions with Reference -->
            <v-col cols="12" v-for="(question, q) in editingData" :key="`q-${q}`">
              <v-tooltip bottom color="blue" >
                <template v-slot:activator="{ on }" >
                  <v-text-field light outlined
                    v-model="(question.question || {})[lang]"
                    v-on="on"
                    name="question"
                    :label="(question.reference || {})[lang]"
                    color="blue"
                    append-icon="mdi-content-save-edit-outline"
                    @keypress.enter="sendForm(question.idx)"
                  ></v-text-field>
                </template>
                <span>
                  {{ $t('Views.Indices.edit.tooltip_info') }}
                </span>
              </v-tooltip>
            </v-col>
          </v-row>
        </v-card-text>
        <v-row>
          <v-col align="end">
            <v-btn depressed
              color="grey lighten-2"
              @click="changeMode()"
            >
              {{ $t('Views.Indices.edit.btn_back') }}
            </v-btn>
          </v-col>
        </v-row>
      </template>
    </v-card>
  </v-container>
</template>

<script>
import Vue from 'vue'

import questionnairesService from '../../services/questionnaires'

export default Vue.extend({
  data () {
    return {
      lang: 'es',
      indices: {},
      mode: 'list',
      editingGroup: '',
      editingData: [],
      headers: [
        'Views.Indices.list.table_name',
        'Views.Indices.list.table_actions'
      ],
      options: {
        filter: null,
        search: null
      },
      reloadTable: false
    }
  },
  methods: {
    getIndices () {
      return questionnairesService.getIndices()
        .then(resp => {
          this.indices = resp
          const groups = {
            items: []
          }
          for (const key of Object.keys(resp)) {
            groups.items.push({
              name: key,
              data: resp[key]
            })
          }
          return groups
        })
    },
    offReload () {
      this.reloadTable = false
    },
    changeMode (group) {
      if (group) {
        this.editingGroup = group
        this.editingData = JSON.parse(JSON.stringify(this.indices[group]))
        this.mode = 'edit'
      } else {
        this.editingGroup = ''
        this.editingData = []
        this.mode = 'list'
      }
    },
    sendForm (index) {
      const newData = this.editingData.find(x => x.idx === index)

      this.$store.dispatch('loading/show')
      return questionnairesService.editIndexQuestion(newData)
        .then(() => {
          this.$store.dispatch('alert/success', this.$t('Views.Indices.edit.edited_succesfully'))
        })
        .catch(() => {
          this.editingData = JSON.parse(JSON.stringify(this.indices[this.editingGroup]))
          this.$store.dispatch('alert/error', this.$t('Views.Indices.edit.edited_error'))
        })
        .finally(() => {
          this.$store.dispatch('loading/hide')
        })
    }
  }
})
</script>
