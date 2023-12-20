
<template>
  <v-app>
    <x-navigation ref="navigation"></x-navigation>

    <v-app-bar
      color="#3899da"
      dark
      style="border-bottom:1px solid rgba(0,0,0,.12) !important;"
      app
      fixed
      clipped-left
      text
    >
      <v-app-bar-nav-icon @click.stop="toggleNavigation" text></v-app-bar-nav-icon>

      <img src="/img/20231120_occ_deip_logo_w.png" style="height: 100%" class="ml-n1 pl-0" alt="OCC - Solutions logo"/>

      <v-spacer></v-spacer>
      <!--
      <v-select dense hide-details
        v-model="language"
        :items="computedLanguages"
        :menu-props="{ top: false, left: true, offsetY: true }"
        class="styled-select mb-2 mr-3"
        @change="changeLocale"
      ></v-select>
      -->
      <v-menu
        v-model="openMenu"
        :nudge-width="296"
        :nudge-bottom="40"
        :nudge-left="295"
        transition="slide-y-transition"
      >
        <template v-slot:activator="{ on }">
          <v-btn text
            v-on="on"
            class="mr-1"
          >
            <v-icon large>mdi-apps</v-icon>
          </v-btn>
        </template>
        <v-card tile style="max-width: 22.7em">
          <v-row no-gutters v-if="loadingProducts">
            <v-col cols="12" class="py-12 text-center">
              <v-progress-circular indeterminate
                :width="4"
                :size="54"
                color="primary"
                class="mx-auto"
              ></v-progress-circular>
              <p class="mt-1 mb-0 pl-3 caption grey--text text--darken-2">
                {{ $t('Views.AppLayout.waiting') }}...
              </p>
            </v-col>
          </v-row>
          <v-list v-else style="max-height: 77vh" class="py-0 overflow-y-auto">
            <v-list-item>
              <v-list-item-content class="pb-0">
                <v-row>
                  <template v-for="item in products">
                    <v-col cols="6" :key="item.name" style="cursor: pointer">
                      <a :href="item.url">
                        <img :src="item.logo || item.defaultLogo"
                          alt="System Logo"
                          :style="item.name === 'occ'
                            ? 'max-height: 50px; max-width: 150px; margin-left: 1em;margin-top: 1.5em;'
                            : item.name.includes('LIDERAZGO')
                              ? 'margin-top: 0.5em; max-width: 160px'
                              : 'max-width: 150px'
                          "
                        />
                      </a>
                    </v-col>
                  </template>
                </v-row>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card>
      </v-menu>

      <v-tooltip left v-if="['customer', 'enterprise_admin'].includes(user.role)">
        <template v-slot:activator="{ on }">
          <v-btn text fab
            v-on="on"
            href="https://occ-solutions.com/ayuda/"
            class="mr-1 elevation-0"
            target="_blank"
          >
            <v-icon>mdi-help-circle</v-icon>
          </v-btn>
        </template>
        <span>{{ $t('Views.AppLayout.app_bar_text_manual') }}</span>
      </v-tooltip>

      <v-menu v-model="menu" :close-on-content-click="false" :nudge-width="200" offset-y>
        <template v-slot:activator="{ on }">
          <v-btn v-on="on" class="elevation-0" fab color="white">
            <span class="headline primary--text">{{ user.email | initials }}</span>
          </v-btn>
        </template>
        <v-card>
          <v-divider></v-divider>
          <v-list dense>
            <template v-if="user.role !== 'employee'">
              <v-list-item>
                <v-row>
                  <v-col md="3">
                    <div style="background-color: #3899da; width: 52px; height: 52px; padding-left: 2px; padding-top: 2px; border-radius: 50%">
                      <v-avatar color="white" size="48">
                        <span class="headline">{{ user.email | initials }}</span>
                      </v-avatar>
                    </div>
                  </v-col>
                  <v-col md="9">
                    <p>
                      <span class="text-capitalize">
                        {{
                          user.role === 'customer'
                            ? user.customer.name
                            : user.role === 'enterprise_admin'
                              ? 'Co-Admin.'
                              : 'Super Admin.'
                        }}
                      </span><br>
                      <span style="font-size: .9em">{{user.email}}</span>
                    </p>
                  </v-col>
                </v-row>
              </v-list-item>
              <v-divider></v-divider>
              <v-list-item class="text-center" @click="goProfile" v-if="user.role === 'customer' && user.customer.type === 'commercial'">
                <v-list-item-title>
                  <v-icon small>fa-eye</v-icon>
                  {{ $t('Views.AppLayout.app_bar_action_view_profile') }}
                </v-list-item-title>
              </v-list-item>
            </template>
            <v-list-item @click="confirmLogout = true" class="text-center">
              <v-list-item-title style="color: #3899dac7">
                <v-icon color="#3899dac7" small>mdi-logout-variant</v-icon>
                {{ $t('Views.AppLayout.app_bar_action_logout') }}
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-card>
      </v-menu>
    </v-app-bar>

    <v-main class="grey lighten-3">
      <v-container fluid fill-height :class="{'pa-0': $vuetify.breakpoint.xs}">
        <v-layout :class="{'pa-0': $vuetify.breakpoint.xs}" justify-center>
          <router-view />
        </v-layout>
      </v-container>
    </v-main>

    <v-footer style="border-top:1px solid rgba(0,0,0,.12) !important;" color="white" app inset>
      <span class="black--text">&nbsp;&nbsp;{{ $t('Views.AppLayout.footer_copyright') }}.</span>
    </v-footer>
    <v-dialog v-model="showSnackbarDialog" width="40em">
      <v-card>
        <v-card-title class="headline grey lighten-2" primary-title>
          {{ $t('Views.AppLayout.session_as_dialog_title') }}
        </v-card-title>
        <v-card-text>{{ $t(`Views.AppLayout.${snackMsg}`) }}</v-card-text>
        <v-divider></v-divider>
        <v-card-actions style="flex-wrap: wrap">
          <v-spacer v-if="$vuetify.breakpoint.smAndUp"></v-spacer>
          <template v-if="doubleOrigin">
            <v-btn color="#eb604c" text :href="`${this.suiteWeb}/wp/cfs/customer`">
              <strong>{{ $t('Views.AppLayout.session_as_dialog_action_close_session_as_customer') }}</strong>
            </v-btn>
            <v-btn class="ml-0" color="#eb604c" text :href="`${this.suiteWeb}/wp/cfs/enterprise`">
              <strong>{{ $t('Views.AppLayout.session_as_dialog_action_close_session_as_enterprise') }}</strong>
            </v-btn>
          </template>
          <v-btn v-else color="#eb604c" text :href="`${this.suiteWeb}/wp/cfs`">
            <strong>{{ $t('Views.AppLayout.session_as_dialog_action_close_session') }}</strong>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-btn
      v-if="showSnackbar"
      color="#424242"
      dark fixed bottom right fab
      @click="showSnackbarDialog = true"
      class="mb-10 mr-3"
    >
      <v-icon>mdi-logout</v-icon>
    </v-btn>
    <x-alert></x-alert>
    <x-help-modal></x-help-modal>
    <x-loading></x-loading>
    <!-- Logout Confirmation -->
    <x-confirm-logout
      :show.sync="confirmLogout"
      @close="confirmLogout = false"
    ></x-confirm-logout>
  </v-app>
</template>

<script>

import { mapState } from 'vuex'

import ProductsService from '../services/products'

export default {
  data () {
    return {
      openMenu: false,
      confirmLogout: false,
      menu: false,
      language: 'es',
      // notifications: this.getNotifications(),
      notifications: [],
      doubleOrigin: false,
      showSnackbar: false,
      snackMsg: 'session_as_dialog_text_logged_as_customer',
      host: null,
      showSnackbarDialog: false,
      suiteWeb: '',
      loadingProducts: true,
      products: [],
      options: {
        filter: null,
        search: null
      },
      enterprises: null,
      secondMenu: false
    }
  },
  computed: {
    computedLanguages () {
      const langs = []
      const availableLanguages = this.$t('languages')
      for (const key in availableLanguages) {
        langs.push({ value: key, text: availableLanguages[key] })
      }
      return langs
    },
    ...mapState({
      user: state => state.session.user
    })
  },
  watch: {
    openMenu (val) {
      if (val && !this.products.length) {
        this.loadProducts()
      }
    }
  },
  methods: {
    changeLocale (e) {
      this.$i18n.locale = e
    },
    goProfile () {
      this.$router.push('/commercial-profile')
      this.menu = !this.menu
    },
    toggleNavigation () {
      this.$refs.navigation.toggle()
    },
    closeMenu () {
      this.menu = !this.menu
    },
    getProducts () {
      const roles = ['customer', 'enterprise_admin']
      if (this.user.role === 'admin' && this.user.role === this.user.view) {
        return ProductsService.listActive()
          .then(res => { this.products = res })
      } else if (roles.includes(this.user.role) || roles.includes(this.user.view)) {
        return ProductsService.listByCustomer()
          .then(res => { this.products = res })
      }
      return Promise.resolve([])
    },
    loadProducts () {
      this.getProducts()
        .then(() => {
          this.products.unshift({
            name: 'OCC SUITE',
            logo: `${this.suiteWeb}/img/20200301_occ_solution_logo.png`,
            url: this.suiteWeb
          })
          if (this.host && this.host.reference) {
            const por = this.products.find(prod => prod.id === this.host.reference)
            if (por) {
              this.products.splice(this.products.indexOf(por), 1)
            }
          }
          let imageLoaded = 0
          for (const prod of this.products) {
            const img = new Image()
            img.src = prod.logo || prod.defaultLogo
            img.onload = () => {
              imageLoaded++
              if (imageLoaded === this.products.length) {
                setTimeout(() => {
                  this.loadingProducts = false
                }, 400)
              }
            }
          }
        })
    }
  },
  created () {
    this.language = this.user.lang
    this.$i18n.locale = this.language
    this.$store.dispatch('loading/show')
    if (this.user.role === 'customer' && this.user.customer.type === 'commercial') {
      // this.fetchEnterprises()
    }
    if (this.user.origin) {
      this.showSnackbar = true
      this.doubleOrigin = !!this.user.origin.origin
      if (this.user.role === 'customer' && this.user.customer.type === 'commercial' && this.user.enterprise) {
        this.snackMsg = this.doubleOrigin ? 'session_as_dialog_text_logged_as_enterprise_superadmin' : 'session_as_dialog_text_logged_as_enterprise'
      } else {
        this.snackMsg = 'session_as_dialog_text_logged_as_customer'
      }
    }

    this.$store.dispatch('session/getDeipHost')
      .then(res => {
        this.host = res
        return this.$store.dispatch('session/getSuiteWebHost')
      })
      .then(res => {
        if (res) {
          this.$set(this, 'suiteWeb', res)
        }
      })
      .finally(() => {
        this.$store.dispatch('loading/hide')
      })
  },
  mounted () {
    const urlString = window.location.href
    const url = new URL(urlString)
    const updatedAt = url.searchParams.get('updatedAt')
    if (updatedAt) {
      console.log('Updated at 2023-12-20 12:00')
    }
  }
}
</script>

<style scoped>

.styled-select,
.styled-select label[for] {
  max-width: 100px;
  font-size: 10pt;
}

::v-deep .styled-select .v-select__selection {
  font-size: 13px;
}

.unread {
  background-color: #3899da47;
}

.unread:hover {
  background-color: white;
}

.seemore {
  text-align: center;
}

.no-decoration {
  text-decoration: none;
}

.font-unread {
  color: midnightblue;
}

.see-more-btn {
  background-color: #e0e0e087;
}

.see-more-btn:hover {
  background-color: aliceblue;
}

.read {
  cursor: auto;
}
</style>
