
<template>
  <v-container fluid class="pa-0">
    <v-card v-if="!completed" class="mt-6 mb-0 mx-3">
      <!-- Header -->
      <v-row justify="center">
        <v-col cols="12" sm="12" md="8" class="pt-6">
          <section class="enterprise-logo">
            <img
              :src="evaluation.enterprise.logo
                ? evaluation.enterprise.logo
                : '/img/20200301_occ_solution_logo.png'
              "
              alt="Enterprise Logo"
            />
          </section>
        </v-col>
        <v-col cols="12" class="pb-2 text-center">
          <v-card flat>
            <h1 class="display-1">{{ evaluation.displayName || evaluation.name }}</h1>
          </v-card>
        </v-col>
      </v-row>

      <!-------------------------------------------->
      <!-------------- Poll Questions -------------->
      <!-------------------------------------------->
      <v-card-text>
        <ValidationObserver ref="poll_validation">
          <template v-for="(item, i) in pages[currentPage]">
            <!--------------------------------------------->
            <!---------- Additional Segmentation ---------->
            <!--------------------------------------------->
            <div v-if="hasSegmentation && currentPage === 0"
              :key="`${currentPage}-${i}`"
            >
              <v-divider v-if="i > 0" class="mt-4 grey lighten-3"></v-divider>
              <h5 class="mt-6 text-left headline">
                {{ item.trans[lang].label }}
              </h5>
              <v-row>
                <v-col cols="12" class="pt-0">
                  <ValidationProvider rules="required">
                    <v-radio-group dense hide-details
                      v-model="evaluated.temp.segmentation[i].detailId"
                      class="mt-4 mx-4 justify-left"
                      style="max-width: fit-content;"
                    >
                      <v-radio v-for="option in item.details"
                        :key="option.code"
                        :value="option.id"
                        :label="option.trans[lang].label"
                        color="primary"
                        @change="saveAnswers()"
                      ></v-radio>
                    </v-radio-group>
                  </ValidationProvider>
                </v-col>
              </v-row>
            </div>

            <!--------------------------------------------->
            <!---------- Questionnaire Questions ---------->
            <!--------------------------------------------->
            <div v-else-if="qPages.includes(computedQuestionnairePages)"
              :key="`${currentPage}-${i}`"
            >
              <div
                v-if="!item.parent || parentAnsweredTrue(item.parent, evaluated.temp.evaluations[computedQuestionnairePages - 1].attribute[i])"
                :class="item.parent ? 'pl-9' : 'pl-1'"
              >
                <v-divider v-if="i > 0" class="mt-5 grey lighten-3"></v-divider>
                <!-- Question -->
                <x-poll-question
                  :question="item"
                  :lang="lang"
                />
                <v-row>
                  <!-- Answer options -->
                  <v-col cols="12" class="pt-0">
                    <ValidationProvider rules="required">
                      <!-- Type Likert -->
                      <v-row no-gutters
                        v-if="item.type === 'likert'"
                      >
                        <v-text-field v-show="false"
                          v-model="evaluated.temp.evaluations[computedQuestionnairePages - 1].attribute[i].score"
                          class="hidden-field"
                        ></v-text-field>
                        <v-col cols="12" xs="12" sm="4" md="1"
                          v-for="(option, $i) in questionsTypes.find(qT => qT.type === item.type).options"
                          :key="`face-${$i}`"
                          class="mb-n2 pt-7 mx-auto text-center"
                        >
                          <v-btn icon large
                            :ripple="false"
                            :class="evaluated.temp.evaluations[computedQuestionnairePages - 1].attribute[i].score[0] === option.value ? faces[parseFloat(option.value)].class : 'grey'"
                            @click="setFaceAnswer(i, option.value)"
                          >
                            <v-icon color="white" x-large>{{ faces[parseFloat(option.value)].icon }}</v-icon>
                          </v-btn>
                          <div v-html="option.label[lang]"
                            class="pt-1 cursor-pointer"
                            @click="setFaceAnswer(i, option.value)"
                          ></div>
                        </v-col>
                      </v-row>
                      <!-- Type Closed -->
                      <div v-else-if="item.type === 'closed'">
                        <v-radio-group dense hide-details
                          v-model="evaluated.temp.evaluations[computedQuestionnairePages - 1].attribute[i].score"
                          class="mt-4 justify-left"
                          :class="computedQuestionnairePages > 1 ? 'mx-11' : 'mx-7'"
                          style="max-width: fit-content;"
                          @change="saveAnswers()"
                        >
                          <v-radio
                            v-for="(option, j) in questionsTypes.find(qT => qT.type === item.type).options"
                            :key="`aref-${i}-${j}`"
                            :value="[parseFloat(option.value)]"
                            :label="option.label[lang]"
                            color="primary"
                          ></v-radio>
                        </v-radio-group>
                      </div>
                      <!-- Type Options -->
                      <div v-else class="mt-4">
                        <v-checkbox multiple hide-details
                          v-for="option in item.options"
                          v-model="evaluated.temp.evaluations[computedQuestionnairePages - 1].attribute[i].score"
                          :key="`bref-${i}-${option.value}`"
                          :value="parseFloat(option.value)"
                          :label="option.label[lang]"
                          class="mt-2 justify-left"
                          :class="computedQuestionnairePages > 1 ? 'mx-11' : 'mx-7'"
                          style="max-width: fit-content;"
                          :disabled="isOptLimited(item, option, i) || isOptExclusive(option, i)"
                          @change="saveAnswers()"
                        />
                      </div>
                    </ValidationProvider>
                  </v-col>
                </v-row>
              </div>
            </div>

            <!-------------------------------------------->
            <!----------- Additional Questions ----------->
            <!-------------------------------------------->
            <div v-else-if="hasAdditionalQuestions && computedQuestionnairePages === isLeader ? 7 : 6"
              :key="`${currentPage}-${i}`"
            >
              <v-divider v-if="i > 0" class="mt-4 grey lighten-3"></v-divider>
              <h5 class="mt-6 text-left headline">
                {{ item.question }}
              </h5>
              <v-row>
                <v-col cols="12" class="pt-0">
                  <ValidationProvider rules="required">
                    <v-radio-group dense hide-details
                      v-model="evaluated.temp.additional[i].answer[0]"
                      class="mt-4 mx-4 justify-left"
                      style="max-width: fit-content;"
                    >
                      <v-radio v-for="option in item.options"
                        :key="option"
                        :value="option"
                        :label="option"
                        color="primary"
                        @change="saveAnswers()"
                      ></v-radio>
                    </v-radio-group>
                  </ValidationProvider>
                </v-col>
              </v-row>
            </div>
          </template>
        </ValidationObserver>
      </v-card-text>
    </v-card>

    <!-------------------------------------------->
    <!-------------- Action Buttons -------------->
    <!-------------------------------------------->
    <v-row no-gutters justify="center">
      <v-col cols="12" class="py-7 text-center grey lighten-3">
        <v-btn large
          v-if="currentPage > 0"
          color="secondary lighten-3"
          class="mr-3 px-10"
          @click="currentPage--"
        >
          {{ $t('Views.Evaluations.evaluation.input_back') }}
        </v-btn>

        <v-btn large
          v-if="currentPage < pages.length - 1"
          color="primary"
          class="px-6"
          @click="changePage()"
        >
          {{ $t('Views.Evaluations.evaluation.input_next') }}
        </v-btn>

        <v-btn large v-else-if="!completed"
          color="primary"
          class="px-6"
          :disabled="progress !== 100"
          @click="showConfirmation = true"
        >
          {{ $t('Views.Evaluations.evaluation.input_finish') }}
        </v-btn>
      </v-col>
    </v-row>

    <!-- FAB Button -->
    <v-fab-transition v-if="!completed"
      style="bottom: 10px;"
    >
      <v-btn dark fixed bottom right fab x-large
        :color="colorProgress"
      >
        <span>{{ (progress.toFixed(0)) }}%</span>
      </v-btn>
    </v-fab-transition>

    <!-- Modals -->
    <x-wellcome-dialog
      :evaluation="evaluation"
      :start-dialog="startDialog"
      @close="() => this.startDialog = false"
    ></x-wellcome-dialog>
    <x-middle-dialog
      :middle-dialog="middleDialog"
      @close="() => this.middleDialog = false"
    ></x-middle-dialog>
    <x-info-dialog
      :dialog="outIntervalDialog"
      :icon="dialogIcon"
      :text="dialogText"
    ></x-info-dialog>
    <x-confirmation-modal
      :show.sync="showConfirmation"
      :title="$t('Views.Evaluations.evaluation.confirmation_modal_title')"
      :action="finishEvaluatedPoll"
      color="#1B5E20"
      @close="showConfirmation = false"
    >
      <template v-slot:question>
        {{ $t('Views.Evaluations.evaluation.confirmation_modal_des') }}
      </template>
    </x-confirmation-modal>
    <x-end-dialog
      :lang="$i18n.locale"
      :show-dialog="endDialog"
    ></x-end-dialog>

    <x-loading></x-loading>
    <x-alert></x-alert>
  </v-container>
</template>

<style scoped>
  .v-slider__tick--filled {
    background-color: none;
  }
  .hidden-field {
    position: absolute;
    top: -1000px;
    left: -1000px;
  }
  .angry {
    background-color: #BB3E3E !important;
  }
  .sad {
    background-color: #B8663D !important;
  }
  .neutral {
    background-color: #C2B147 !important;
  }
  .happy {
    background-color: #B6C144 !important;
  }
  .veryhappy {
    background-color: #44C156 !important;
  }
</style>

<script src="./evaluation.js"></script>
