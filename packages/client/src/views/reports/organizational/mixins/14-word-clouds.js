
import pdfUtils from '../../utils/pdf'

export default {
  methods: {
    $generateWordClouds () {
      const pages = []

      this.evaluationData.openQuestions.forEach((openQ, cnt) => {
        pages.push(
          // Page Title
          pdfUtils.generateHeaderTitle(this.$t('Views.Evaluations.report.toc.word_clouds'), !cnt),
          {
            text: openQ.question[this.user.lang],
            alignment: 'center',
            margin: [0, 20, 0, 0],
            fontSize: 14
          },
          {
            absolutePosition: { x: 20, y: 120 },
            image: this.wClouds[openQ.name],
            width: 800,
            height: 440
          }
        )
      })

      return pages
    }
  }
}
