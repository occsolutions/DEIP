
<template>
  <v-card
    :color="color"
    :width="width"
    :height="height"
    :min-height="minHeight"
    :max-height="maxHeight"
    dark
    :style="{ cursor: cursor || '' }"
    style="padding: .5em;">
    <v-row justify="space-around" v-if="icon || img">
      <v-icon
        x-large
        color="white"
        v-if="icon"
        @click="iconAction ? iconAction() : (() => {})"
      >{{ icon }}</v-icon>
      <img
        :src="img"
        :height="imgHeight"
        :min-height="imgMinHeight"
        :max-height="imgMaxHeight"
        :width="imgWidth"
        :min-width="imgMinWidth"
        :max-width="imgMaxWidth"
        :alt="headerText || ''"
        v-else
        @click="iconAction ? iconAction() : (() => {})"
        />
    </v-row>
    <v-row justify="space-around" style="margin-top: 1em; margin-bottom: 1em" v-if="headerText">
      <h2 class="text-uppercase">{{ headerText }}</h2>
    </v-row>
    <v-row justify="space-around" style="padding-left: 3.5em; padding-right: 3.5em" v-if="text">
      <p style="text-align: center">{{ text }}</p>
    </v-row>
    <v-row justify="space-around" style="margin-top: 1em; margin-bottom: 1em" v-if="actionText">
      <v-btn text class="text-capitalize" @click="action ? action() : (() => {})">{{ actionText }}</v-btn>
    </v-row>
  </v-card>
</template>

<script>

import Vue from 'vue'

export default Vue.extend({
  props: {
    color: String,
    icon: String,
    img: String,
    imgHeight: String,
    imgMinHeight: String,
    imgMaxHeight: String,
    imgWidth: String,
    imgMinWidth: String,
    imgMaxWidth: String,
    headerText: String,
    text: String,
    action: Function,
    iconAction: Function,
    actionText: String,
    height: String,
    minHeight: String,
    maxHeight: String,
    width: String,
    minWidth: String,
    maxWidth: String,
    cursor: String
  }
})
</script>
