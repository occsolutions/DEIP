
export default {
  generateHeaderTitle (title: string, isToc = true, customWidth = 368) {
    return {
      pageBreak: 'before',
      layout: 'noBorders',
      table: {
        widths: [customWidth, 0],
        body: [
          [
            { text: title, bold: true, color: '#444444', margin: [22, 21, 22, 18], fontSize: 20 },
            // ToC text
            isToc ? { text: title, fontSize: 0, tocItem: 'mainToc', tocMargin: [0, 8, 0, 0] } : {}
          ]
        ]
      },
      alignment: 'left',
      margin: [25, -100, 0, 0]
    }
  },
  generateScoreWithHeatMap (score: string, color: string, cellMargin: Array<number>, leftMargin = -4) {
    return {
      table: {
        headerRows: 1,
        widths: [30.5],
        body: [
          [{
            text: score,
            margin: cellMargin,
            fontSize: 11,
            alignment: 'center',
            bold: true,
            color: '#444444',
            characterSpacing: 0.2,
            border: [false, false, false, true]
          }]
        ]
      },
      margin: [leftMargin, 0, 0, -1.7],
      alignment: 'center',
      layout: {
        hLineWidth: () => {
          return 4
        },
        hLineColor: () => {
          return color
        }
      }
    }
  },
  calculateIndividualBarWidth (score: number) {
    const base = 38
    if (score <= 1.5) {
      return ((score + -0.5) * base) + -5
    } else if (score > 1.5 && score <= 2) {
      return (score * base)
    } else if (score > 2 && score <= 2.5) {
      return ((score + 0.51) * base) + 5
    } else if (score > 2.5 && score <= 3) {
      return ((score + 1.05) * base) + 10
    } else if (score > 3 && score <= 3.5) {
      return ((score + 1.52) * base) + 15
    } else if (score > 3.5 && score <= 4) {
      return ((score + 2.1) * base) + 20
    } else if (score > 4 && score <= 4.5) {
      return ((score + 2.7) * base) + 25
    } else if (score > 4.5 && score <= 5) {
      return ((score + 3.15) * base) + 30
    }
  },
  generateIndividualScoreBar (score: number, marginTop: number, marginLeft: number) {
    return {
      layout: { defaultBorder: '', fillColor: '#445bcc' },
      table: {
        headerRows: 1,
        widths: [score === 1 ? -9 : this.calculateIndividualBarWidth(score)],
        heights: [1],
        body: [
          [{ text: '', lineHeight: 0.01 }]
        ]
      },
      margin: [marginLeft, marginTop, 0, 0],
      border: [false, false, false, false],
      alignment: 'left'
    }
  },
  calculateBarWidth (score: number) {
    const base = 28.5
    if (score <= 1.5) {
      return ((score + -0.5) * base) + -5
    } else if (score > 1.5 && score <= 2) {
      return (score * base)
    } else if (score > 2 && score <= 2.5) {
      return ((score + 0.5) * base) + 5
    } else if (score > 2.5 && score <= 3) {
      return ((score + 1) * base) + 10
    } else if (score > 3 && score <= 3.5) {
      return ((score + 1.5) * base) + 15
    } else if (score > 3.5 && score <= 4) {
      return ((score + 2) * base) + 20
    } else if (score > 4 && score <= 4.5) {
      return ((score + 2.5) * base) + 25
    } else if (score > 4.5 && score <= 5) {
      return ((score + 3) * base) + 30
    }
  },
  generateSimpleScoreBar (score: number, marginTop: number, marginLeft = -2.8) {
    return {
      layout: { defaultBorder: '', fillColor: '#445bcc' },
      table: {
        headerRows: 1,
        widths: [score === 1 ? -10 : this.calculateBarWidth(score)],
        heights: [1],
        body: [
          [{ text: '', lineHeight: 0.01 }]
        ]
      },
      margin: [marginLeft, marginTop, 0, 0],
      border: [false, false, false, false],
      alignment: 'left'
    }
  },
  generatePreviousScoreBar (score: number, previous: number, marginTop: number, marginLeft = -2.8) {
    return [
      {
        layout: { defaultBorder: '', fillColor: '#445bcc' },
        table: {
          headerRows: 1,
          widths: [score === 1 ? -10 : this.calculateBarWidth(score)],
          heights: [1],
          body: [
            [{ text: '', lineHeight: 0.01 }]
          ]
        },
        margin: [marginLeft, marginTop, 0, 0],
        alignment: 'left'
      },
      {
        layout: { defaultBorder: '', fillColor: '#000000' },
        table: {
          headerRows: 1,
          widths: [previous === 1 ? -10 : this.calculateBarWidth(previous)],
          heights: [1],
          body: [
            [{ text: '', lineHeight: 0.01 }]
          ]
        },
        margin: [marginLeft, -1, 0, 0],
        alignment: 'left'
      }
    ]
  }
}
