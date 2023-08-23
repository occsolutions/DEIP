
import pdfUtils from '../../utils/pdf'

export default {
  methods: {
    $generateTableOfContents () {
      return [
        // Page Title
        pdfUtils.generateHeaderTitle(this.$t('Views.Evaluations.report.toc.index'), false),
        // Table of Contents
        {
          toc: {
            id: 'mainToc',
            toc: {
              id: 'subToc'
            }
          },
          color: '#222222',
          fontSize: 13,
          bold: true,
          margin: [50, 17, 40, 0],
          maxHeight: 0,
          lineHeight: 1,
          characterSpacing: 0.4
        }
      ]
    }
  }
}
