
<template>
  <div class="d-inline">
    <v-btn
      color="primary"
      class="text-capitalize"
      @click="downloadInstructive"
    >
      <v-icon class="mr-3">fa-file-pdf</v-icon> {{ $t('Views.Evaluations.stepEvaluatedSelection.generateInstructive.download_instructive') }}
    </v-btn>
    <img v-for="i in 8" :key="i"
      :src="'/img/step_' + i + '_excel.png'"
      style="visibility:hidden" :id="'excelImage'+i"
      width="0"
      height="0"
      alt="Excel step"
    />
  </div>
</template>

<script>
import Vue from 'vue'
import is from 'is_js'
import pdfmake from 'pdfmake/build/pdfmake'
import pdffonts from 'pdfmake/build/vfs_fonts.js'

pdfmake.vfs = pdffonts.pdfMake.vfs

export default Vue.extend({
  data () {
    return {
      // imageStep1: null,
      // imageStep2: null,
      // imageStep3: null,
      // imageStep4: null,
      // imageStep5: null,
      // imageStep6: null,
      // imageStep7: null,
      // imageStep8: null,
      // imagesBase64: []
    }
  },
  methods: {
    downloadInstructive () {
      this.$store.dispatch('loading/show')
      const docDefinition = {
        content: [
          { text: this.$t('instructive.title'), fontSize: 20, alignment: 'center', margin: [70, 35, 70, 10] },
          { text: this.$t('instructive.title_body'), fontSize: 12, margin: [40, 10, 30, 10] },
          { text: this.$t('instructive.use_methods'), fontSize: 17, bold: true, alignment: 'left', margin: [40, 20, 30, 10] },
          { text: this.$t('instructive.description'), style: 'paragraph' },
          { text: this.$t('instructive.example'), style: 'h2' },
          {
            layout: 'lightHorizontalLines', // optional
            table: {
              widths: [300, 150],
              body: [
                ['email'],
                ['participante1@email.com'],
                ['participante2@email.com'],
                ['participante3@email.com'],
                ['participante4@email.com'],
                ['participante5@email.com'],
                ['participante6@email.com'],
                ['participante7@email.com'],
                ['participante8@email.com'],
                ['participante9@email.com'],
                ['participante10@email.com'],
                ['participante11@email.com'],
                ['participante12@email.com'],
                ['participante13@email.com'],
                ['participante14@email.com']
              ]
            },
            margin: [40, 5, 30, 10],
            pageBreak: ''
          }
        ]
      }

      /*
      docDefinition.content.push({
        text: this.$t('instructive.importDataToExcelTitle'),
        style: 'h2'
      })
      for (let i = 1; i < 9; i++) {
        docDefinition.content.push(
          { text: i !== 8 ? this.$t('instructive.step' + i) : '', style: 'stepper' },
          { text: this.$t('instructive.step' + i + '_desc'), style: 'paragraph', alignment: 'justify' },
          { image: this.imagesBase64[i], width: 450, height: 250, margin: [40, 10, 30, 10] }
        )
      }
      */
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
    /* end to download help */
    // toDataURL (url, callback) {
    //   const xhr = new XMLHttpRequest()
    //   xhr.open('get', url)
    //   xhr.responseType = 'blob'

    //   xhr.onload = function () {
    //     const fr = new FileReader()

    //     fr.onload = function () {
    //       callback(this.result)
    //     }

    //     fr.readAsDataURL(xhr.response)
    //   }
    //   xhr.send()
    // },
    // setDataToUrl (value, idx) {
    //   if (value) {
    //     this.toDataURL(value, (dataURL) => {
    //       this.imagesBase64[idx] = dataURL
    //     })
    //   }
    // }
  },
  mounted () {
    // this.imageStep1 = document.getElementById('excelImage1').src
    // this.imageStep2 = document.getElementById('excelImage2').src
    // this.imageStep3 = document.getElementById('excelImage3').src
    // this.imageStep4 = document.getElementById('excelImage4').src
    // this.imageStep5 = document.getElementById('excelImage5').src
    // this.imageStep6 = document.getElementById('excelImage6').src
    // this.imageStep7 = document.getElementById('excelImage7').src
    // this.imageStep8 = document.getElementById('excelImage8').src
  },
  watch: {
    // imageStep1 (newVal) {
    //   this.setDataToUrl(newVal, 1)
    // },
    // imageStep2 (newVal) {
    //   this.setDataToUrl(newVal, 2)
    // },
    // imageStep3 (newVal) {
    //   this.setDataToUrl(newVal, 3)
    // },
    // imageStep4 (newVal) {
    //   this.setDataToUrl(newVal, 4)
    // },
    // imageStep5 (newVal) {
    //   this.setDataToUrl(newVal, 5)
    // },
    // imageStep6 (newVal) {
    //   this.setDataToUrl(newVal, 6)
    // },
    // imageStep7 (newVal) {
    //   this.setDataToUrl(newVal, 7)
    // },
    // imageStep8 (newVal) {
    //   this.setDataToUrl(newVal, 8)
    // }
  }
})
</script>
