
<template>
  <v-container>
    <v-row>
      <v-col class="ml-2 mr-2">
        <v-card>
          <v-toolbar dense color="primary" class="white--text">
            <v-toolbar-title class="text-uppercase">
              {{ $t('Views.Dashboard.admin.title') }}
            </v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-simple-table>
              <template v-slot:default>
                <thead>
                  <tr>
                    <th class="text-center" v-for="(header, k) in headers" :key="k"> {{ $t(`Views.Dashboard.admin.${header}`) }} </th>
                  </tr>
                </thead>
                <tbody v-if="info.evaluations && info.evaluations.length">
                  <tr v-for="evaluation in info.evaluations" :key="evaluation._id">
                    <td class="text-center">
                      {{ evaluation.name }}
                      <br/>{{ evaluation.displayName }}
                    </td>
                    <td class="text-center">
                      {{ evaluation.deliveredAt | date }} {{ $t('Views.Dashboard.admin.to') }} {{ evaluation.validUntil | date }}
                    </td>
                    <td class="text-center">
                      {{ $t(`Views.Dashboard.admin.status_${evaluation.status}`) }}
                    </td>
                    <td class="text-center">
                      {{ evaluation.enterprise.name }}
                      <br/>{{ evaluation.enterprise.customer.name }}
                    </td>
                    <td class="text-center">
                      {{ evaluation.team }}
                    </td>
                  </tr>
                </tbody>
                <tbody v-else>
                  <tr>
                    <td colspan="5">
                      <v-alert text dense prominent type="error" icon="mdi-shield-remove" class="text-center mt-3">
                        <h3>{{ $t('Views.Dashboard.admin.no_data') }}</h3>
                      </v-alert>
                    </td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>

import Vue from 'vue'

export default Vue.extend({
  props: {
    info: Object
  },
  data () {
    return {
      headers: [
        'table_header_name',
        'table_header_dates',
        'table_header_status',
        'table_header_enterprise',
        'table_header_team_members'
      ]
    }
  }
})
</script>
