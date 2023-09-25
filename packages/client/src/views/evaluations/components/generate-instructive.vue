
<template>
  <div class="d-inline">
    <v-btn
      color="primary"
      class="text-capitalize"
      @click="downloadInstructive"
    >
      <v-icon class="mr-3">fa-file-pdf</v-icon> {{ $t('Views.Evaluations.stepEvaluatedSelection.generateInstructive.download_instructive') }}
    </v-btn>
  </div>
</template>

<script>
import Vue from 'vue'
import is from 'is_js'
import pdfmake from 'pdfmake/build/pdfmake'
import pdffonts from 'pdfmake/build/vfs_fonts.js'

pdfmake.vfs = pdffonts.pdfMake.vfs

export default Vue.extend({
  props: {
    leader: Boolean
  },
  methods: {
    downloadInstructive () {
      this.$store.dispatch('loading/show')
      const docDefinition = {
        content: [
          { text: this.$t(`instructive.title${this.leader ? '_leaders' : ''}`), fontSize: 20, alignment: 'center', margin: [70, 35, 70, 10] },
          { text: this.$t('instructive.title_body'), fontSize: 12, margin: [40, 10, 30, 10] },
          { text: this.$t('instructive.use_methods'), fontSize: 17, bold: true, alignment: 'left', margin: [40, 20, 30, 10] },
          { text: this.$t(`instructive.description${this.leader ? '_leaders' : ''}`), style: 'paragraph' },
          { text: this.$t('instructive.example'), style: 'h2' },
          {
            layout: 'lightHorizontalLines', // optional
            table: {
              widths: [300, 150],
              body: [
                ['email'],
                ...(([`participante${this.leader ? '_leader' : ''}@email.com`].map(email => {
                  const parts = email.split('@')
                  const emails = []
                  for (let i = 1; i <= 17; i++) emails.push([`${parts[0]}${i}@${parts[1]}`])
                  return emails
                }))[0])
              ]
            },
            margin: [40, 5, 30, 10],
            pageBreak: ''
          }
        ]
      }
      docDefinition.styles = {
        paragraph: {
          fontSize: 12,
          margin: [40, 0, 30, 10]
        },
        h1: {
          fontSize: 15,
          margin: [40, 10, 30, 10],
          bold: true
        },
        h2: {
          fontSize: 14,
          margin: [40, 10, 30, 0],
          bold: true,
          italics: true
        },
        h3: {
          fontSize: 13,
          margin: [40, 5, 30, 10]
        },
        stepper: {
          fontSize: 14,
          margin: [40, 20, 30, 10],
          bold: true
        }
      }
      docDefinition.pageMargins = [25, 35, 25, 35]
      docDefinition.pageSize = 'LETTER'
      if (is.edge() || is.ie()) {
        const pdfDocGenerator = pdfmake.createPdf(docDefinition)
        pdfDocGenerator.getBlob((blob) => {
          window.navigator.msSaveBlob(blob, 'Instructivo.pdf')
          this.$store.dispatch('loading/hide')
        })
      } else {
        new Promise((resolve) => {
          resolve(pdfmake.createPdf(docDefinition).download('Instructivo'))
        }).then(() => this.$store.dispatch('loading/hide'))
      }
    }
  }
})
</script>
