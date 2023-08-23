<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="3" class="pr-0">
        <h4 class="display-1"> {{ $t('Views.Evaluations.list.title') }}</h4>
      </v-col>

      <v-col cols="12" md="9" class="pl-0">
        <v-row no-gutters>
          <v-col cols="12" md="8" class="pa-0 text-right">
            <v-btn outlined large
              color="primary"
              @click="showModal = !showModal"
            >
              {{ $t('Views.Evaluations.list.generic_link_btn') }}
            </v-btn>
          </v-col>
          <v-col cols="12" md="4" class="pa-0 text-right pt-5 pt-md-0">
            <v-btn large
              color="primary"
              class="ml-2"
              to="/evaluations/create"
            >
              <v-icon left>fa-plus-circle</v-icon>
              {{ $t('Views.Evaluations.list.btn_create') }}
            </v-btn>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-card class="mt-5 px-4">
      <v-row>
        <v-col>
          <v-layout row wrap class="ml-3">
            <v-col cols="12" sm="3">
              <v-autocomplete
                :label="$t('Views.Evaluations.list.input_filter_by')"
                :items="filters"
                prepend-inner-icon="mdi-filter-outline"
                @change="filterItems"
              ></v-autocomplete>
            </v-col>
          </v-layout>

          <x-data-table
            :headers="headers"
            :parent-fetch-data="getEvaluations"
            :options="options"
            :reload="reloadTable"
            no-data="Views.Evaluations.list.table_no_data"
            @offReload="offReload"
          >
            <template v-slot:structure="prop">
              <td class="text-center" style="vertical-align: middle;">
                {{ prop.item.name }}
              </td>
              <td class="text-center" style="vertical-align: middle;">
                <v-tooltip top color="blue" :disabled="!['creating', 'editing'].includes(prop.item.status)">
                  <template v-slot:activator="{ on }">
                    <v-chip outlined label
                      v-on="on"
                      :color="getColor(prop.item.status)"
                    >
                      {{ $t(`Views.Evaluations.list.status_${prop.item.status}`) }}
                    </v-chip>
                  </template>
                  <span>{{ $t('Views.Evaluations.list.may_take_while') }}</span>
                </v-tooltip>
              </td>
              <td class="text-center" style="vertical-align: middle;">{{ prop.item.deliveredAt | date({date: true, hour: false}) }} hasta {{ prop.item.validUntil | date({date: true, hour: false}) }} </td>
              <td class="text-center px-0" style="vertical-align: middle;">
                <template v-if="!['creating', 'editing'].includes(prop.item.status)">
                  <v-tooltip bottom color="primary">
                    <template v-slot:activator="{ on }" v-if="prop.item.status !== 'completed'">
                      <v-btn
                        :to="`evaluations/${prop.item.slug}/edit`"
                        v-on="on"
                        text icon>
                        <v-icon small>edit</v-icon>
                      </v-btn>
                    </template>
                    <span>{{ $t('Views.Evaluations.list.btn_edit') }}</span>
                  </v-tooltip>
                  <v-tooltip bottom color="primary">
                    <template v-slot:activator="{ on }">
                      <v-btn
                        :to="`/evaluations/${prop.item.slug}/details`"
                        v-on="on"
                        text icon>
                        <v-icon small>fa-eye</v-icon>
                      </v-btn>
                    </template>
                    <span>{{ $t('Views.Evaluations.list.btn_details') }}</span>
                  </v-tooltip>
                  <v-tooltip bottom color="primary" v-if="prop.item.status === 'completed'">
                    <template v-slot:activator="{ on }">
                      <v-btn
                        :to="`/evaluations/reports/${prop.item._id}`"
                        v-on="on"
                        icon
                      >
                        <v-icon small>mdi-chart-bar-stacked</v-icon>
                      </v-btn>
                    </template>
                    <span>{{ $t('Views.Evaluations.list.btn_report') }}</span>
                  </v-tooltip>
                </template>
                <v-tooltip v-else bottom color="primary">
                  <template v-slot:activator="{ on }">
                    <v-btn v-on="on" icon
                      @click="reloadTable = true"
                    >
                      <v-icon small>mdi-reload</v-icon>
                    </v-btn>
                  </template>
                  <span>{{ $t('Views.Evaluations.list.refresh') }}</span>
                </v-tooltip>
              </td>
            </template>
          </x-data-table>
        </v-col>
      </v-row>
    </v-card>
    <v-dialog v-model="showModal" width="650px" persistent>
      <v-card>
        <v-card-title>
          <span class="headline">
            {{ $t('Views.Evaluations.list.modal_copy_invitation_url_title') }}
          </span>
        </v-card-title>
        <v-card-subtitle>
          <p class="mt-4 mb-0 text-justify body-2">
            {{ $t('Views.Evaluations.list.modal_copy_invitation_url') }}
          </p>
        </v-card-subtitle>
        <v-card-text>
          <v-row justify="center">
            <v-col cols="11">
              <v-text-field
                :label="$t('Views.Evaluations.list.modal_invitation_url')"
                :readonly="true"
                outlined
                v-model="tokenUrl"
                id="tokenUrl"
              ></v-text-field>
            </v-col>
            <v-col cols="1">
              <v-tooltip bottom color="black">
                <template v-slot:activator="{ on }">
                  <v-btn icon v-on="on" @click="copyUrl" class="mt-2">
                    <v-icon>file_copy</v-icon>
                  </v-btn>
                </template>
                <span>{{ $t('Views.Evaluations.list.modal_link') }}</span>
              </v-tooltip>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-btn block large @click="closeModal">{{ $t('Views.Evaluations.list.modal_btn_close') }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import Vue from 'vue'

import { mapState } from 'vuex'
import evaluationsService from '../../services/evaluations'

export default Vue.extend({
  data () {
    return {
      headers: [
        'Views.Evaluations.list.table_name',
        'Views.Evaluations.list.table_status',
        'Views.Evaluations.list.table_vigency',
        'Views.Evaluations.list.table_actions'
      ],
      options: {
        filter: null,
        search: null
      },
      showModal: false,
      tokenUrl: '',
      filters: [
        { text: 'Todos', value: null },
        { text: 'Pendiente', value: 'pending' },
        { text: 'En progreso', value: 'in_progress' },
        { text: 'Completada', value: 'completed' }
      ],
      reloadTable: false
    }
  },
  computed: {
    ...mapState({
      user: state => state.session.user
    })
  },
  methods: {
    getColor (status) {
      switch (status) {
        case 'pending':
          return 'gray'
        case 'completed':
          return 'green'
        case 'in_progress':
          return 'blue'
      }
    },
    getEvaluations (options) {
      return evaluationsService.list(options)
    },
    offReload () {
      this.reloadTable = false
    },
    copyUrl () {
      const input = document.getElementById('tokenUrl')
      input.select()
      document.execCommand('copy')
      this.$store.dispatch('alert/success', this.$t('Views.Evaluations.list.msg_link_copied'))
    },
    closeModal () {
      this.showModal = false
    },
    filterItems (value) {
      this.options = {
        ...this.options,
        filter: value
      }
    }
  },
  created () {
    this.$store.dispatch('session/getSuiteWebHost')
      .then((res) => {
        if (res) {
          const enterpriseToken = this.user.enterprise && this.user.enterprise.invitationCode ? this.user.enterprise.invitationCode : ''
          this.tokenUrl = `${res}/auth/verify-polls/${enterpriseToken}`
        } else {
          this.$router.push('/404')
        }
      })
  }
})
</script>
