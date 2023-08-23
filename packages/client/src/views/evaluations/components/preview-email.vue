
<template>
  <v-dialog
    v-model="showModalPreview"
    max-width="58.8rem"
  >
    <v-card tile>
      <v-card-text>
        <v-row align-center justify-center>
          <div style="background: #f3f3f3; margin-top: 0.9em;">
            <p style="margin-bottom: 0">
              {{ $t('Views.Evaluations.stepRevition.previewEmail.subject') }}: <strong>{{ subject }}</strong>
            </p>
          </div>
        </v-row>
        <v-row align-center justify-center row>
          <table
            bgcolor="#f4f4f4" cellpadding="0" cellspacing="0" class="nl-container" role="presentation"
            style="table-layout: fixed; vertical-align: top; min-width: 320px; Margin: 0 auto; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f4f4f4; width: 100%;"
            valign="top" width="100%">
            <tbody>
              <tr style="vertical-align: top;" valign="top">
                <td style="word-break: break-word; vertical-align: top;" valign="top">
                  <div style="background-color:#FFFFFF;">
                    <div class="block-grid"
                      style="Margin: 0 auto; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; background-color: transparent;">
                      <div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;">
                        <div class="col num12"
                          style="display: table-cell; vertical-align: top; width: 720px;">
                          <div style="width:100% !important;">
                            <div
                              style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:0px; padding-bottom:0px; padding-right: 0px; padding-left: 0px;">
                              <table
                                border="0" cellpadding="0" cellspacing="0" class="divider" role="presentation"
                                style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;"
                                valign="top" width="100%">
                                <tbody>
                                  <tr style="vertical-align: top;" valign="top">
                                    <td class="divider_inner"
                                      style="word-break: break-word; vertical-align: top; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; padding-top: 0px; padding-right: 0px; padding-bottom: 0px; padding-left: 0px;"
                                      valign="top">
                                      <table
                                        align="center" border="0" cellpadding="0" cellspacing="0" class="divider_content"
                                        height="30" role="presentation"
                                        style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-top: 0px solid transparent; height: 30px; width: 100%;"
                                        valign="top" width="100%">
                                        <tbody>
                                          <tr style="vertical-align: top;" valign="top">
                                            <td height="30"
                                              style="word-break: break-word; vertical-align: top; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;"
                                              valign="top"><span></span></td>
                                          </tr>
                                        </tbody>
                                      </table>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div style="background-color:transparent;">
                    <div class="block-grid two-up no-stack"
                      style="Margin: 0 auto; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; background-color: transparent;">
                      <div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;">
                        <div class="col num6"
                          style="min-width: 320px; max-width: 360px; display: table-cell; vertical-align: top; width: 360px;">
                          <div style="width:100% !important;">
                            <div
                              style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:10px; padding-bottom:10px; padding-right: 20px; padding-left: 20px;">
                              <a href="https://occ-solutions.com" target="_blank">
                                <div align="center" class="img-container center fixedwidth"
                                  style="padding-right: 0px;padding-left: 0px;">
                                  <img
                                    align="center" alt="Image" border="0" class="center fixedwidth"
                                    :src="`${publicUrl}/img/20200301_occ_solution_logo.png`"
                                    style="text-decoration: none; -ms-interpolation-mode: bicubic; border: 0; height: auto; width: 100%; max-width: 256px; display: block;"
                                    title="Image" width="256" />
                                </div>
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div :style="style1" style="background-position:bottom center;background-repeat: no-repeat;background-color:#FFFFFF; background-size: cover;">
                    <div class="block-grid"
                      style="Margin: 0 auto; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; background-color: transparent;">
                      <div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;">
                        <div class="col num12"
                          style="display: table-cell; vertical-align: top; width: 720px;">
                          <div style="width:100% !important;">
                            <div
                              style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:5px; padding-bottom:0px; padding-right: 0px; padding-left: 0px;">
                              <table border="0" cellpadding="0" cellspacing="0" class="divider" role="presentation"
                                style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;"
                                valign="top" width="100%">
                                <tbody>
                                  <tr style="vertical-align: top;" valign="top">
                                    <td class="divider_inner"
                                      style="word-break: break-word; vertical-align: top; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; padding-top: 10px; padding-right: 10px; padding-bottom: 10px; padding-left: 10px;"
                                      valign="top">
                                      <table align="center" border="0" cellpadding="0" cellspacing="0" class="divider_content"
                                        height="70" role="presentation"
                                        style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-top: 0px solid transparent; height: 70px; width: 100%;"
                                        valign="top" width="100%">
                                        <tbody>
                                          <tr style="vertical-align: top;" valign="top">
                                            <td height="70"
                                              style="word-break: break-word; vertical-align: top; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;"
                                              valign="top"><span></span></td>
                                          </tr>
                                        </tbody>
                                      </table>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <section>
                    <div>
                      <h3 style="color: #000">{{ $t('Views.Evaluations.stepRevition.previewEmail.hello') }}, </h3><br/>
                      <p style="margin-bottom: 0;">
                        <section v-html="body" style="color: #000"></section>
                        <br/>
                        <span style="color: #000">
                          {{ $t('Views.Evaluations.stepRevition.previewEmail.link_to_poll') }}
                          <a style="text-decoration: underline;">{{ $t('Views.Evaluations.stepRevition.previewEmail.click_here') }}</a>
                        </span>
                        <!--
                        <br><br><br>
                        <span style="color: #000">
                          {{ $t('Views.Evaluations.stepRevition.previewEmail.por_team_members_info') }}
                        </span>
                        -->
                      </p>
                      <!--
                      <table style="width: 95%; margin: 0 auto;" border="1">
                        <thead>
                          <tr>
                            <th>{{ $t('Views.Evaluations.stepRevition.previewEmail.por_team_members') }}</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="(evaluated, idx) in evaluatedTwo" :key="`preview-email-tr${idx}`">
                            <td style="padding: 2px;">{{ evaluated }}</td>
                          </tr>
                        </tbody>
                      </table>
                      -->
                    </div>
                  </section>
                  <div style="background-color: #bcdaf5;" v-if="attachments">
                    <table align="center" border="0" cellpadding="0" cellspacing="0" class="divider_content"
                      height="40" role="presentation"
                      style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-top: 0px solid transparent; height: 70px; width: 100%;"
                      valign="top" width="100%">
                      <tbody>
                        <tr style="vertical-align: top;" valign="top">
                          <td height="40"
                            style="word-break: break-word; vertical-align: middle; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;"
                            valign="top">
                            {{ $t('Views.Evaluations.stepRevition.previewEmail.attached_video') }}:
                          </td>
                          <td height="40"
                            style="word-break: break-word; vertical-align: middle; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;"
                            valign="top">
                            <a href="./">{{ attachments }}</a>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div :style="style2" style="background-position:top center;background-repeat: no-repeat;background-color:#FFFFFF; background-size: cover;">
                    <div class="block-grid"
                      style="Margin: 0 auto; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; background-color: transparent;">
                      <div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;">
                        <div class="col num12"
                          style="display: table-cell; vertical-align: top; width: 720px;">
                          <div style="width:100% !important;">
                            <div
                              style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:5px; padding-bottom:0px; padding-right: 0px; padding-left: 0px;">
                              <table border="0" cellpadding="0" cellspacing="0" class="divider" role="presentation"
                                style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;"
                                valign="top" width="100%">
                                <tbody>
                                  <tr style="vertical-align: top;" valign="top">
                                    <td class="divider_inner"
                                      style="word-break: break-word; vertical-align: top; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; padding-top: 10px; padding-right: 10px; padding-bottom: 10px; padding-left: 10px;"
                                      valign="top">
                                      <table align="center" border="0" cellpadding="0" cellspacing="0" class="divider_content"
                                        height="70" role="presentation"
                                        style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-top: 0px solid transparent; height: 70px; width: 100%;"
                                        valign="top" width="100%">
                                        <tbody>
                                          <tr style="vertical-align: top;" valign="top">
                                            <td height="70"
                                              style="word-break: break-word; vertical-align: top; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;"
                                              valign="top"><span></span></td>
                                          </tr>
                                        </tbody>
                                      </table>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div style="background-color:#FFFFFF;">
                    <div class="block-grid"
                      style="Margin: 0 auto; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; background-color: #FFFFFF;">
                      <div style="border-collapse: collapse;display: table;width: 100%;background-color:#FFFFFF;">
                        <div class="col num12"
                          style="display: table-cell; vertical-align: top; width: 720px;">
                          <div style="width:100% !important;">
                            <div
                              style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:15px; padding-bottom:35px; padding-right: 0px; padding-left: 0px;">
                              <div
                                style="color:#838383;font-family:Open Sans, Helvetica Neue, Helvetica, Arial, sans-serif;line-height:1.5;padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;">
                                <div
                                  style="font-size: 12px; line-height: 1.5; color: #838383; font-family: Open Sans, Helvetica Neue, Helvetica, Arial, sans-serif; mso-line-height-alt: 18px;">
                                  <p
                                    style="font-size: 14px; line-height: 1.5; text-align: center; word-break: break-word; mso-line-height-alt: 21px; margin: 0;">
                                    <span style="color: #000000; font-size: 14px;">{{ $t('Views.Evaluations.stepRevition.previewEmail.rights_reserved') }} ©
                                      <strong>OCC Solutions</strong></span>, <br> info@occsolutions.org | +57 (1) 642 1300.</p>
                                  <p
                                    style="font-size: 14px; line-height: 1.5; text-align: center; word-break: break-word; mso-line-height-alt: 21px; margin: 0;">
                                    <span> {{ $t('Views.Evaluations.stepRevition.previewEmail.sent_automatic') }} <a :href="publicUrl" target="_blank">{{ publicUrl }}</a></span><br />
                                    <span> {{ $t('Views.Evaluations.stepRevition.previewEmail.support') }} <a href="mailto:info@occsolutions.org" target="_blank">info@occsolutions.org</a></span>
                                  </p>
                                </div>
                              </div>
                              <table cellpadding="0" cellspacing="0" class="social_icons" role="presentation"
                                style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt;"
                                valign="top" width="100%">
                                <tbody>
                                  <tr style="vertical-align: top;" valign="top">
                                    <td
                                      style="word-break: break-word; vertical-align: top; padding-top: 10px; padding-right: 10px; padding-bottom: 10px; padding-left: 10px;"
                                      valign="top">
                                      <table align="center" cellpadding="0" cellspacing="0" class="social_table"
                                        role="presentation"
                                        style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-tspace: 0; mso-table-rspace: 0; mso-table-bspace: 0; mso-table-lspace: 0;"
                                        valign="top">
                                        <tbody>
                                        </tbody>
                                      </table>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import Vue from 'vue'

export default Vue.extend({
  props: {
    showPreview: Boolean,
    subject: String,
    body: String,
    attachments: String,
    evaluated: Array
  },
  data () {
    return {
      publicUrl: '',
      showModalPreview: false
    }
  },
  computed: {
    style1 () {
      return `background-image:url('${this.publicUrl}/img/bg_wave_1.png');`
    },
    style2 () {
      return `background-image:url('${this.publicUrl}/img/bg_wave_2.png');`
    },
    evaluatedTwo () {
      return this.evaluated.map((item) => this.getNameEvaluated(item))
    }
  },
  watch: {
    showModalPreview () {
      if (this.showModalPreview) this.$emit('close', false)
    },
    showPreview () {
      if (this.showPreview) this.showModalPreview = this.showPreview
    }
  },
  methods: {
    getNameEvaluated (evaluated) {
      return evaluated.firstName + ' ' + evaluated.lastName
    }
  }
})
</script>

<style type="text/css">
  body {
    margin: 0;
    padding: 0;
  }

  table, td, tr {
    vertical-align: top;
    border-collapse: collapse;
  }

  * {
    line-height: inherit;
  }

  a[x-apple-data-detectors=true] {
    color: inherit !important;
    text-decoration: none !important;
  }
</style>

<style id="media-query" type="text/css">
  @media (max-width: 740px) {

    .block-grid,
    .col {
      min-width: 320px !important;
      max-width: 100% !important;
      display: block !important;
    }

    .block-grid {
      width: 100% !important;
    }

    .col {
      width: 100% !important;
    }

    .col>div {
      margin: 0 auto;
    }

    img.fullwidth,
    img.fullwidthOnMobile {
      max-width: 100% !important;
    }

    .no-stack .col {
      min-width: 0 !important;
      display: table-cell !important;
    }

    .no-stack.two-up .col {
      width: 50% !important;
    }

    .no-stack .col.num4 {
      width: 33% !important;
    }

    .no-stack .col.num8 {
      width: 66% !important;
    }

    .no-stack .col.num4 {
      width: 33% !important;
    }

    .no-stack .col.num3 {
      width: 25% !important;
    }

    .no-stack .col.num6 {
      width: 50% !important;
    }

    .no-stack .col.num9 {
      width: 75% !important;
    }

    .video-block {
      max-width: none !important;
    }

    .mobile_hide {
      min-height: 0px;
      max-height: 0px;
      max-width: 0px;
      display: none;
      overflow: hidden;
      font-size: 0px;
    }

    .desktop_hide {
      display: block !important;
      max-height: none !important;
    }
  }
</style>
