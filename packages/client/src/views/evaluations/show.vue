<template>
  <v-container>
    <v-row align="center" justify="start" fill-height>
      <v-col xs="12">
        <h4 class="display-1 left">{{ evaluation.name }}</h4>
        <v-chip
          v-if="evaluation.displayName"
          color="primary"
          class="mb-3 white--text right"
        >
          {{ evaluation.displayName }}
        </v-chip>
      </v-col>
    </v-row>

    <v-card class="my-4">
      <v-toolbar color="primary" flat class="white--text">
        <v-btn icon to="/evaluations" color="primary" large>
          <v-icon color="white">fa-chevron-left</v-icon>
        </v-btn>
        <v-toolbar-title>
          <h2 class="title">
            {{ $t('Views.Evaluations.show.evaluation') }}
          </h2>
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-menu offset-y left transition="slide-y-transition">
          <template v-slot:activator="{ on }">
            <v-btn
              color="primary"
              depressed
              v-on="on"
            >
            <v-icon class="mr-2">fa-cog</v-icon>
              {{ $t('Views.Evaluations.show.options') }}
            </v-btn>
          </template>
          <v-list>
            <v-list-item
              v-if="evaluation.status === 'completed' && user.origin"
              @click="showJsonModal = true"
            >
              <v-icon color="success darken-2" class="mt-n1 ml-n1 mr-1" size="19">mdi-file-excel</v-icon>
              <v-list-item-title>Sábana de Datos</v-list-item-title>
            </v-list-item>
            <v-list-item
              v-if="evaluation.status === 'completed'"
              @click="$router.push(`/evaluations/reports/${evaluation._id}`)"
            >
              <v-icon class="mr-2" small>fa-file-pdf</v-icon>
              <v-list-item-title>{{ $t('Views.Evaluations.show.download_reports') }}</v-list-item-title>
            </v-list-item>
            <v-list-item
              v-if="evaluation.status !== 'completed'"
              @click="$router.push(`/evaluations/${evaluation.slug}/edit`)"
            >
              <v-icon class="mr-2" small>fa-pen</v-icon>
              <v-list-item-title>{{ $t('Views.Evaluations.show.edit') }}</v-list-item-title>
            </v-list-item>
            <v-list-item
              v-if="evaluation.status === 'in_progress'"
              @click="$router.push(`/followup/deip/${evaluation._id}`)"
            >
              <v-icon class="mr-2" small>fa-eye</v-icon>
              <v-list-item-title>{{ $t('Views.Evaluations.show.tracking') }}</v-list-item-title>
            </v-list-item>
            <v-list-item
              v-if="evaluation.status === 'in_progress'"
              @click="openConfirmationModal('reminders')"
            >
              <v-icon class="mr-2" small>fa-share</v-icon>
              <v-list-item-title>{{ $t('Views.Evaluations.show.sending_reminders') }}</v-list-item-title>
            </v-list-item>
            <v-list-item
              v-if="evaluation.status === 'in_progress'"
              @click="openConfirmationModal('close')"
            >
              <v-icon class="mr-2" small>fa-times-circle</v-icon>
              <v-list-item-title>{{ $t('Views.Evaluations.show.close_evaluation') }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-toolbar>
      <v-row class="px-8 py-4 my-5">
        <v-col xs="12" sm="4" align="center">
          <v-progress-circular
            :rotate="-90"
            :size="150"
            :value="((evaluation.populationCompletedCount * 100) / evaluation.populationCount).toFixed(2)"
            :width="15"
            color="primary"
            class="pt-8"
          >
            <p class="mb-0">
              <span class="display-2">
                {{ evaluation.populationCount }}
              </span> <br>
              <span class="title text-uppercase">
                {{ $t('Views.Evaluations.show.total') }}
              </span>
            </p>
          </v-progress-circular>
        </v-col>
        <v-col xs="12" sm="4" align="center">
          <v-row>
            <!-- Pending -->
            <v-col cols="6" align="center">
              <h1 class="text-uppercase">{{ $t('Views.Evaluations.show.pending_evaluations') }}</h1>
              <h1 class="display-3" style="color: darkred">
                {{ computedPendingPopulation }}
              </h1>
              <h1>
                {{ computedPendingPercentage }}% {{ $t('Views.Evaluations.show.of_polls') }}
              </h1>
            </v-col>
            <!-- Completed -->
            <v-col cols="6" align="center">
              <h1 class="text-uppercase">
                {{ $t('Views.Evaluations.show.finished_evaluations') }}
              </h1>
              <h1 color="primary" class="display-3" style="color: #51c7af">
                {{ evaluation.populationCompletedCount ? evaluation.populationCompletedCount : 0 }}
              </h1>
              <h1>
                {{ computedCompletedPercentage }}% {{ $t('Views.Evaluations.show.of_polls') }}
              </h1>
            </v-col>
          </v-row>
        </v-col>
        <v-col xs="12" sm="4" align="center">
          <v-list dense>
            <v-list-item one-line>
              <v-list-item-content>
                <v-list-item-title class="text-uppercase" v-if="evaluation.status">
                  <v-chip outlined label :color="getColor(evaluation.status)">
                    {{ $t(`Views.Evaluations.show.status_${evaluation.status}`) }}
                  </v-chip>
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item two-line>
              <v-list-item-content>
                <v-list-item-title class="text-uppercase">{{$t('Views.Evaluations.show.date_delivery')}}</v-list-item-title>
                <v-list-item-subtitle>{{ evaluation.deliveredAt | date }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-list-item two-line>
              <v-list-item-content>
                <v-list-item-title class="text-uppercase">{{$t('Views.Evaluations.show.poll_valid_until')}}</v-list-item-title>
                <v-list-item-subtitle>{{ evaluation.validUntil | date }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-list-item two-line>
              <v-list-item-content>
                <v-list-item-title class="text-uppercase">{{$t('Views.Evaluations.show.scheduled_reminders')}}</v-list-item-title>
                <template v-if="evaluation.reminders.length">
                  <v-list-item-subtitle v-for="(reminder, k) in evaluation.reminders" :key="k">{{ reminder.dateTime | date }}</v-list-item-subtitle>
                </template>
                <v-list-item-subtitle v-else>{{$t('Views.Evaluations.show.no_reminders')}}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-col>
      </v-row>
      <v-divider></v-divider>
      <v-row class="text-center">
        <v-col cols="12">
          <v-btn
            icon
            rounded
            color="info"
            @click="showModalChip = true"
          >
            <v-icon>mdi-information</v-icon>
          </v-btn>
          ({{ evaluation.populationCount }} {{ $t('Views.Evaluations.stepRevition.team_members') }})
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <div v-if="evaluation._id">
            <v-layout row wrap class="ml-3">
              <v-col cols="12" sm="3">
                <v-autocomplete
                  v-model="filterByStatus"
                  :items="filters"
                  :label="$t('Views.Evaluations.list.input_filter_by')"
                  prepend-inner-icon="mdi-filter-outline"
                  @change="filterItems()"
                ></v-autocomplete>
              </v-col>
              <v-spacer></v-spacer>
              <v-col cols="12" sm="6" md="6" lg="6" class="mr-6">
                <v-text-field
                  v-model.lazy="tableOptions.search"
                  append-icon="mdi-magnify"
                  :label="$t('Views.Evaluations.show.look_for_name')"
                  single-line
                  hide-details
                  @input="makeSearch()"
                ></v-text-field>
              </v-col>
            </v-layout>
            <x-data-table
              :parent-fetch-data="getEvaluated"
              :options="tableOptions"
              :headers="[]"
              no-data="Views.Evaluations.list.table_no_data"
            >
              <template v-slot:structure="prop">
                <td class="text-center" style="vertical-align: middle;">
                  <v-chip :color="getColor(prop.item.status)">
                    {{ `${prop.item.employee.employeeEnterprise.firstName} ${prop.item.employee.employeeEnterprise.lastName}` }}
                  </v-chip>
                </td>
              </template>
            </x-data-table>
          </div>
        </v-col>
      </v-row>
    </v-card>

    <x-confirmation-modal
      :show.sync="showModal"
      :reversible="typeModal !== 'close'"
      :title="typeModal !== 'close' ? $t('Views.Evaluations.show.send_reminders') : $t('Views.Evaluations.show.close_evaluation')"
      :action="typeModal !== 'close' ? sendReminders : closeEvaluation"
      :btn-save="$t('Views.Evaluations.show.input_confirm')"
      @close="showModal = false"
    >
      <template v-slot:question>{{ typeModal !== 'close' ? $t('Views.Evaluations.show.send_reminders_q') : $t('Views.Evaluations.show.close_evaluation_q') }}</template>
    </x-confirmation-modal>

    <x-json-modal
      :showDialog="showJsonModal"
      :evaluationId="evaluation._id"
      :questionnaire="evaluation.questionnaire"
      :additionalSegmentation="evaluation.additionalSegmentation"
      @close="showJsonModal = false"
    >
    </x-json-modal>

    <v-dialog v-model="showModalChip" width="500">
      <v-card>
        <v-toolbar light flat class="text-center">
          <v-toolbar-title>{{ $t('Views.Evaluations.show.modal_title') }}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn icon light @click="showModalChip = false">
              <v-icon>close</v-icon>
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-card-text>
          <p>{{ $t('Views.Evaluations.show.modal_info') }}</p>
          <v-chip class="ma-2" color="default">{{ $t('Views.Evaluations.show.modal_chip_default') }}</v-chip>
          <v-chip class="ma-2" color="info">{{ $t('Views.Evaluations.show.modal_chip_info') }}</v-chip>
          <v-chip class="ma-2" color="success">{{ $t('Views.Evaluations.show.modal_chip_success') }}</v-chip>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="showModalChip = false">
            <v-icon>close</v-icon>&nbsp;{{ $t('Views.Evaluations.show.modal_input_close') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>

import Vue from 'vue'
import { mapState } from 'vuex'
import XJsonModal from '@/components/dialogs/spreadsheet-json'

import evaluationsService from '../../services/evaluations'
import evaluatedService from '../../services/evaluated'
import identifyTypesService from '../../services/identify-types'

export default Vue.extend({
  components: {
    XJsonModal
  },
  data () {
    return {
      showJsonModal: false,
      evaluation: {
        reminders: [],
        evaluated: []
      },
      dataFetched: false,
      typeModal: '',
      showModal: false,
      showModalChip: false,
      identifyTypes: {},
      tableHeaders: [
        'Views.Evaluations.show.evaluated_list.table_name'
      ],
      tableOptions: {
        filter: null,
        search: null
      },
      filterByStatus: '',
      filters: [
        { text: 'Todos', value: null },
        { text: 'Pendiente', value: 'pending' },
        { text: 'En progreso', value: 'in_progress' },
        { text: 'Completada', value: 'completed' }
      ],
      evaluatedFetchTimerId: undefined
    }
  },
  computed: {
    ...mapState({
      user: (state) => state.session.user
    }),
    computedPendingPopulation () {
      if (this.dataFetched) {
        return this.evaluation.populationCount - this.evaluation.populationCompletedCount
      }
      return 0
    },
    computedPendingPercentage () {
      if (this.dataFetched) {
        return (((this.evaluation.populationCount - this.evaluation.populationCompletedCount) * 100) / this.evaluation.populationCount).toFixed(2)
      }
      return 0
    },
    computedCompletedPercentage () {
      if (this.dataFetched) {
        return ((this.evaluation.populationCompletedCount * 100) / this.evaluation.populationCount).toFixed(2)
      }
      return 0
    }
  },
  created () {
    this.$store.dispatch('loading/show')
    identifyTypesService.list()
      .then(res => {
        res.items.forEach(et => {
          this.identifyTypes[et.id] = this.getInitials(et.translate.label) + ' - '
        })
        this.$store.dispatch('loading/hide')
        return this.getEvaluation()
      })
  },
  methods: {
    getInitials (text) {
      return text.trim().split(' ').map(t => t.slice(0, 1)).join('').toUpperCase()
    },
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
    openConfirmationModal (type) {
      this.showModal = true
      this.typeModal = type
    },
    sendReminders () {
      return evaluationsService.sendReminders(this.evaluation.slug)
        .then(() => {
          this.$store.dispatch('alert/success', this.$t('Views.Evaluations.show.reminders_sent_succesfully'))
        }).catch((err) => {
          this.$store.dispatch('alert/error', this.$t(`errors.${err.code}`))
        })
    },
    closeEvaluation () {
      return evaluationsService.closeEvaluation(this.evaluation.slug)
        .then(() => {
          this.$store.dispatch('alert/success', this.$t('Views.Evaluations.show.evaluation_closed_succesfully'))
          return this.getEvaluation()
        }).catch((err) => {
          this.$store.dispatch('alert/error', this.$t(`errors.${err.code}`))
        })
    },
    getEvaluation () {
      this.$store.dispatch('loading/show')
      return evaluationsService.getOneToShow(this.$route.params.slug)
        .then((res) => {
          this.evaluation = res
          this.dataFetched = true
        })
        .catch((err) => {
          this.$store.dispatch('alert/error', this.$t(`errors.${err.code}`))
        })
        .finally(() => {
          this.$store.dispatch('loading/hide')
        })
    },
    getEvaluated (options) {
      return evaluatedService.list(this.evaluation._id, options)
    },
    makeSearch () {
      clearTimeout(this.evaluatedFetchTimerId)
      this.evaluatedFetchTimerId = setTimeout(() => {
        this.filterItems()
      }, 500)
    },
    filterItems () {
      this.tableOptions = {
        ...this.tableOptions,
        filter: this.filterByStatus
      }
    }
  }
})
</script>
