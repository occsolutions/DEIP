
<template>
  <v-navigation-drawer
    v-model="show"
    clipped
    fixed
    app
    color="#5b5b5b"
    dark
    :width="$vuetify.breakpoint.xs ? 250 : 280"
  >
    <article class="mt-5" v-if="show">
        <section>
          <img :src="!isChangingImage ? setLogo(user, user.role) : this.logo" @error="imageLoadError" v-if="!isChangingImage"/>
          <v-progress-circular
            :size="70"
            :width="7"
            color="primary"
            indeterminate
            alt="Company logo"
            v-else
          ></v-progress-circular>
        </section>
        <h5 class="headline font-weight-medium white--text text-center my-3">
          {{ (user.enterprise || {}).name }}
        </h5>
    </article>

    <v-divider></v-divider>

    <v-list avatar v-if="!$route.params.product">
      <template v-for="groupOrChild in groups">
        <x-menu-group
          v-if="groupOrChild.child"
          :key="groupOrChild.title"
          :title="groupOrChild.title"
          :icon="groupOrChild.icon"
          :child="groupOrChild.child"
          :goto="groupOrChild.goto"
          :goto-host="gotoHost"
          on-root
        >
        </x-menu-group>
        <x-menu-leaf
          v-else
          :key="groupOrChild.title"
          :title="groupOrChild.title"
          :path="groupOrChild.path"
          :icon="groupOrChild.icon"
          :goto="groupOrChild.goto"
          :goto-host="gotoHost"
          on-root
        >
        </x-menu-leaf>
      </template>
      <v-list-item
        @click="confirmLogout = true"
        class="x-list-leaf"
        style="background-color: #3b3b3b !important"
      >
        <v-list-item-action>
          <v-icon>mdi-logout</v-icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>{{ $t('Components.Navigation.logout') }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>

    <v-list avatar v-else>
      <template v-for="item in productNavigation">
        <x-menu-leaf
          :key="item.title"
          :title="item.title"
          :path="item.path"
          :icon="item.icon"
          :goto="item.goto"
          :goto-host="gotoHost"
          on-root
        >
        </x-menu-leaf>
      </template>
      <v-list-item
        @click="confirmLogout = true"
        class="x-list-leaf"
        style="background-color: #3b3b3b !important"
      >
        <v-list-item-action>
          <v-icon>mdi-logout</v-icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>{{ $t('Components.Navigation.logout') }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
    <!-- Logout Confirmation -->
    <x-confirm-logout
      :show.sync="confirmLogout"
      @close="confirmLogout = false"
    ></x-confirm-logout>
  </v-navigation-drawer>
</template>

<script>

import Vue from 'vue'
import { mapState } from 'vuex'

import { acl } from '../../acl'
import { baseGroups } from './base-groups'
import MenuGroup from './menu-group.vue'
import MenuLeaf from './menu-leaf.vue'

export default Vue.extend({
  components: {
    XMenuGroup: MenuGroup,
    XMenuLeaf: MenuLeaf
  },
  data () {
    return {
      confirmLogout: false,
      show: true,
      groups: null,
      isChangingImage: false,
      logo: '',
      gotoHost: {},
      baseUrl: document.location.host,
      productNavigation: [
        {
          title: 'go_back',
          path: '/measuring-tools',
          icon: 'arrow_back'
        }
      ]
    }
  },
  computed: {
    ...mapState({
      user: (state) => state.session.user
    })
  },
  watch: {
    $route (nextRoute) {
      this.$nextTick(() => this.updateGroups(nextRoute))
    }
  },
  created () {
    this.build()
    this.updateGroups(this.$route)
    this.$store.dispatch('session/getSuiteHost')
      .then((res) => {
        if (res && res.clientUrl) {
          let urlSuite = res.clientUrl
          if (res.clientPort && res.clientPort !== 80) {
            urlSuite = `${urlSuite}:${res.clientPort}`
          }
          this.$set(this.gotoHost, 'suite', urlSuite)
        }
      })
  },
  methods: {
    imageLoadError () {
      this.isChangingImage = true
      setTimeout(() => {
        this.logo = `http://${this.baseUrl}/img/20200301_occ_solution_logo.png`
        this.isChangingImage = false
      }, 4000)
    },
    setLogo (user, role) {
      const enterprise = user.enterprise || {}
      if (role === 'admin' || !enterprise.logo) {
        return `http://${this.baseUrl}/img/20200301_occ_solution_logo.png`
      } else if (enterprise.logo) {
        return enterprise.logo
      }
    },
    build () {
      this.groups = baseGroups
        .map((child) => this.buildNode(child))
        .filter((child) => child !== null)
    },
    buildNode (node) {
      if (!node.child) {
        return this.optionIsVisible(node) ? node : null
      } else if (!this.optionIsVisible(node)) {
        return null
      }

      const child = node.child
        .map((child) => this.buildNode(child))
        .filter((child) => child)

      if (child.length === 1) {
        return child[0]
      } else if (child.length > 1) {
        return { ...node, child }
      } else {
        return null
      }
    },
    optionIsVisible (option) {
      const notHiddenForUser = !option.hiddenFor || !this.hideOption(option.hiddenFor)
      const permittedOption = option.permission ? acl.can(option.permission) : true

      return permittedOption && notHiddenForUser
    },
    hideOption (hiddenOptions) {
      const response = false
      for (const option of hiddenOptions) {
        let flag = null
        switch (option) {
          case 'noLeader':
            return !this.user.isLeader
          case 'admin':
            return this.user.role === 'admin'
          case 'admin&personal':
            flag = (this.user.role === 'admin' ||
              (this.user.role === 'customer' && this.user.customer.type === 'personal') ||
              (this.user.role === 'customer' && this.user.customer.type === 'commercial' && this.user.enterprise))
            if (!flag && this.user.role !== this.user.view && this.user.view !== 'admin') {
              return !flag
            }
            return flag
          case 'customer':
            return this.user.role === 'customer'
          case 'admin&employee':
            return this.user.role === 'employee' || this.user.role === 'admin'
          case 'customer&employee':
            return this.user.role === 'employee' || this.user.role === 'customer'
          case 'admin&customer':
            return this.user.role === 'customer' || this.user.role === 'admin'
          case 'admin&employee&commercial':
            return this.user.role === 'employee' || this.user.role === 'admin' || (this.user.customer && this.user.customer.type === 'commercial')
          case 'admin&employee&personal':
            return (this.user.role === 'employee' ||
              this.user.role === 'admin' ||
              (this.user.customer && this.user.customer.type === 'personal') ||
              (this.user.customer && this.user.customer.type === 'commercial' && this.user.enterprise))
          case 'commercial':
            return this.user.customer && this.user.customer.type === 'commercial'
          case 'onlyCustomerTemporalSession':
            return !(this.user.role === 'customer' && this.user.view === 'commercial')
          case 'commercialOrTemporalCommercialSession':
            return this.user.customer && this.user.customer.type === 'commercial' && (!(this.user.role === 'customer' && this.user.view === 'commercial'))
          case 'employee':
            return this.user.role === 'employee' || this.user.view === 'employee'
          default:
            return response
        }
      }
    },
    updateGroups (currentRoute) {
      this.groups.forEach(group => {
        if (!group.child) {
          return
        }
        group.open = group.child.find((option) => option.path === currentRoute.path) !== undefined
      })
    },
    toggle () {
      this.show = !this.show
    }
  }
})
</script>
