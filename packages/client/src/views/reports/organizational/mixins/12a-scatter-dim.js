
import pdfUtils from '../../utils/pdf'
import scatterTableBase64 from '../../base64files/scatter-table'

export default {
  data () {
    return {
      scatterTblWidths: ['*', '13.5%', '13.7%']
    }
  },
  methods: {
    getScatterTablesHeaders (type) {
      const isByItems = this.rtype === 'byitems'
      return [
        {
          text: this.$t(`engagementReport.${type}`),
          margin: isByItems ? [3, 9.4, 0, -1.5] : [3, 8.4, 0, -3.8],
          fontSize: isByItems ? 9.5 : 11,
          bold: true,
          border: [false]
        },
        {
          text: isByItems ? this.$t('engagementReport.current_dispersion_items') : this.$t('engagementReport.current_dispersion'),
          margin: isByItems ? [0, 2, 0, -1.5] : [0, 1, 0, -3.8],
          fontSize: isByItems ? 9.5 : 11,
          alignment: 'center',
          bold: true,
          border: [false]
        },
        {
          text: isByItems ? this.$t('engagementReport.org_dispersion') : this.$t('engagementReport.preview_dispersion'),
          margin: isByItems ? [-1.5, 2, 0, -1.5] : [-1.5, 1, 0, -3.8],
          fontSize: isByItems ? 9.5 : 11,
          alignment: 'center',
          bold: true,
          border: [false]
        }
      ]
    },
    generateScatterTablesRows (context, desc, completeContext) {
      const ctx = this.rtype === 'byitems' ? `wholes${context.charAt(0).toUpperCase() + context.slice(1)}` : context
      let count = 6
      let contexts = Object.entries(this.current[`${context}sDispersions`])
        .sort((a, b) => {
          return desc ? b[1] - a[1] : a[1] - b[1]
        })

      let i = 0
      const footerArr = []
      for (const context of contexts) {
        if (i === count) {
          if (context[1] === contexts[i - 1][1]) {
            if (context[2] === contexts[i - 1][2]) {
              footerArr.push(context)
              count++
            } else if (parseFloat(context[2]) > parseFloat(contexts[i - 1][2])) {
              if (!footerArr.length) {
                contexts[i - 1] = context
              }
              break
            } else {
              break
            }
          } else {
            break
          }
        }
        i++
      }

      contexts = contexts.slice(0, 6)

      if (footerArr.length) {
        const concatText = { text: '', italics: true }
        for (let i = 0; i < footerArr.length; i++) {
          concatText.text += this[`${context}s`].find(d => d.id === Number(footerArr[i][0])).translate.label
          concatText.text += i === (footerArr.length - 1) ? '.' : ', '
        }
        switch (completeContext) {
          case 'positive_attribute':
            this.dispersionHighAttrFooterContent = {
              text: [this.$t('engagementReport.positive_attribute_footer') + '"' +
              this[`${context}s`].find(d => d.id === Number(contexts[5][0])).translate.label + '" : ', concatText],
              margin: [0, 0, 20, 15]
            }
            this.dispersionCounter++
            break
          case 'negative_attribute':
            this.dispersionLowAttrFooterContent = {
              text: [this.$t('engagementReport.negative_attribute_footer') + '"' +
              this[`${context}s`].find(d => d.id === Number(contexts[5][0])).translate.label + '": ', concatText],
              margin: [0, 0, 20, 0]
            }
            this.dispersionCounter++
            break
          case 'positive_variable':
            this.dispersionLowVarFooterContent = {
              text: [this.$t('engagementReport.positive_variable_footer') + '"' +
              this[`${context}s`].find(d => d.id === Number(contexts[5][0])).translate.label + '": ', concatText],
              margin: [0, 0, 20, 15]
            }
            this.dispersionCounter++
            break
          case 'negative_variable':
            this.dispersionLowVarFooterContent = {
              text: [this.$t('engagementReport.negative_variable_footer') + '"' +
              this[`${context}s`].find(d => d.id === Number(contexts[5][0])).translate.label + '": ', concatText],
              margin: [0, 0, 20, 0]
            }
            this.dispersionCounter++
            break

          default:
            break
        }
      }

      const rows = []
      let secondColumn = '--'
      for (const arr of contexts) {
        if (this.rtype === 'byitems') {
          secondColumn = this.$round(this.current[`${ctx}sDispersions`][arr[0]])
        } else if (this.hasPrevious) {
          secondColumn = this.$round(this.previous[`${context}sDispersions`][arr[0]])
        }
        rows.push([
          {
            text: this[`${context}s`].find(d => d.id === Number(arr[0])).translate.label,
            margin: [2, 5.8, 0, -2],
            fontSize: context === 'dimension' ? 11 : 10,
            border: [false]
          },
          {
            text: this.$round(this.current[`${context}sDispersions`][arr[0]]),
            margin: [0, 5.8, 0, -2],
            alignment: 'center',
            border: [false]
          },
          {
            text: secondColumn,
            margin: [0, 5.8, 0, -2],
            alignment: 'center',
            border: [false]
          }
        ])
      }

      return rows
    },
    $generateDimensionScatter () {
      return [
        {
          ...pdfUtils.generateTitle(this.$t('engagementReport.dispersion'), [0, 0, 0, 0], 'before', 37, '#222222'),
          pageOrientation: 'portrait'
        },
        {
          text: this.$t('engagementReport.dispersion_desc'),
          margin: [0, 10, 0, 10]
        },
        pdfUtils.generateTitle(this.$t('engagementReport.dispersion_by_dimensions'), [0, 10, 0, 0], '', 24, '#111111', true, true),
        // * ------------------------ *
        // * DIMENSIONS SCATTER TABLE *
        // * ------------------------ *
        {
          image: scatterTableBase64,
          absolutePosition: { x: 41, y: 166 }
        },
        {
          margin: [1.5, 4, 22, 0],
          table: {
            widths: this.scatterTblWidths,
            body: [
              this.getScatterTablesHeaders('dimension'),
              ...this.generateScatterTablesRows('dimension', true)
            ]
          },
          layout: {
            hLineWidth: () => {
              return 3
            }
          }
        }
      ]
    }
  }
}
