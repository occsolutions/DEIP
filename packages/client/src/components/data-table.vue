
<template>
  <div>
    <v-data-table
      :headers="formatedHeaders"
      :items="items"
      :server-items-length="itemsTotal"
      :loading="loading"
      :footer-props="footerProps"
      :options.sync="pagination"
      :items-per-page="10"
    >
      <template v-slot:item="props">
        <tr>
          <slot name="structure" v-bind:item="props.item"></slot>
        </tr>
      </template>
      <template v-slot:no-data>
        <v-alert :value="true" text dense prominent type="error" icon="mdi-shield-remove" class="text-center mt-3" v-if="!loading">
          <h3>{{ $t(noData || 'no_data') }}</h3>
        </v-alert>
      </template>
      <template v-slot:pageText="props">
        {{ props.pageStart }} - {{ props.pageStop }} {{ $t('page_text') }} {{ props.itemsLength }}
      </template>
    </v-data-table>
  </div>
</template>

<script>

import Vue from 'vue'

const objHeader = {
  sortable: false,
  align: 'center',
  class: 'text-uppercase'
}

export default Vue.extend({
  name: 'table-purged',
  props: {
    parentFetchData: {
      type: Function,
      required: true
    },
    headers: {
      type: Array,
      required: true
    },
    noData: String,
    options: Object,
    reload: Boolean
  },
  data () {
    return {
      pagination: {},
      items: [],
      itemsTotal: 0,
      loading: true,
      formatedHeaders: [],
      footerProps: {
        'items-per-page-text': this.$t('results_per_pages'),
        'items-per-page-options': [5, 10, 25, { text: this.$t('page_all'), value: -1 }]
      }
    }
  },
  watch: {
    reload () {
      if (this.reload) {
        this.pagination = {}
        this.$nextTick(() => {
          this.$emit('offReload')
        })
      }
    },
    options () {
      const auxPagination = JSON.parse(JSON.stringify(this.pagination))
      auxPagination.page = 1
      this.$nextTick(() => {
        this.pagination = JSON.parse(JSON.stringify(auxPagination))
      })
    },
    pagination: {
      handler () {
        this.loading = true
        this.parentFetchData({ ...this.pagination, ...this.options }).then((resp) => {
          this.items = resp.items
          this.itemsTotal = resp.total
        }).finally(() => {
          this.loading = false
        })
      },
      deep: true
    }
  },
  created () {
    this.formatedHeaders = this.headers.map((header) => {
      return {
        text: this.$t(header),
        ...objHeader
      }
    })
  }
})
</script>
