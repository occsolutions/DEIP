
import pdfUtil from '../../utils/pdf';

export default {
  methods: {
    $generateIntroduction() {
      return [
        {
          columns: pdfUtil.generateCenteredText(this.$t('demographicReport.index'), 20, true),
        },
        {
          margin: [0, 10],
          columns: [
            {
              width: '30%',
              text: this.$t('demographicReport.topic'),
              fontSize: 20,
              bold: true,
            },
            { width: '*', text: '' },
            {
              width: '20%',
              text: this.$t('demographicReport.page'),
              fontSize: 20,
              bold: true,
            },
          ],
        },
        {
          columns: [
            {
              width: 'auto',
              stack: this.$t('demographicReport.index_stack_general'),
            },
            { width: '*', text: '' },
            {
              width: '14%',
              text: '3\n4\n',
            },
          ],
        },
      ];
    },
  },
};
