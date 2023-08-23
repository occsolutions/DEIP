<template>
  <v-dialog v-model="showModalConfirm" width="600px" persistent>
    <v-card>
      <v-card-title>
        <v-row>
          <v-col cols="12" class="text-center">
            <span
              class="headline font-weight-black"
              v-html="confirmText"
            >
            </span>
          </v-col>
        </v-row>
      </v-card-title>
      <v-card-text>
        <v-row class="mt-4 text-center">
          <v-col cols="6">
            <span class="headline" style="font-weight: bold;">{{ costText }}: </span>
          </v-col>
          <v-col cols="6">
            <span class="headline" style="font-weight: bold;">{{ $t('Components.Dialogs.confirmSpend.your_balance') }}</span>
          </v-col>
        </v-row>
        <v-row class="text-center mb-4">
          <v-col cols="6">
            <v-chip
              class="ma-2"
              color="red"
              text-color="white"
            >
              {{price}}
            </v-chip>
            <span class="title">
              {{ $t('Components.Dialogs.confirmSpend.token_unit') }}
            </span>
          </v-col>
          <v-col cols="6">
            <v-chip
              class="ma-2"
              color="green"
              text-color="white"
            >
              {{balance}}
            </v-chip>
            <span class="title">
              {{ $t('Components.Dialogs.confirmSpend.token_unit') }}
            </span>
          </v-col>
        </v-row>
        <hr>
        <v-row class="mt-2">
          <v-col cols="12" v-if="!enoughBalance" class="title text-center text-uppercase red--text">
            {{ noBalanceMsg || noBalanceMsgByUser }}
            <v-col v-if="user.customer.type !== 'commercial'" cols="12" class="title text-center text-uppercase blue--text mt-2">
              <a :href="operationsLink" rel="noopener noreferrer" target="_blank">
                {{ $t('Components.Dialogs.confirmSpend.acquire_tokens') }}
              </a>
            </v-col>
            <v-col v-if="user.customer.type !== 'commercial'" cols="12" class="text-center text-uppercase white--text mt-2">
              <v-btn small color="blue white--text" @click="update">
                {{ $t('Components.Dialogs.confirmSpend.input_update') }}
              </v-btn>
            </v-col>
          </v-col>
          <v-col cols="12" v-else>
            <v-col cols="12" style="font-weight: bold;" class="title text-center text-uppercase">
              {{ $t('Components.Dialogs.confirmSpend.balance_after') }}
            </v-col>
            <v-col cols="12" class="title text-center text-uppercase">
              <v-chip
                class="ma-2"
                color="teal"
                text-color="white"
              >
                {{ (Number(balance) - Number(price) ) }}
              </v-chip>
              {{ $t('Components.Dialogs.confirmSpend.token_unit') }}
            </v-col>
          </v-col>
          <v-col cols="12" v-if="noActiveEmployee" class="title text-center text-uppercase red--text">
            {{ $t('Components.Dialogs.confirmSpend.non_active_employees') }}
          </v-col>
        </v-row>
        <v-row v-if="noBalanceResponse">
          <v-col cols="12" class="title text-center text-uppercase blue--text mt-2">
            <div> {{ $t('Components.Dialogs.confirmSpend.operation_failed') }} </div>
            <a :href="operationsLink" rel="noopener noreferrer" target="_blank">
              {{ $t('Components.Dialogs.confirmSpend.acquire_tokens') }}
            </a>
          </v-col>
          <v-col cols="12" class="text-center text-uppercase white--text mt-2">
            <v-btn small color="blue white--text" @click="update">
              {{ $t('Components.Dialogs.confirmSpend.input_update') }}
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-row class="pa-2 ma-0">
          <v-col cols="12" sm="6">
            <v-btn block large @click="closeModal">{{ $t('Components.Dialogs.confirmSpend.input_cancel') }}</v-btn>
          </v-col>
          <v-col cols="12" sm="6">
            <v-btn block large class="white--text" color="primary" :disabled="!canCreate || !disableButtonModal" @click="create">{{ $t('Components.Dialogs.confirmSpend.input_confirm_save') }}</v-btn>
          </v-col>
        </v-row>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import Vue from 'vue'
import { mapState } from 'vuex'

export default Vue.extend({
  props: {
    confirmText: String,
    costText: String,
    showModalConfirm: Boolean,
    balance: Number,
    price: Number,
    noBalanceMsg: String,
    noBalanceResponse: Boolean,
    noActiveEmployee: Boolean,
    disableButtonModal: Boolean
  },
  data () {
    return {
      operationsLink: ''
    }
  },
  computed: {
    ...mapState({ user: (state) => state.session.user }),
    noBalanceMsgByUser () {
      return this.user.customer.type === 'personal' ? this.$t('Components.Dialogs.confirmSpend.no_balance') : this.$t('Components.Dialogs.confirmSpend.no_balance_msg')
    },
    enoughBalance () {
      return this.balance >= this.price
    },
    canCreate () {
      return (this.balance - this.price) >= 0 || this.user.customer.type === 'commercial'
    }
  },
  methods: {
    create () {
      this.$emit('result', 1)
    },
    closeModal () {
      this.$emit('result', 0)
    },
    update () {
      this.$emit('update')
    }
  },
  created () {
    this.$store.dispatch('session/getSuiteWebHost')
      .then((res) => {
        if (res) {
          this.operationsLink = `${res}/tokens/operations`
        }
      })
  }
})
</script>
