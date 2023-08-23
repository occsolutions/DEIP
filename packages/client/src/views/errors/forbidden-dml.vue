
<template>
  <v-app>
    <v-main>
      <v-container style="backgorund-coler: grey;">
        <v-row justify="end" class="mt-2" align="end" style="height: 300px;">
          <v-col md="6">
            <img src="img/2-403-OCC.svg" alt="403 Por Error">
          </v-col>
        </v-row>
        <v-row justify="end" class="mt-2">
          <v-col md="6" class="text-end">
            <p>
              <strong>{{ $t('errors.apology') }}</strong>
              <br>
              {{ $t('errors.forbidden') }}
            </p>
          </v-col>
        </v-row>
        <v-row justify="end" class="mt-2">
          <v-col md="6" class="text-end">
            <v-btn small>{{ $t('errors.back_home') }}</v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import Vue from 'vue'

export default Vue.extend()
</script>
