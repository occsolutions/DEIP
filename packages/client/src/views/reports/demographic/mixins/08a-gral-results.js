
import pdfUtils from '../../utils/pdf'
import evolutionBarBase64 from '../../base64files/evolution-bar'

export default {
  methods: {
    $generateGeneralResults () {
      let sumCurrentFiltered = 0
      let sumCurrentGeneral = 0
      let sumPreviousFiltered = 0

      Object.keys(this.answersDimension).forEach(key => {
        if (key !== 'leader') {
          sumCurrentFiltered += this.answersDimension[key].filtered.score
          sumCurrentGeneral += this.answersDimension[key].general.score
          sumPreviousFiltered += this.answersDimension[key].filtered.previous
        }
      })

      const trend = this.$round(sumCurrentFiltered) - this.$round(sumPreviousFiltered)
      const gap = this.$round(sumCurrentFiltered) - this.$round(sumCurrentGeneral)

      const evolutionIndex = this.getEvolutionIndex(sumCurrentGeneral)

      return [
        pdfUtils.generateTitle('Resultados', [0, -4, 0, 0], 'before', 44, '#222222', false),
        {
          image: evolutionBarBase64,
          absolutePosition: { x: 40, y: 185 },
          width: evolutionIndex.width,
          height: 2.2
        },
        pdfUtils.generateTitle('Resultado Índice de Evolución DEIP', [0, 0], '', 1, '#FFFFFF', true, true),
        {
          text: 'Índice de Evolución DEIP',
          margin: [0, 19, 0, 0],
          color: '#111111',
          fontSize: 18,
          bold: true
        },
        {
          text: `Estado Actual de la empresa ${this.evaluationData.enterprise.name}`,
          margin: [0, 9, 0, 0],
          characterSpacing: 0,
          color: '#111111',
          fontSize: 12,
          bold: true
        },
        {
          text: evolutionIndex.text,
          margin: [0, 6, 0, 0],
          characterSpacing: 0,
          color: '#111111',
          fontSize: 12,
          bold: true
        },
        /* --------------------- */
        /* EVOLUTION INDEX TABLE */
        /* --------------------- */
        {
          margin: [1, 15, 0, 0],
          color: '#222222',
          fontSize: 9.5,
          table: {
            widths: ['*', '*', '*', '24%', '*'],
            body: [
              // Headers
              [
                {
                  text: this.$t('Views.Evaluations.report.organizational.curr_score'),
                  margin: [0, 2, 0, 0],
                  alignment: 'center',
                  fillColor: '#9cd3ef',
                  bold: true
                },
                {
                  text: this.$t('Views.Evaluations.report.organizational.prev_score'),
                  margin: [0, 2, 0, 0],
                  alignment: 'center',
                  fillColor: '#9cd3ef',
                  bold: true
                },
                {
                  text: this.$t('Views.Evaluations.report.organizational.trend'),
                  margin: [0, 2, 0, 0],
                  alignment: 'center',
                  fillColor: '#9cd3ef',
                  bold: true
                },
                {
                  text: 'Puntaje Organización',
                  margin: [0, 2, 0, 0],
                  alignment: 'center',
                  fillColor: '#9cd3ef',
                  bold: true
                },
                {
                  text: 'Brecha',
                  margin: [0, 2, 0, 0],
                  alignment: 'center',
                  fillColor: '#9cd3ef',
                  bold: true
                }
              ],
              // Body
              [
                {
                  text: this.$round(sumCurrentFiltered),
                  margin: [0, 7, 0, 1],
                  alignment: 'center',
                  bold: true,
                  fontSize: 16
                },
                {
                  text: this.hasPrevious ? this.$round(sumPreviousFiltered) : '--',
                  margin: [0, 7, 0, 1],
                  alignment: 'center',
                  bold: this.hasPrevious,
                  fontSize: 16
                },
                {
                  text: this.hasPrevious ? this.$round(trend) : '--',
                  margin: [0, 7, 0, 1],
                  alignment: 'center',
                  bold: this.hasPrevious,
                  fontSize: 16
                },
                {
                  text: this.$round(sumCurrentGeneral),
                  margin: [0, 7, 0, 1],
                  alignment: 'center',
                  bold: true,
                  fontSize: 16
                },
                {
                  text: gap ? this.$round(gap) : '--',
                  margin: [0, 7, 0, 1],
                  alignment: 'center',
                  bold: gap,
                  fontSize: 16
                }
              ]
            ]
          },
          layout: {
            hLineWidth: () => {
              return 1
            },
            vLineWidth: () => {
              return 1
            },
            hLineColor: () => {
              return '#BBBBBB'
            },
            vLineColor: () => {
              return '#BBBBBB'
            }
          }
        },
        /* --------------------- */
        /*  RESULTS DESC. TABLE  */
        /* --------------------- */
        {
          margin: [1, 24, 0, 0],
          color: '#222222',
          fontSize: 9,
          lineHeight: 1.1,
          table: {
            widths: ['*', '*', '*', '*'],
            body: [
              // Headers
              [
                {
                  text: this.levelNames[0],
                  margin: [0, 2, 0, 0],
                  alignment: 'center',
                  fillColor: this.levelNamesBg,
                  bold: true
                },
                {
                  text: this.levelNames[1],
                  margin: [0, 2, 0, 0],
                  alignment: 'center',
                  fillColor: this.levelNamesBg,
                  bold: true
                },
                {
                  text: this.levelNames[2],
                  margin: [0, 2, 0, 0],
                  alignment: 'center',
                  fillColor: this.levelNamesBg,
                  bold: true
                },
                {
                  text: this.levelNames[3],
                  margin: [0, 2, 0, 0],
                  alignment: 'center',
                  fillColor: this.levelNamesBg,
                  bold: true
                }
              ],
              // Body
              [
                {
                  ul: this.levelDescriptions[0],
                  margin: [2, 3, 2, 3],
                  fontSize: 9
                },
                {
                  ul: this.levelDescriptions[1],
                  margin: [2, 3, 2, 3],
                  fontSize: 9
                },
                {
                  ul: this.levelDescriptions[2],
                  margin: [2, 3, 2, 3],
                  fontSize: 9
                },
                {
                  ul: this.levelDescriptions[3],
                  margin: [2, 3, 2, 3],
                  fontSize: 9
                }
              ]
            ]
          },
          layout: {
            hLineWidth: () => {
              return 1
            },
            vLineWidth: () => {
              return 1
            },
            hLineColor: () => {
              return '#BBBBBB'
            },
            vLineColor: () => {
              return '#BBBBBB'
            }
          }
        }
      ]
    }
  }
}
