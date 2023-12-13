
<template>
  <v-row row wrap
    align="center"
    justify="center"
    v-if="evaluationSegmentation.length"
  >
    <v-col cols="12" sm="6"
      v-for="item in evaluationSegmentation"
      :key="`evSeg-${item.id}`"
      v-ripple="{ center: true }"
      v-bind:style="'margin-right:auto'"
    >
      <v-autocomplete multiple outlined light
        v-model="segmentationSelected[item.id]"
        :items="item.details"
        :label="item.trans[user.lang].label"
        @change="calculateTotal($event, `segmentation${item.id}Id`)"
      >
        <template v-slot:selection="{ item }">
          <v-chip>
            <span>{{ item.text }}</span>
          </v-chip>
        </template>
      </v-autocomplete>
    </v-col>
    <!------------------------------>
  </v-row>
</template>

<script>
import { mapState } from 'vuex'

export default {
  data () {
    return {
      evaluationSegmentation: [],
      segmentationSelected: {}
    }
  },
  props: {
    additionalSegmentation: Object,
    calculateTotal: Function
  },
  computed: {
    ...mapState({
      user: (state) => state.session.user
    })
  },
  methods: {
    //
  },
  mounted () {
    Object.keys(this.additionalSegmentation).forEach(key => {
      if (this.additionalSegmentation[key].selected) {
        this.$emit('set-segmentation-key', this.additionalSegmentation[key].id)
        const formattedDetails = this.additionalSegmentation[key].details.map(d => {
          return {
            ...d,
            value: d.id,
            text: d.trans[this.user.lang].label
          }
        })
        this.additionalSegmentation[key].details = formattedDetails
        this.evaluationSegmentation.push(this.additionalSegmentation[key])
      }
    })
  }
}
</script>
