
<template>
  <v-container fluid class="py-0 px-2">
    <v-card v-if="!completed">
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
        <v-col cols="12" class="pb-0 text-center">
          <v-card flat>
            <h1 class="display-1">{{ evaluation.displayName || evaluation.name }}</h1>
            <!--
            <p class="mt-7 mb-2 text-center font-weight-bold">
              {{ $t('Views.Evaluations.evaluation.information_1') }}
            </p>
            <p class="text-center">
              <br/>
              {{ $t('Views.Evaluations.evaluation.information_2') }}
              <v-spacer/>
              <br/>
              {{ $t('Views.Evaluations.evaluation.information_3') }}
            </p>
            -->
          </v-card>
        </v-col>
      </v-row>

      <!-------------------------------------------->
      <!-------------- Poll Questions -------------->
      <!-------------------------------------------->
      <v-card-text>
        <ValidationObserver ref="poll_validation">
          <template v-for="(item, i) in pages[currentPage]">
            <!-- Additional Segmentation -->
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
                      class="mt-2 mx-4 justify-left"
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

            <!-- Questionnaire Questions -->
            <div v-else-if="[1,2,3,4].includes(computedQuestionnairePages)"
              :key="`${currentPage}-${i}`"
            >
              <v-divider v-if="i > 0" class="mt-4 grey lighten-3"></v-divider>
              <h5 class="mt-6 text-left headline">
                {{ item.qCount }}.-
                {{ item.question[lang] }}
              </h5>
              <v-row>
                <v-col cols="12" class="pt-0">
                  <ValidationProvider rules="required">
                    <v-radio-group dense hide-details
                      v-model="evaluated.temp.evaluations[computedQuestionnairePages - 1].variable[i].score"
                      class="mt-2 justify-left"
                      :class="computedQuestionnairePages > 1 ? 'mx-11' : 'mx-7'"
                      style="max-width: fit-content;"
                    >
                      <v-radio v-for="option in Object.keys(getAnswerRef(item.answers)).sort((a, b) => b - a)"
                        :key="`aref-${option}`"
                        :value="parseInt(option)"
                        :label="getAnswerRef(item.answers)[option][lang]"
                        color="primary"
                        @change="saveAnswers()"
                      ></v-radio>
                    </v-radio-group>
                  </ValidationProvider>
                </v-col>
              </v-row>
            </div>

            <!-- Index Questions -->
            <div v-else-if="computedQuestionnairePages === 5"
              :key="`${currentPage}-${i}`"
            >
              <v-divider v-if="i > 0" class="mt-4 grey lighten-3"></v-divider>
              <h5 class="mt-6 text-left headline">
                {{ questionsCount + i }}.-
                {{ item.question[lang] }}
              </h5>
              <v-row>
                <v-col cols="12" class="pt-0">
                  <ValidationProvider rules="required">
                    <v-radio-group dense hide-details
                      v-model="evaluated.temp.indices[i].answer"
                      class="mt-2 mx-11 justify-left"
                      style="max-width: fit-content;"
                    >
                      <v-radio v-for="option in Object.keys(getAnswerRef(item.answers)).sort((a, b) => b - a)"
                        :key="`aref-${option}`"
                        :value="parseInt(option)"
                        :label="getAnswerRef(item.answers)[option][lang]"
                        color="primary"
                        @change="saveAnswers()"
                      ></v-radio>
                    </v-radio-group>
                  </ValidationProvider>
                </v-col>
              </v-row>
            </div>

            <!-- Additional Questions -->
            <div v-else-if="hasAdditionalQuestions && computedQuestionnairePages === 6"
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
                      class="mt-2 mx-4 justify-left"
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

            <!-- Open Questions -->
            <div v-else-if="currentPage === pages.length - 1"
              :key="`${currentPage}-${i}`"
            >
              <h5
                class="text-left headline"
                :class="i > 0 ? 'mt-12' : 'mt-6'"
              >
                {{ item.question[lang] }}
              </h5>
              <v-row class="px-1">
                <v-col cols="12" md="4"
                  v-for="oq in [0,1,2]" :key="`w${oq}`"
                  class="text-left"
                >
                  <ValidationProvider rules="required" v-slot="{valid}">
                    <v-text-field
                      v-model="evaluated.temp.open[i].answer[oq]"
                      counter
                      :maxlength="18"
                      :placeholder="`${$t('Views.Evaluations.evaluation.answer')} ${oq + 1}`"
                      @keyup="!valid ? setProgress() : ''"
                      @keyup.enter="valid ? saveAnswers() : ''"
                      @blur="valid ? saveAnswers() : setProgress()"
                    ></v-text-field>
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
    <v-row wrap row justify="center">
      <v-col cols="12" class="mb-12 mb-sm-0 pt-9 pb-12 pb-sm-6 text-center">
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
      :evaluated-employee="evaluated && evaluated.employee ? evaluated.employee : {}"
      :show-dialog="endDialog"
      :sent-email="alreadySentEmail"
    ></x-end-dialog>

    <x-loading></x-loading>
    <x-alert></x-alert>
  </v-container>
</template>

<style scoped>
  .v-slider__tick--filled {
    background-color: none;
  }
</style>

<script src="./evaluation.js"></script>
