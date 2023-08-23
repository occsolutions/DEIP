
<template>
  <v-col cols="12" sm="6" md="5" :class="color">
    <v-card rounded class="rounded-lg" :elevation="answer ? 10 : 1">
      <v-card-text>
        {{ text }}
        <v-divider></v-divider>
      </v-card-text>
      <v-card-actions class="text-center">
        <v-spacer></v-spacer>
        <v-chip
          :color="value === 1 ? '#BB3E3E': 'default'"
          @click="setValue(1)">
          <strong v-if="value === 1" style="color:#fff">1</strong>
          <strong v-else>1</strong>
        </v-chip>
        <v-spacer></v-spacer>
        <v-chip
          :color="value === 2 ? '#B8663D': 'default'"
          @click="setValue(2)">
          <strong v-if="value === 2" style="color:#fff">2</strong>
          <strong v-else>2</strong>
        </v-chip>
        <v-spacer></v-spacer>
        <v-chip
          :color="value === 3 ? '#C2B147': 'default'"
          @click="setValue(3)">
          <strong v-if="value === 3" style="color:#fff">3</strong>
          <strong v-else>3</strong>
        </v-chip>
        <v-spacer></v-spacer>
        <v-chip
          :color="value === 4 ? '#B6C144': 'default'"
          @click="setValue(4)">
          <strong v-if="value === 4" style="color:#fff">4</strong>
          <strong v-else>4</strong>
        </v-chip>
        <v-spacer></v-spacer>
        <v-chip
          :color="value === 5 ? '#44C156': 'default'"
          @click="setValue(5)">
          <strong v-if="value === 5" style="color:#fff">5</strong>
          <strong v-else>5</strong>
        </v-chip>
        <v-spacer></v-spacer>
        <v-chip
          :color="value === 6 ? '#1B5E20': 'default'"
          @click="setValue(6)">
          <strong v-if="value === 6" style="color:#fff">6</strong>
          <strong v-else>6</strong>
        </v-chip>
        <v-spacer></v-spacer>
      </v-card-actions>
    </v-card>
  </v-col>
</template>

<script>
import Vue from 'vue'

export default Vue.extend({
  props: {
    text: String,
    answer: Number,
    color: String
  },
  data () {
    return {
      value: 0
    }
  },
  methods: {
    setValue ($event) {
      this.$emit('click', $event)
    }
  },
  watch: {
    answer: {
      handler () {
        this.value = this.answer
      },
      immediate: true
    }
  }
})
</script>
