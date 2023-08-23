
<template>
  <v-container fluid grid-list-xl>
    <v-row>
      <v-col cols="12">
        <h4 class="display-1"> {{ $t('Views.Dashboard.general_title') }} </h4>
      </v-col>
    </v-row>
    <dashboard-employee :info="info" v-if="user.role === 'employee'" />
    <dashboard-enterprise :info="info" v-if="['customer', 'enterprise_admin'].includes(user.role)" />
    <dashboard-admin :info="info" v-if="user.role === 'admin'" />
  </v-container>
</template>

<script>
import Vue from 'vue'
import { mapState } from 'vuex'

import dashboardService from '../services/dashboard'
import DashboardAdmin from './dashboard/dashboard-admin.vue'
import DashboardEmployee from './dashboard/dashboard-employee.vue'
import DashboardEnterprise from './dashboard/dashboard-enterprise.vue'

export default Vue.extend({
  components: {
    DashboardAdmin,
    DashboardEmployee,
    DashboardEnterprise
  },
  data () {
    return {
      info: {}
    }
  },
  computed: {
    ...mapState({
      user: state => state.session.user
    })
  },
  created () {
    this.$store.dispatch('loading/show')
    if (this.user.role === 'employee') {
      this.getEmployeeInfo()
    } else if (['customer', 'enterprise_admin'].includes(this.user.role)) {
      this.getEnterpriseInfo()
    } else {
      this.getAdminInfo()
    }
  },
  methods: {
    getEmployeeInfo () {
      return dashboardService.getEmployeeInfo(this.user.employeeId)
        .then((res) => {
          this.info = res
          this.$store.dispatch('loading/hide')
        })
    },
    getEnterpriseInfo () {
      return dashboardService.getEnterpriseInfo()
        .then((res) => {
          this.info = res
          this.$store.dispatch('loading/hide')
        })
    },
    getAdminInfo () {
      return dashboardService.getInfo()
        .then((res) => {
          this.info = res
          this.$store.dispatch('loading/hide')
        })
    }
  }
})
</script>
