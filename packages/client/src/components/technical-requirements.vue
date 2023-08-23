<template>
  <v-container fluid class="technical-requirements">
    <v-row>
      <v-col>
        <h5 class="headline grey--text">{{ $t('Components.TechnicalRequirements.requirements_title') }}</h5>
        <p class="mt-4 mb-0 body-2 grey--text text--darken-3">
          <v-icon class="mb-1" color="warning">mdi-alert</v-icon>
          {{ $t('Components.TechnicalRequirements.requirements_subtitle') }}
        </p>
      </v-col>
    </v-row>
    <v-divider class="mt-1 mb-3"></v-divider>
    <v-row>
      <v-col v-for="i in [1,2,3]" :key="i" cols="12" sm="4">
        <v-card outlined :class="['red', `lighten-${3 + (i - 1)}`]" class="info-card">
          <v-card-text>
            <h5 class="mb-3">{{ $t(`Components.TechnicalRequirements.requirements_title_${i}`) }}</h5>
            <p style="line-height: 18px;font-family: Helvetica, Arial, sans-serif;font-size: 14px;">
              {{ $t(`Components.TechnicalRequirements.requirements_title_list_${i}`) }}
            </p>
            <ul style="list-style: none;line-height: 20px;" class="blue--text pl-3">
              <li v-for="(text, j) in $t(`Components.TechnicalRequirements.requirements_title_listitems_${i}`)" :key="j">
                {{ text }}
              </li>
            </ul>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12">
        <v-card outlined class="grey--text pa-4" style="border: 1px solid darkgrey;">
          <v-card-text class="align-center">
            <h5>{{ $t('Components.TechnicalRequirements.requirements_title_4') }}</h5>
          </v-card-text>
          <v-row>
            <v-col
              v-for="(navigator, k) in $t('Components.TechnicalRequirements.requirements_title_listitems_4')"
              :key="k"
              class="text-center"
            >
              <img :src="`/img/${iconIsNavigator(navigator)}`"
                alt="navigator"
                style="width: 40px;"><br/>
                {{ navigator }}
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  methods: {
    iconIsNavigator (text) {
      let navigator = ''
      if (text.includes('Chrome')) {
        navigator = 'chrome.png'
      } else if (text.includes('Firefox')) {
        navigator = 'firefox.png'
      } else if (text.includes('Opera')) {
        navigator = 'opera.png'
      } else if (text.includes('Edge')) {
        navigator = 'edge.png'
      }
      return navigator
    }
  }
}
</script>
<style>
.technical-requirements .v-card__title {
  word-break: break-word;
}
</style>
