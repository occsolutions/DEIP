
<template>
  <v-container fluid class="py-0 px-2 fill-height">
    <v-card height="100%" width="100%" class="occ-watermark">
      <!-- Header -->
      <v-card-title class="px-5 headline grey--text text--darken-3">
        <v-spacer></v-spacer>
        <!--
        <v-select dense hide-details
          v-model="language"
          :items="computedLanguages"
          :menu-props="{ top: false, left: true, offsetY: true }"
          class="styled-select mb-2 mr-3"
          style="max-width: 170px"
          @change="changeLocale"
        ></v-select>
        -->
      </v-card-title>

      <!-------------------------------------------->
      <!----------------- Results ------------------>
      <!-------------------------------------------->
      <v-card-text>
        <section class="enterprise-logo">
          <img src="/img/20220531_occ_energy_logo_2.png" />
        </section>
        <p class="mt-6 text-center display-1 grey--text text--darken-2">
          {{ $t('Views.Evaluations.report.individual.title') }}
        </p>
      </v-card-text>

      <!-------------------------------------------->
      <!-------------- Action Buttons -------------->
      <!-------------------------------------------->
      <v-card-actions class="card-actions">
        <v-row wrap row justify="center">
          <v-col cols="12" class="py-4 text-center">
            <v-btn large
              color="success"
              class="mr-3"
              :loading="loadingBtn"
              :disabled="!dataFetched"
              @click="openPdf"
            >
              <v-icon class="mr-3">mdi-file-pdf</v-icon>
              {{ $t('Views.Evaluations.report.download_report') }}
            </v-btn>
          </v-col>
        </v-row>
      </v-card-actions>
    </v-card>

    <x-loading></x-loading>
    <x-alert></x-alert>
    <canvas id="burnoutIndex" width="448" height="451" class="d-none"></canvas>
  </v-container>
</template>

<style scoped>
  .card-actions {
    position: absolute;
    bottom: 0;
    width: 100%;
  }
  .occ-watermark {
    display: block;
    position: relative;
    background: url('/img/20200301_w_occ_solution_logo.png');
    background-position: left -270px bottom -440px;
    background-repeat: no-repeat;
    background-attachment: fixed;
  }
</style>

<script src="./results.js"></script>
