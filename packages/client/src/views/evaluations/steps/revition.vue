<template>
  <v-container flat>
    <x-technical-requirements></x-technical-requirements>
    <hr>
    <v-card flat>
      <v-row>
        <v-col cols="12">
          <v-row class="mt-4">
            <v-col xs="12" md="6" class="mb-3 my-2">
              <x-list-item-revition
                icon="feed"
                :title="$t('Views.Evaluations.stepRevition.poll_name')"
                :sub-title="evaluation.name"
              ></x-list-item-revition>
            </v-col>
            <v-col xs="12" md="6" class="mb-3 my-2">
              <x-list-item-revition
                icon="sticky_note_2"
                :title="$t('Views.Evaluations.stepRevition.external_name')"
                :sub-title="evaluation.displayName || evaluation.name"
              ></x-list-item-revition>
            </v-col>
          </v-row>
          <v-divider class="my-3"></v-divider>
          <v-row class="mt-4">
            <v-col xs="12" md="6" class="mb-3 my-2">
              <x-list-item-revition
                icon="mdi-calendar-star"
                :title="$t('Views.Evaluations.stepRevition.date_delivery')"
                :sub-title="formatDate(evaluation.deliveredAt)"
              ></x-list-item-revition>
            </v-col>
            <v-col xs="12" md="6" class="mb-3 my-2">
              <x-list-item-revition
                icon="mdi-calendar-minus"
                :title="$t('Views.Evaluations.stepRevition.poll_valid_until')"
                :sub-title="formatDate(evaluation.validUntil)"
              ></x-list-item-revition>
            </v-col>
            <v-col xs="12" md="6" class="mb-3 my-2">
              <x-list-item-revition
                icon="mdi-camera-timer"
                :title="$t('Views.Evaluations.stepRevition.time_zone')"
                :sub-title="evaluation.timeZone"
              ></x-list-item-revition>
            </v-col>
            <v-col xs="12" md="6" class="mb-3 my-2">
              <x-list-item-revition
                icon="mdi-calendar-clock"
                :title="$t('Views.Evaluations.stepRevition.send_reminders')"
                :sub-title="evaluation.reminders.length ? 'Si' : 'No'"
              ></x-list-item-revition>
            </v-col>
          </v-row>
          <v-divider class="my-3"></v-divider>
          <v-row class="mt-4">
            <v-col xs="12" md="6" class="mb-3 my-2">
              <x-list-item-revition
                icon="mdi-file-question"
                :title="$t('Views.Evaluations.stepRevition.questionnaire')"
                :sub-title="evaluation.questionnaireName"
              ></x-list-item-revition>
            </v-col>
            <v-col xs="12" md="6" class="mb-3 my-2">
              <x-list-item-revition
                icon="fa-coins"
                :title="`${computedPrice} ${$t('Views.Evaluations.stepRevition.token_unit')}`"
                :sub-title="computedPrice <= 0 ?
                  $t('Views.Evaluations.stepRevition.paid_measuring') :
                  $t('Views.Evaluations.stepRevition.workshop_cost', { members: (evaluation.populationCount - countOldEvaluated)})"
              ></x-list-item-revition>
            </v-col>
          </v-row>

          <!-- Additional Questions -->
          <v-divider class="my-3" v-if="computedShowAdditionalQuestions"></v-divider>
          <v-row class="mt-4" v-if="computedShowAdditionalQuestions">
            <v-col cols="12">
              <h6 class="title">{{ $t('Views.Evaluations.stepQuestion.open_question') }}</h6>
              <v-list>
                <v-list-group
                  v-for="(item, $idx) in evaluation.additionalQuestions"
                  :key="$idx"
                  v-model="item.active"
                  prepend-icon="mdi-comment-question"
                  no-action
                >
                  <template v-slot:activator>
                    <v-list-item>
                      <v-list-item-content>
                        <v-list-item-title>{{ item.question }}</v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                  </template>

                  <v-list-item
                    v-for="(subItem, $i) in item.options"
                    :key="$i"
                  >
                    <v-list-item-content class="pl-4">
                      <v-list-item-title>{{ subItem }}</v-list-item-title>
                    </v-list-item-content>

                    <v-list-item-action>
                      <v-icon>mdi-radiobox-blank</v-icon>
                    </v-list-item-action>
                  </v-list-item>
                </v-list-group>
              </v-list>
            </v-col>
          </v-row>

          <!-- Additional Segmentation -->
          <v-divider class="my-3" v-if="computedHasSegmentation"></v-divider>
          <v-row class="mt-4" v-if="computedHasSegmentation">
            <v-col cols="12">
              <h6 class="title">{{ $t('Views.Evaluations.stepAdditionalSegmentation.title') }}</h6>
              <v-list>
                <template v-for="(item, $idx) in evaluation.additionalSegmentation">
                  <v-list-group :key="$idx"
                    v-if="item.selected"
                    prepend-icon="mdi-comment-question"
                    no-action
                  >
                    <template v-slot:activator>
                      <v-list-item>
                        <v-list-item-content>
                          <v-list-item-title>{{ item.trans[user.lang].label }}</v-list-item-title>
                        </v-list-item-content>
                      </v-list-item>
                    </template>

                    <v-list-item
                      v-for="(subItem, $i) in item.details"
                      :key="$i"
                    >
                      <v-list-item-content class="pl-4">
                        <v-list-item-title>{{ subItem.trans[user.lang].label }}</v-list-item-title>
                      </v-list-item-content>

                      <v-list-item-action>
                        <v-icon>mdi-radiobox-blank</v-icon>
                      </v-list-item-action>
                    </v-list-item>
                  </v-list-group>
                </template>
              </v-list>
            </v-col>
          </v-row>

          <v-divider class="my-3"></v-divider>
          <v-row class="mt-4">
            <v-col cols="12" class="mb-3">
              <x-list-item-revition
                icon="mdi-email-open-outline"
                :title="$t('Views.Evaluations.stepRevition.personalization')"
              ></x-list-item-revition>
            </v-col>
            <v-col cols="12">
              <v-row  align="center" justify="center">
                <v-col lg="10" sm="9">
                  <v-tabs v-model="evaluation.active" class="fitTabs" show-arrows fixed-tabs>
                    <v-tab v-for="it in tabItems" :key="it.value" :href="`#`+it.value" @click="changeTab(it.value)">
                      {{ it.text }}
                    </v-tab>
                  </v-tabs>
                </v-col>
                <v-col cols="12" class="hidden-sm-and-up">
                  <v-select
                    v-model="evaluation.active"
                    :items="tabItems"
                    @change="changeTab"
                  ></v-select>
                </v-col>
                <v-col cols="12" v-if="tabSelected != 3" class="mt-1 text-center d-flex justify-center">
                  <v-btn class="primary" right @click="displayPreview">{{ $t('Views.Evaluations.stepRevition.input_preview') }}</v-btn>
                </v-col>
              </v-row>
              <v-container grid-list-md text-xs-center>
                <v-tabs-items v-model="evaluation.active">
                    <v-tab-item :value="`tab-1`">
                      <v-container grid-list-md text-xs-center>
                        <v-row>
                          <v-col>
                            <v-text-field
                              v-model="evaluation.pollInvitation.subject"
                              light
                              :label="$t('Views.Evaluations.stepRevition.message_subject')"
                              name="message_subject"
                              :append-outer-icon="$t('help.icon')"
                              :disabled="evaluation.status !== 'pending'"
                              @click:append-outer="$store.dispatch('help/display', $t('help.engagement.create.subject'))"
                            ></v-text-field>
                          </v-col>
                        </v-row>
                        <v-row>
                          <v-col>
                            <quill-editor ref="pollInvitationBody"
                              v-model="evaluation.pollInvitation.body"
                              :disabled="evaluation.status !== 'pending'"
                              :options="editorOption"
                              :class="evaluation.status !== 'pending' ? 'grey--text' : ''"
                              :style="evaluation.status !== 'pending' ? 'pointer-events: none' : ''"
                            ></quill-editor>
                            <!--
                            <v-text-field
                              :label="$t('Views.Evaluations.stepRevition.input_select_video')"
                              @click="pickFile"
                              v-model="pollInvitationVideo.name"
                              prepend-icon="attach_file"
                              :color="videoColor"
                              :append-outer-icon="$t('help.icon')"
                              @click:append-outer="$store.dispatch('help/display', $t('help.enterprise.create.video'))"
                            ></v-text-field>
                            <input
                              type="file"
                              style="display: none"
                              ref="videoInput"
                              accept="video/*"
                              @change="onFilePicked"
                            >
                            <v-row v-if="invitationHasFile">
                              <v-flex xs12>
                                <b>{{ $t('Views.Evaluations.stepRevition.fileExistNote') }}</b>
                              </v-flex>
                              <v-flex xs12 sm6 md4>
                                <v-card color="yellow lighten-4" class="mt-2">
                                  <v-card-title>
                                    <v-row justify="space-between">
                                      <span class="ml-2">{{ $t('Views.Evaluations.stepRevition.fileExist') }}</span>
                                      <v-tooltip right color="red">
                                        <template v-slot:activator="{ on }">
                                          <v-btn icon v-on="on" @click="deleteInvitationFile">
                                            <v-icon>mdi-delete</v-icon>
                                          </v-btn>
                                        </template>
                                        <span>{{ $t('Views.Evaluations.stepRevition.deleteFile') }}</span>
                                      </v-tooltip>
                                    </v-row>
                                  </v-card-title>
                                  <v-card-text>
                                    <span>
                                      <b>{{ evaluation.pollInvitation.attachment }}</b>
                                    </span>
                                  </v-card-text>
                                </v-card>
                              </v-flex>
                            </v-row>
                            -->
                          </v-col>
                        </v-row>
                      </v-container>
                    </v-tab-item>

                    <v-tab-item :value="`tab-2`">
                      <v-container grid-list-md text-xs-center>
                        <v-row>
                          <v-col xs="12" sm="12">
                            <v-text-field
                              v-model="evaluation.reminderMail.subject"
                              light
                              :label="$t('Views.Evaluations.stepRevition.message_subject')"
                              name="message_subject"
                              :append-outer-icon="$t('help.icon')"
                              @click:append-outer="$store.dispatch('help/display', $t('help.engagement.create.subject'))"
                            ></v-text-field>
                          </v-col>
                          <v-col xs="12" sm="12">
                            <quill-editor ref="pollReminderBody"
                                v-model="evaluation.reminderMail.body"
                                :options="editorOption">
                            </quill-editor>
                            <!--
                            <v-text-field
                              :label="$t('Views.Evaluations.stepRevition.input_select_video')"
                              @click="pickFile2"
                              v-model="pollReminderVideo.name"
                              prepend-icon="attach_file"
                              :color="videoColor2"
                              :append-outer-icon="$t('help.icon')"
                              @click:append-outer="$store.dispatch('help/display', $t('help.enterprise.create.video'))"
                            ></v-text-field>
                            <input
                              type="file"
                              style="display: none"
                              ref="videoInput2"
                              accept="video/*"
                              @change="onFilePicked2"
                            >
                            <v-row v-if="reminderHasFile">
                              <v-flex xs12>
                                <b>{{ $t('Views.Evaluations.stepRevition.fileExistNote') }}</b>
                              </v-flex>
                              <v-flex xs12 sm6 md4>
                                <v-card color="yellow lighten-4" class="mt-2">
                                  <v-card-title>
                                    <v-row justify="space-between">
                                      <span class="ml-2">{{ $t('Views.Evaluations.stepRevition.fileExist') }}</span>
                                      <v-tooltip right color="red">
                                        <template v-slot:activator="{ on }">
                                          <v-btn icon v-on="on" @click="deleteReminderFile">
                                            <v-icon>mdi-delete</v-icon>
                                          </v-btn>
                                        </template>
                                        <span>{{ $t('Views.Evaluations.stepRevition.deleteFile') }}</span>
                                      </v-tooltip>
                                    </v-row>
                                  </v-card-title>
                                  <v-card-text>
                                    <span>
                                      <b>{{ evaluation.reminderMail.attachment }}</b>
                                    </span>
                                  </v-card-text>
                                </v-card>
                              </v-flex>
                            </v-row>
                            -->
                          </v-col>
                        </v-row>
                      </v-container>
                    </v-tab-item>

                    <!--
                    <v-tab-item :value="`tab-3`">
                      <v-container grid-list-md text-xs-center>
                        <v-row>
                          <v-col xs="12" sm="12">
                            <v-textarea
                              v-model="evaluation.thankMessage"
                              light
                              :label="$t('Views.Evaluations.stepRevition.tk_message')"
                              name="thankMessage"
                              :append-icon="$t('help.icon')"
                              @click:append="$store.dispatch('help/display', $t('help.engagement.create.thankMessage'))"
                            ></v-textarea>
                          </v-col>
                        </v-row>
                      </v-container>
                    </v-tab-item>
                    -->
                  </v-tabs-items>
              </v-container>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" sm="6">
              <v-btn
                block
                large
                @click="changeStep(true)"
              >{{ $t(prevAction) }}</v-btn>
            </v-col>
            <v-col cols="12" sm="6">
              <v-btn
                color="primary"
                block
                large
                @click="changeStep(false)"
              >{{ $t(nextAction) }}</v-btn>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-card>
    <x-poll-preview-email
      :show-preview="showModalPreview"
      :evaluated="evaluation.evaluated"
      :subject="message.title"
      :body="message.body"
      :attachments="message.attachments"
      @close="$event => showModalPreview = $event"
    ></x-poll-preview-email>
  </v-container>
</template>

<script>
import { mapState } from 'vuex'
import { quillEditor } from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import XPollPreviewEmail from '../components/preview-email.vue'
import XListItemRevition from '../components/list-item-revition.vue'

export default {
  components: {
    quillEditor,
    XListItemRevition,
    XPollPreviewEmail
  },
  props: {
    evaluation: Object,
    identifyTypes: Object,
    step: String,
    nextAction: String,
    prevAction: String,
    balance: Number,
    price: Number,
    countOldEvaluated: Number
  },
  data () {
    return {
      tabSelected: 1,
      showModalPreview: false,
      message: {
        title: '',
        body: '',
        attachments: ''
      },
      editorOption: {
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            ['blockquote'],
            [{ header: 1 }, { header: 2 }],
            [{ list: 'ordered' }, { list: 'bullet' }],
            [{ size: ['small', false, 'large', 'huge'] }],
            [{ header: [1, 2, 3, 4, 5, 6, false] }],
            [{ color: [] }, { background: [] }],
            [{ align: [] }],
            ['clean'],
            ['link', 'image', 'video']
          ]
        },
        placeholder: ''
      },
      pollInvitationVideo: {
        src: '',
        name: ''
      },
      videoColor: 'primary',
      pollReminderVideo: {
        src: '',
        name: ''
      },
      tabItems: [
        { text: 'Views.Evaluations.stepRevition.poll_invitation', value: 'tab-1' },
        { text: 'Views.Evaluations.stepRevition.reminder_mail', value: 'tab-2' }
        // { text: 'Views.Evaluations.stepRevition.tk_message', value: 'tab-3' }
      ],
      videoColor2: 'primary',
      invitationHasFile: Boolean(this.evaluation.pollInvitation && this.evaluation.pollInvitation.attachment),
      reminderHasFile: Boolean(this.evaluation.reminderMail && this.evaluation.reminderMail.attachment)
    }
  },
  computed: {
    computedShowAdditionalQuestions () {
      return this.evaluation.switchAdditionalQuestion &&
        this.evaluation.additionalQuestions[0].question !== ''
    },
    computedHasSegmentation () {
      let cnt = 0
      if (this.evaluation.additionalSegmentation) {
        for (const key of Object.keys(this.evaluation.additionalSegmentation)) {
          if (this.evaluation.additionalSegmentation[key].selected) {
            cnt++
          }
        }
      }

      return cnt > 0
    },
    computedPrice () {
      const evaluatedDiff = this.evaluation.populationCount - this.countOldEvaluated
      return evaluatedDiff <= 0 ? 0 : (evaluatedDiff * this.price)
    },
    pollReminderEditor () {
      return this.$refs.pollReminderBody.quill
    },
    pollInvitationEditor () {
      return this.$refs.pollInvitationBody.quill
    },
    ...mapState({
      user: (state) => state.session.user
    })
  },
  methods: {
    changeStep (isBack = false) {
      if (!this.evaluation.pollInvitation.body) {
        this.evaluation.pollInvitation.body = this.$t('Views.Evaluations.stepRevition.custom_msg')
      }
      this.$emit('changeStep', this.evaluation, isBack ? +this.step - 1 : 7)
    },
    formatDate (data) {
      const [year, month, day] = data.value.split('-')
      return `${day}/${month}/${year} a las ${data.hour}:00`
    },
    displayPreview () {
      if (this.tabSelected === 1) {
        this.message.title = this.evaluation.pollInvitation.subject
        this.message.body = this.evaluation.pollInvitation.body
        this.message.attachments = this.evaluation.pollInvitation.file ? this.evaluation.pollInvitation.file.name : ''
      } else {
        this.message.title = this.evaluation.reminderMail.subject
        this.message.body = this.evaluation.reminderMail.body
        this.message.attachments = this.evaluation.reminderMail.file ? this.evaluation.reminderMail.file.name : ''
      }
      this.showModalPreview = true
    },
    pickFile () {
      this.$refs.videoInput.click()
    },
    onFilePicked ($event) {
      const files = $event.target.files

      if (files[0] !== undefined) {
        if (files[0].size > 50000000) {
          this.$store.dispatch('alert/error', this.$t('errors.video/size'))
          this.videoColor = 'error'
        } else {
          this.videoColor = 'primary'
          this.pollInvitationVideo.name = files[0].name
          return this.pollInvitationVideo.name.lastIndexOf('.') > 0 ? this.readFile(files) : this.resetVideo()
        }
      } else {
        this.resetVideo()
      }
    },
    resetVideo () {
      this.pollInvitationVideo.src = ''
      this.pollInvitationVideo.name = ''
      this.evaluation.pollInvitation.file = ''
    },
    readFile (files) {
      const fr = new FileReader()
      fr.readAsDataURL(files[0])
      fr.addEventListener('load', () => {
        this.pollInvitationVideo.src = fr.result
        this.evaluation.pollInvitation.file = files[0]
      })
    },
    pickFile2 () {
      this.$refs.videoInput2.click()
    },
    onFilePicked2 ($event) {
      const files = $event.target.files
      this.reminderHasFile = false
      if (files[0] !== undefined) {
        if (files[0].size > 50000000) {
          this.$store.dispatch('alert/error', this.$t('errors.video/size'))
          this.videoColor2 = 'error'
        } else {
          this.videoColor2 = 'primary'
          this.pollReminderVideo.name = files[0].name
          return this.pollReminderVideo.name.lastIndexOf('.') > 0 ? this.readFile2(files) : this.resetVideo2()
        }
      } else {
        this.resetVideo2()
      }
    },
    resetVideo2 () {
      this.pollReminderVideo.src = ''
      this.pollReminderVideo.name = ''
      this.evaluation.reminderMail.file = ''
    },
    readFile2 (files) {
      const fr = new FileReader()
      fr.readAsDataURL(files[0])
      fr.addEventListener('load', () => {
        this.pollReminderVideo.src = fr.result
        this.evaluation.reminderMail.file = files[0]
      })
    },
    deleteInvitationFile () {
      this.evaluation.pollInvitation.attachment = undefined
      this.$emit('delete-invitation-file')
      this.invitationHasFile = false
    },
    deleteReminderFile () {
      this.evaluation.reminderMail.attachment = undefined
      this.$emit('delete-reminder-file')
      this.reminderHasFile = false
    },
    changeTab (val) {
      this.tabSelected = parseInt(val.substr(val.length - 1, 1))
    }
  },
  created () {
    this.tabItems.forEach(item => { item.text = this.$t(item.text).toUpperCase() })
    this.editorOption.placeholder = this.$t('Views.Evaluations.stepRevition.body_message')
    // Release Mail
    if (!this.evaluation.pollInvitation.subject) {
      this.evaluation.pollInvitation.subject = this.$t('Views.Evaluations.stepRevition.subject_msg')
    }
    if (!this.evaluation.pollInvitation.body) {
      this.evaluation.pollInvitation.body = this.$t('Views.Evaluations.stepRevition.custom_msg')
    }
    // Reminder Mail
    if (!this.evaluation.reminderMail.subject) {
      this.evaluation.reminderMail.subject = this.$t('Views.Evaluations.stepRevition.subject_reminder')
    }
    if (!this.evaluation.reminderMail.body) {
      this.evaluation.reminderMail.body = this.$t('Views.Evaluations.stepRevition.custom_reminder')
    }
  }
}
</script>

<style lang="css">
.ql-container {
  min-height: 170px !important;
}
</style>
