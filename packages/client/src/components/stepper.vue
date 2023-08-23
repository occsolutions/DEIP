
<template>
  <v-stepper v-model="internaStep" class="x-stepper">
    <v-stepper-header>
      <template v-for="(header, $i) in headers">
        <v-stepper-step
          :key="`${$i}-step`"
          :complete="step > ($i + initialStep)"
          :step="($i + initialStep)"
          :editable="editable"
          v-if="stepsVisible[+$i]"
        >{{ $t(header) }}
        </v-stepper-step>
        <v-divider :key="$i" v-if="divider && $i !== steps"></v-divider>
      </template>
    </v-stepper-header>
    <v-stepper-items>
      <slot></slot>
    </v-stepper-items>
  </v-stepper>
</template>

<script>

import Vue from 'vue'

const getNearbies = (total, current, max) => {
  const half = Math.floor(max / 2)
  const nearbies = []
  // let missings = max
  let init = 0
  let end = 0
  if (max <= 1) {
    init = end = current
  } else if (max === 2) {
    if (current === total) {
      init = current - 1
      end = current
    } else {
      init = current
      end = current + 1
    }
  } else {
    init = current > 1 && current >= half ? current - half : 0
    end = current + half >= total ? total : current + half + (!init ? ((current - half) * -1) : 0)
    if (end === total) {
      init = init - ((current + half) - total)
    }
  }

  for (let i = 1; i <= total; i++) {
    nearbies.push(init <= i && end >= i)
  }

  return nearbies
}

export default Vue.extend({
  name: 'stepper',
  props: {
    headers: {
      type: Array,
      required: true
    },
    step: {
      type: Number,
      required: true
    },
    initialStep: { type: Number, default: 1 },
    maxXs: { type: Number, default: 1 },
    maxSm: { type: Number, default: 2 },
    maxMd: { type: Number, default: 3 },
    maxLg: { type: Number, default: 4 },
    maxXl: { type: Number, default: 5 },
    editable: Boolean,
    divider: Boolean
  },
  data () {
    return {
      internaStep: 0,
      stepsVisible: [],
      xsLength: 0,
      smLength: 0,
      mdLength: 0,
      lgLength: 0,
      xlLength: 0
    }
  },
  watch: {
    maxXs () {
      this.updateLength()
    },
    maxSm () {
      this.updateLength()
    },
    maxMd () {
      this.updateLength()
    },
    maxLg () {
      this.updateLength()
    },
    maxXl () {
      this.updateLength()
    },
    step () {
      this.internaStep = this.step
      if (this.step >= this.initialStep || this.step <= this.headers.length) {
        this.updateVisible()
      }
    },
    internaStep () {
      this.$emit('step', this.internaStep)
    }
  },
  methods: {
    updateLength () {
      this.xsLength = this.maxXs > 0 ? this.maxXs : 1
      this.smLength = this.maxSm > this.xsLength ? this.maxSm : this.xsLength
      this.mdLength = this.maxMd > this.smLength ? this.maxMd : this.smLength
      this.lgLength = this.maxLg > this.mdLength ? this.maxLg : this.mdLength
      this.xlLength = this.maxXl > this.lgLength ? this.maxXl : this.lgLength
    },
    updateVisible () {
      this.stepsVisible = getNearbies(this.headers.length, this.step, this.getMaxLength())
    },
    getMaxLength () {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs': return this.xsLength
        case 'sm': return this.smLength
        case 'md': return this.mdLength
        case 'lg': return this.lgLength
        case 'xl': return this.xlLength
      }
    }
  },
  created () {
    this.internaStep = this.step
    this.updateLength()
    this.updateVisible()
  }
})
</script>

<style>
.x-stepper .v-stepper__label{
  display: inline-flex !important;
}

.x-stepper .v-stepper__step__step{
  margin-right: 8px !important;
}
</style>
