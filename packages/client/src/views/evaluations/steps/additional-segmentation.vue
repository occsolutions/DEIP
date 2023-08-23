<template>
  <v-container flat>
    <v-card flat>
      <v-row>
        <v-col class="headline pb-0">
          {{ $t('Views.Evaluations.stepAdditionalSegmentation.title') }}
          <v-divider></v-divider>
        </v-col>
      </v-row>
      <v-card-subtitle class="pt-2 pb-8 px-0 body-2 text-justify">
        {{ $t('Views.Evaluations.stepAdditionalSegmentation.description') }}
      </v-card-subtitle>
      <!------------------------------------------------------------------------>
      <!--------------------- Segmentation Selection Table --------------------->
      <!------------------------------------------------------------------------>
      <v-row>
        <v-col cols="12" v-if="dataFetched && !segmentations.length">
          <v-alert text prominent type="warning" icon="mdi-shield-remove" class="text-center mt-3">
            <h3>
              {{ $t('Views.Evaluations.stepAdditionalSegmentation.no_segmentation_found') }}
            </h3>
          </v-alert>
        </v-col>
        <v-col cols="12" v-else
          class="pt-0 px-4"
        >
          <p class="mb-0 body-2 text-right font-weight-bold">
            {{ $t('Views.Evaluations.stepAdditionalSegmentation.selected') }}
            {{ selectedCount }}
          </p>
          <v-simple-table dense
            fixed-header
            class="segmentations-table"
          >
            <template v-slot:default>
              <thead>
                <tr>
                  <th class="py-2 pl-11 bordered-header">
                    Segmentación
                  </th>
                  <th class="py-2 pl-6">
                    Opciones
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(seg, i) in segmentations"
                  :key="`s-${i}-${seg.id}`"
                >
                  <template v-if="evaluation.additionalSegmentation[seg.code]">
                    <td class="pr-0 pl-3">
                      <v-checkbox dense hide-details
                        v-model="evaluation.additionalSegmentation[seg.code].selected"
                        :ripple="false"
                        :label="seg.trans[user.lang].label"
                        :disabled="evaluation.status === 'in_progress'"
                        color="primary"
                        class="mt-1 mb-2 small-label"
                        @click="selectedSegmentationsCounter()"
                      ></v-checkbox>
                    </td>
                    <td class="text-left spaced-cell">
                      <ul>
                        <li v-for="det in seg.details" :key="det.name" class="caption">
                          {{ det.trans[user.lang].label }}
                        </li>
                      </ul>
                    </td>
                  </template>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-col>
      </v-row>
      <!------------------------------------------------------------------------>
      <!---------------------------- Action Buttons ---------------------------->
      <!------------------------------------------------------------------------>
      <v-card-actions class="pa-0">
        <v-row>
          <v-col cols="12" sm="6" class="pb-1">
            <v-btn large block
              :disabled="loadingSegmentations"
              @click="changeStep(true)"
            >
              {{ $t(prevAction) }}
            </v-btn>
          </v-col>
          <v-col cols="12" sm="6" class="pb-1">
            <v-btn large block
              color="primary"
              :loading="loadingSegmentations"
              @click="changeStep()"
            >
              {{ $t(nextAction) }}
            </v-btn>
          </v-col>
        </v-row>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<style scoped>
  ::v-deep .small-label .v-label {
    font-size: 14px !important;
    color: #222222;
  }
  .segmentations-table {
    border-radius: 4px 0 0 4px;
    border: 1px solid #CCCCCC;
  }
  .segmentations-table tbody tr:hover {
    /*cursor: default;*/
    /*background-color: transparent !important;*/
  }
  ::v-deep .segmentations-table td {
    vertical-align: middle;
  }
  ::v-deep .segmentations-table .bordered-header {
    border-radius: 4px 0 0 0;
  }
  ::v-deep .segmentations-table .no-border {
    border-bottom: none !important;
  }
  ::v-deep .segmentations-table .spaced-cell {
    padding-top: 5px;
    padding-bottom: 4px;
  }
</style>

<script>
import Vue from 'vue'
import additionalSegmentationService from '../../../services/additional-segmentations'

export default Vue.extend({
  props: {
    isEdit: Boolean,
    evaluation: Object,
    user: Object,
    step: String,
    currentStep: Number,
    nextAction: String,
    prevAction: String
  },
  data () {
    return {
      selectedCount: 0,
      loadingSegmentations: false,
      dataFetched: false,
      segmentations: []
    }
  },
  watch: {
    currentStep: {
      handler (val) {
        if (val === 5 && !this.dataFetched) {
          this.getSegmentations()
        }
      },
      immediate: true
    },
    loadingSegmentations (val) {
      val ? this.$store.dispatch('loading/show') : this.$store.dispatch('loading/hide')
    }
  },
  methods: {
    getSegmentations () {
      const service = this.isEdit
        ? additionalSegmentationService.list()
        : additionalSegmentationService.listActive()

      this.loadingSegmentations = true
      service
        .then((res) => {
          if (res.items) {
            this.mapItems(res.items)
          }
          this.dataFetched = true
        })
        .catch((err) => {
          console.log(err)
        })
        .finally(() => {
          this.loadingSegmentations = false
        })
    },
    mapItems (items) {
      this.segmentations = items.map(item => {
        item.translations.forEach(t => {
          item.trans = item.trans ? item.trans : {}
          item.trans[t.lang] = item.translations.find(
            lang => lang.lang === t.lang
          ) || { label: '' }

          // Segmentation details/options
          item.details.map(detail => {
            detail.trans = detail.trans ? detail.trans : {}
            detail.trans[t.lang] = detail.translations.find(
              lang => lang.lang === t.lang
            ) || { label: '' }
          })
        })

        if (this.isEdit) {
          this.selectedSegmentationsCounter()
        } else {
          this.evaluation.additionalSegmentation[item.code] = {
            id: item.id,
            selected: false,
            trans: item.trans,
            details: item.details
          }
        }

        return item
      })
    },
    selectedSegmentationsCounter () {
      let cnt = 0
      setTimeout(() => {
        for (const key of Object.keys(this.evaluation.additionalSegmentation)) {
          if (this.evaluation.additionalSegmentation[key].selected) {
            cnt++
          }
        }
        this.selectedCount = cnt
      }, 140)
    },
    changeStep (isBack = false) {
      this.$emit('changeStep', this.evaluation, isBack ? +this.step - 1 : +this.step + 1)
    }
  }
})
</script>
