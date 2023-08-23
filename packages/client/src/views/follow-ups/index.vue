
<template>
  <v-row class="fill-height mb-9 mb-sm-0" align="start" justify="start">
    <!-- STEP ONE -->
    <v-col cols="12" sm="11"
      v-if="step === 1"
      class="mt-5 mt-sm-1 mx-auto pb-12 pl-7 pr-9"
    >
      <v-skeleton-loader
        v-if="loadingInitial"
        class="my-4"
        type="heading"
      ></v-skeleton-loader>
      <h4 v-else class="mt-3 mb-1 display-1 left break-name">
        {{ $t('Views.FollowUpReport.followup_report') }}
        <span v-if="poll.name" class="display-1 font-weight-light">
          ({{ poll.name }})
        </span>
      </h4>
      <v-skeleton-loader
        v-if="loadingInitial"
        class="mb-5"
        type="text"
      ></v-skeleton-loader>
      <p v-else class="grey--text text--darken-2">
        {{ $t('Views.FollowUpReport.followup_report_desc') }}
      </p>
      <p v-if="!loadingInitial" class="mb-0 pr-1 body-2 text-right font-weight-bold">
        {{ $t('Views.FollowUpReport.selected') }}: {{ selectedCount }}
      </p>

      <v-skeleton-loader
        v-if="loadingInitial"
        type="table"
      ></v-skeleton-loader>
      <v-simple-table dense
        v-else
        fixed-header
        height="468px"
        style="border: 1px solid #DDDDDD;"
      >
        <template v-slot:default>
          <thead>
            <tr class="grey lighten-1">
              <th class="py-5 grey lighten-1 text-uppercase body-2 font-weight-bold">
                {{ $t('Views.FollowUpReport.demographic_cuts') }}
              </th>
              <th width="70px" class="px-0 grey lighten-1 text-right">
                <v-btn dark
                  color="primary"
                  class="my-3 mr-3 pr-2 body-2"
                  :disabled="!selectedCount"
                  @click="step = 2"
                >
                  {{ $t('Views.FollowUpReport.generate') }} <v-icon size="21" class="ml-2">mdi-arrow-right</v-icon>
                </v-btn>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="cut in demographicCuts" :key="cut.id">
              <td class="py-2 body-2">
                {{ cut.demographicItem.translate.label }}
              </td>
              <td>
                <v-checkbox dense hide-details
                  v-model="selectedCuts[cut.id].selected"
                  :ripple="false"
                  :disabled="selectedCount > 1 && !selectedCuts[cut.id].selected"
                  color="primary"
                  class="mt-1 mb-1 float-right"
                  @change="selectedCounter()"
                ></v-checkbox>
              </td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
      <x-loading
        :display.sync="loadingInitial"
      ></x-loading>
    </v-col>
    <!-- STEP TWO -->
    <v-col cols="12"
      v-if="step === 2"
      class="mt-6 mx-auto pb-12 pl-7 pr-9"
    >
      <h4 v-if="poll.name" class="mb-6 display-1 left break-name">
        {{ poll.name }}
      </h4>
      <v-row no-gutters>
        <v-col cols="6" sm="6" class="pa-0">
          <v-btn
            color="primary"
            class="pl-2"
            @click="step = 1"
          >
            <v-icon size="21" class="mr-2">mdi-arrow-left</v-icon> {{ $t('Views.FollowUpReport.inputs.back') }}
          </v-btn>
        </v-col>
        <v-col cols="6" sm="6" class="pa-0 text-right">
          <v-btn outlined
            color="success darken-1"
            class="pr-2"
            :disabled="loadingResults || !results.length"
            @click="exportToXls()"
          >
            {{ $t('Views.FollowUpReport.export') }} <v-icon size="21" class="ml-2">mdi-file-excel</v-icon>
          </v-btn>
        </v-col>
      </v-row>
      <v-data-table :dense="!loadingResults"
        :headers="headers"
        :items="results"
        :items-per-page="-1"
        :loading="loadingResults"
        :hide-default-footer="true"
        class="mt-5 elevation-1 px-4 py-2"
      >
         <template v-slot:item="{ item, index }">
          <tr :class="{ 'font-weight-bold': index + 1 === results.length }">
            <td :class="{ 'text-right ': index + 1 === results.length, 'py-1': true }">
              {{ $te(`Views.FollowUpReport.${item.demo1}`) ? $t(`Views.FollowUpReport.${item.demo1}`) : item.demo1 }}
            </td>
            <td v-if="item.demo2"
              :class="{ 'text-right': index + 1 === results.length, 'py-1': true }"
            >
              {{
                $te(`Views.FollowUpReport.${item.demo2}`)
                  ? $t(`Views.FollowUpReport.${item.demo2}`)
                  : item.demo2
              }}
            </td>
            <td class="py-1 text-center">
              {{ item.total ? item.total : '-' }}
            </td>
            <td class="py-1 text-center">
              {{ item.obtained ? item.obtained : '-' }}
              <small v-if="index + 1 === results.length">
                ({{ getPercent(item.obtained, item.total) }}%)
              </small>
            </td>
            <td class="py-1 text-center">
              {{ item.total - item.obtained > 0 ? item.total - item.obtained : '-' }}
              <small v-if="index + 1 === results.length">
                ({{ getPercent((item.total - item.obtained), item.total) }}%)
              </small>
            </td>
          </tr>
        </template>
        <template v-slot:no-data>
          <v-alert text tile
            :value="true"
            type="error"
            icon="mdi-shield-remove"
            class="text-center my-0 mx-n4"
          >
            <h3>{{ $t('no_data') }}</h3>
          </v-alert>
        </template>
      </v-data-table>
    </v-col>

  </v-row>
</template>

<script src="./index.js"></script>
