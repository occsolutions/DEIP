<template>
  <v-simple-table>
    <template v-slot:default>
      <thead>
        <tr>
          <th class="pt-3 text-center subtitle-2">
            {{ $t('Views.Evaluations.stepEvaluatedSelection.evaluatedTable.team_members') }}
          </th>
          <th class="pt-3 text-center subtitle-2">
            {{ $t('Views.Evaluations.stepEvaluatedSelection.evaluatedTable.actions') }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="item in evaluated"
          :key="item.employeeId"
        >
          <td class="pt-3 text-center">
            {{ item.firstName }} {{ item.lastName }}
            ({{ identifyTypes[item.identifyTypeId] }}{{ item.identifyDocument }})
          </td>
          <td class="pt-1 text-center">
            <v-tooltip bottom color="primary">
              <template v-slot:activator="{ on }">
                <v-btn
                  @click="$emit('delete', item)"
                  v-on="on"
                  icon color="red">
                  <v-icon small>mdi-trash-can</v-icon>
                </v-btn>
              </template>
              <span>{{ $t('Views.Evaluations.stepEvaluatedSelection.evaluatedTable.input_trash') }}</span>
            </v-tooltip>
          </td>
        </tr>
        <tr v-if="evaluated.length === 0">
          <td :colspan="4" class="pt-3 text-center">{{ $t('Views.Evaluations.stepEvaluatedSelection.evaluatedTable.eval_no_data') }}</td>
        </tr>
      </tbody>
    </template>
  </v-simple-table>
</template>

<script>
export default {
  name: 'evaluated-table',
  props: {
    evaluated: Array,
    identifyTypes: Object
  }
}
</script>

<style scoped>
  .v-data-table th {
    font-size: 16px;
    border-bottom: 1px solid #0000001f;
  }
</style>
