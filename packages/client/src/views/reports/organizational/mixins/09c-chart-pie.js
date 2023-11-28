
import occColorsBase64 from '../../base64files/occ-colors-square'

export default {
  methods: {
    $generateChartPie () {
      return [
        // * ----------------- *
        // * RESULTS PIE CHART *
        // * ----------------- *
        {
          margin: [77, 6.4, 0, 0],
          image: this.chartPie,
          width: 380,
          height: 270
        },
        {
          table: {
            widths: ['3%', '25%', '0.5%', '2.5%', '25%', '0.5%', '2%', '30%'],
            body: [
              [
                {
                  text: '',
                  fillColor: this.hasPrevious ? '#000000' : '#FFFFFF'
                },
                {
                  margin: [0, 2, 0, -3],
                  text: this.hasPrevious ? this.$t('engagementReport.preview_population') : '',
                  fontSize: 10
                },
                {
                  text: '',
                  border: [false, false, false, false]
                },
                {
                  text: '',
                  fillColor: '#FFFFFF'
                },
                {
                  margin: [0, 2, 0, -1],
                  text: this.$t(`engagementReport.current_population${this.rtype === 'byitems' ? '_items' : ''}`),
                  fontSize: 10
                },
                {
                  text: '',
                  border: [false, false, false, false]
                },
                {
                  text: '',
                  fillColor: this.rtype === 'byitems' ? '#FFEB3B' : '#FFFFFF'
                },
                {
                  margin: [0, 2, 0, -1],
                  text: this.rtype === 'byitems' ? this.$t('engagementReport.actual_organization') : '',
                  fontSize: 10
                }
              ]
            ]
          },
          layout: 'noBorders'
        },
        {
          image: occColorsBase64,
          fit: [18, 18],
          absolutePosition: this.rtype === 'byitems' ? { x: 197, y: 751 } : { x: 197, y: 751 }
        }
      ]
    }
  }
}
