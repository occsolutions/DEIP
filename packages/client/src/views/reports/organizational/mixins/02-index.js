
import footerBase64 from '../../base64files/index-footer'

export default {
  methods: {
    $generateTableOfContents () {
      return [
        {
          table: {
            widths: [479],
            body: [
              [
                {
                  text: this.$t('Views.Evaluations.report.toc.index'),
                  font: 'League Spartan',
                  bold: true,
                  fontSize: 40,
                  color: '#222222',
                  margin: [50, 6, 0, 0]
                }
              ]
            ]
          },
          layout: {
            defaultBorder: ''
          },
          alignment: 'left',
          pageBreak: 'before',
          margin: [-40, 0, 0, 0]
        },
        // TABLE OF CONTENTS
        {
          toc: {
            id: 'mainToc',
            toc: {
              id: 'subToc'
            }
          },
          color: '#222222',
          fontSize: 12.5,
          margin: [15, -1, 10, 0],
          maxHeight: 0,
          lineHeight: 0.8
        },
        {
          image: footerBase64,
          absolutePosition: { x: -1, y: 658 }
        }
      ]
    }
  }
}
