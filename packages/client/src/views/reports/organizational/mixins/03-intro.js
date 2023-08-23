
import pdfUtils from '../../utils/pdf'

export default {
  methods: {
    $generateIntroduction () {
      return [
        // Page Title
        pdfUtils.generateHeaderTitle(this.$t('Views.Evaluations.report.toc.introduction')),
        {
          text: this.$t('Views.Evaluations.report.introduction.first_paragraph'),
          margin: [25, 40, 15, 0],
          color: '#222222',
          alignment: 'justify'
        },
        {
          text: this.$t('Views.Evaluations.report.introduction.second_paragraph'),
          margin: [25, 20, 15, 0],
          color: '#222222',
          alignment: 'justify'
        }
      ]
    }
  }
}
