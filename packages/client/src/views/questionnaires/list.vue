<template>
  <v-container>
    <v-row>
      <v-col cols="12" sm="10">
        <h4 class="display-1"> {{ $t('Views.Questionnaires.list.title') }} </h4>
      </v-col>
      <v-col cols="12" sm="2" align="end">
        <v-btn
          to="/questionnaires/create"
          class="text-capitalize"
          color="primary"
          block
        >
          <v-icon left>fa-plus-circle</v-icon>&nbsp;&nbsp;{{ $t('Views.Questionnaires.list.btn_create') }}
        </v-btn>
      </v-col>
    </v-row>
    <v-card class="mt-2 px-4">
      <v-row>
        <v-col>
          <x-data-table
            :headers="headers"
            :parent-fetch-data="getQuestionnaires"
            :options="options"
            :reload="reloadTable"
            no-data="questionnaires.no_data"
            @offReload="offReload"
          >
            <template v-slot:structure="prop">
              <td class="text-left text-capitalize pt-3">
                {{ prop.item.name }}
              </td>
              <td class="text-center pt-3" style="width: 26%;">
                {{ prop.item.updatedAt.split('T')[0] | date({date: true, hour:false}) }}
              </td>
              <td class="text-center align-center px-0" style="width: 14%;">
                <v-switch hide-details
                  v-model="prop.item.active"
                  :loading="loadingSwitch[prop.item._id]"
                  class="mt-2 ml-12 mr-0"
                  @click="openModal(prop.item, prop.item.active)"
                />
              </td>
              <td class="text-center pt-1" style="width: 17%;">
                <v-tooltip bottom color="primary">
                  <template v-slot:activator="{ on }">
                    <v-btn
                      :to="`questionnaires/${prop.item.slug}/edit`"
                      v-on="on"
                      text icon>
                      <v-icon small>fa-edit</v-icon>
                    </v-btn>
                  </template>
                  <span>{{ $t('Views.Questionnaires.list.btn_edit') }}</span>
                </v-tooltip>
                <v-tooltip bottom color="primary">
                  <template v-slot:activator="{ on }">
                    <v-btn
                      :to="`questionnaires/${prop.item.slug}/edit-questionnaire`"
                      v-on="on"
                      text icon>
                      <v-icon small>fa-cog</v-icon>
                    </v-btn>
                  </template>
                  <span>{{ $t('Views.Questionnaires.list.btn_settings') }}</span>
                </v-tooltip>
                <v-tooltip bottom color="red">
                  <template v-slot:activator="{ on }">
                    <v-btn
                      @click="openDelModal(prop.item)"
                      v-on="on"
                      text icon>
                      <v-icon small color="red">fa-trash</v-icon>
                    </v-btn>
                  </template>
                  <span>{{ $t('Views.Questionnaires.list.btn_trash') }}</span>
                </v-tooltip>
              </td>
            </template>
          </x-data-table>
        </v-col>
      </v-row>
    </v-card>
    <x-confirmation-modal
      :show.sync="modalEna.open"
      :reversible="true"
      :title="$t('Views.Questionnaires.list.modal_enable')"
      :action="enable"
      @close="modalEna.open = false"
    ></x-confirmation-modal>

    <x-confirmation-modal
      :show.sync="modalDis.open"
      :reversible="true"
      :title="$t('Views.Questionnaires.list.modal_disable')"
      :action="disable"
      @close="modalDis.open = false"
    ></x-confirmation-modal>

    <x-confirmation-modal
      :show.sync="modalDel.open"
      :reversible="true"
      :title="$t('Views.Questionnaires.list.modal_delete')"
      :action="remove"
      :btn-save="$t('Views.Questionnaires.list.modal_btn_trash')"
      color="error"
      @close="modalDel.open = false"
    ></x-confirmation-modal>
  </v-container>
</template>

<script>
import Vue from 'vue'

import questionnairesService from '../../services/questionnaires'

export default Vue.extend({
  data () {
    return {
      loadingSwitch: {},
      currentLoadingSwitch: '',
      questionnaries: [],
      headers: [
        'Views.Questionnaires.list.table_name',
        'Views.Questionnaires.list.table_last_edition',
        'Views.Questionnaires.list.table_status',
        'Views.Questionnaires.list.table_actions'
      ],
      options: {
        filter: null,
        search: null
      },
      reloadTable: false,
      modalDis: {
        open: false,
        item: {}
      },
      modalEna: {
        open: false,
        item: {}
      },
      modalDel: {
        open: false,
        item: {}
      }
    }
  },
  methods: {
    getQuestionnaires (options) {
      return questionnairesService.list(options)
        .then(resp => {
          this.questionnaries = resp.items
          return resp
        })
    },
    openModal (item, activate) {
      this.modalEna.open = Boolean(activate)
      this.modalDis.open = !activate
      this.currentLoadingSwitch = item._id
      this.modalEna.item = item
      this.modalDis.item = item
    },
    remove () {
      if (this.modalDel.item.isBase) {
        this.modalDel.open = false
        return
      }
      return questionnairesService.delete(this.modalDel.item.slug)
        .then(() => {
          this.reloadTable = true
        }).catch(() => {
          this.modalDis.open = false
        })
    },
    disable () {
      return questionnairesService.toggle(this.modalDis.item.slug, false)
        .then(() => {
          this.modalDis.item.active = false
          this.reloadTable = true
        })
        .catch((err) => {
          if (err.code === 'limit') {
            this.$store.dispatch('alert/error', this.$t('errors.error_disable_questionnaires'))
          } else {
            this.$store.dispatch('alert/error', this.$t(`errors.${err.code}`))
          }
        })
        .finally(() => {
          this.modalDis.open = false
        })
    },
    enable () {
      return questionnairesService.toggle(this.modalEna.item.slug, true)
        .then(() => {
          this.modalEna.item.active = true
          this.reloadTable = true
        })
        .catch((err) => {
          console.log(err)
        })
        .finally(() => {
          this.modalEna.open = false
        })
    },
    openDelModal (item) {
      if (item.isBase) {
        this.$store.dispatch('alert/error', this.$t('errors.error_disable_questionnaires'))
        return
      }
      this.modalDel.item = item
      this.modalDel.open = true
    },
    offReload () {
      this.reloadTable = false
    },
    toggleActive (id) {
      const matchQ = this.questionnaries.find(q => q._id === id)
      matchQ.active = !matchQ.active
    }
  },
  watch: {
    'modalEna.open': {
      handler (val) {
        if (val) {
          this.loadingSwitch[this.currentLoadingSwitch] = true
        } else {
          this.toggleActive(this.currentLoadingSwitch)
          this.loadingSwitch[this.currentLoadingSwitch] = false
          this.currentLoadingSwitch = ''
        }
      }
    },
    'modalDis.open': {
      handler (val) {
        if (val) {
          this.loadingSwitch[this.currentLoadingSwitch] = true
        } else {
          this.toggleActive(this.currentLoadingSwitch)
          this.loadingSwitch[this.currentLoadingSwitch] = false
          this.currentLoadingSwitch = ''
        }
      }
    }
  }
})
</script>
