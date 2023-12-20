
import pdfUtils from '../../utils/pdf'
import evolutionBarBase64 from '../../base64files/evolution-bar'

export default {
  methods: {
    getEvolutionIndex (score) {
      let text, width
      switch (true) {
        case (score >= 1 && score < 2):
          text = 'Básico'
          width = 42
          break
        case (score >= 2 && score < 3):
          text = 'Emergente'
          width = 71
          break
        case (score >= 3 && score < 4):
          text = 'En Evolución'
          width = 82
          break
        case (score >= 4 && score <= 5):
          text = 'Referente'
          width = 62.5
          break
      }

      return { text, width }
    },
    getFillColor (score) {
      score = Number(parseFloat(score).toFixed(2))
      let color
      switch (true) {
        case (score >= 0 && score < 0.4):
          color = '#CF6463'
          break
        case (score >= 0.4 && score < 0.7):
          color = '#FFd87C'
          break
        case (score >= 0.7 && score <= 1):
          color = '#93D379'
          break
        default:
          color = '#FF6600'
          break
      }

      return color
    },
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

      const trend = sumCurrentFiltered - sumPreviousFiltered
      const gap = sumCurrentFiltered - sumCurrentGeneral

      const evolutionIndex = this.getEvolutionIndex(sumCurrentGeneral)

      return [
        pdfUtils.generateTitle('Resultados', [0, -4, 0, 0], 'before', 44, '#222222', false),
        {
          image: evolutionBarBase64,
          absolutePosition: { x: 40, y: 185 },
          width: evolutionIndex.width,
          height: 2.2
        },
        pdfUtils.generateTitle('Resultado Índice de evolución DEIP', [0, 0], '', 1, '#FFFFFF', true, true),
        {
          text: 'Indice Evolución DEIP',
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
          fontSize: 9.5,
          table: {
            widths: ['*', '*', '*', '*'],
            body: [
              // Headers
              [
                {
                  text: 'Descripción Nivel\nBásico',
                  margin: [0, 2, 0, 0],
                  alignment: 'center',
                  fillColor: '#f5afa6',
                  bold: true
                },
                {
                  text: 'Descripción Nivel Emergente',
                  margin: [0, 2, 0, 0],
                  alignment: 'center',
                  fillColor: '#f5afa6',
                  bold: true
                },
                {
                  text: 'Descripción Nivel En Evolución',
                  margin: [0, 2, 0, 0],
                  alignment: 'center',
                  fillColor: '#f5afa6',
                  bold: true
                },
                {
                  text: 'Descripción Nivel Referente',
                  margin: [0, 2, 0, 0],
                  alignment: 'center',
                  fillColor: '#f5afa6',
                  bold: true
                }
              ],
              // Body
              [
                {
                  text: 'La organización se encuentra en un bajo nivel de conciencia con referencia a DEI. Hay poco conocimiento sobre el tema. Las acciones sobre DEI son incipientes y esporádicas. No existe involucramiento directo de los(as) líderes y se evidencia mínima representación visible de la diversidad.',
                  margin: [2, 3, 2, 3],
                  fontSize: 9
                },
                {
                  text: 'La organización se encuentra iniciando el despertar de consciencia con referencia a DEI. Los procesos de sensibilización y educación apenas comienzan. El conocimiento sobre DEI es básico y como cumplimiento de la normatividad. Comunicaciones y acciones aisladas y tácticas. Involucramiento limitado de los(as) líderes. Comités desarticulados. Comités voluntarios. Presupuesto incipiente. Enfoque en una arista de la diversidad. Baja representación visible de la diversidad. Monitoreo y métricas incipientes.',
                  margin: [2, 3, 2, 3],
                  fontSize: 9
                },
                {
                  text: 'La organización se encuentra evolucionando en su nivel de consciencia con referencia a DEI. Implementación de mejores prácticas. Mayor nivel de conocimiento. Conocimiento intermedio y avanzado sobre DEI. DEI como programa o proyecto. Ventaja competitiva. Comunicación a nivel estratégico. Acciones innovadoras. Líderes corresponsables (Sponsors - Champions). Equipamiento de líderes. Comités con Plan de Lanzamiento y Caja de Herramientas. Intervenciones estratégicas. Planeación y presupuesto inicial. Alta representación de visible la diversidad. Monitoreo cualitativo. Se evidencia el sentido de pertenencia por parte del/la colaborador(a).',
                  margin: [2, 3, 2, 3],
                  fontSize: 9
                },
                {
                  text: 'La organización cuenta con un mayor nivel de conocimiento, madurez y conciencia sobre DEI. Prácticas sostenibles y estratégicas. Creatividad e innovación en los programas e iniciativas. Ventaja cooperativa. Comunicación asertiva. Acciones referentes. Líderes movilizadores (Sponsors Champions). Líderes multiplicadores para el ecosistema, cadena de valor. Comités estratégicos. Promotores de prácticas para la industria en el sector. Presupuesto estratégico multidimensional. Enfoque diferencial e interseccional. Excepcional representación visible de la diversidad. Monitoreo y métricas cuantitativas y cualitativas. Se evidencia el sentido de pertenencia por parte del/la colaborador(a). Impactos marca empleadora y reputación corporativa.',
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
