
function setScore (source, qty) {
  const result = []
  for (let i = 0; i < qty; i++) {
    const newScore = source[Math.floor(Math.random() * source.length)]
    if (!result.includes(newScore)) {
      result.push(newScore)
    }
  }
  return result
}

export default (vueInstance) => {
  const tmpAnswers = vueInstance.evaluated.temp
  const additionalQs = vueInstance.evaluation.additionalQuestions

  // Additional Segmentation
  if (vueInstance.hasSegmentation) {
    tmpAnswers.segmentation.forEach(s => {
      s.detailId = -1
    })
  }

  // Questionnaire
  tmpAnswers.evaluations.forEach(d => {
    d.attribute.forEach(v => {
      switch (v.qType) {
        case 'closed':
          v.score = setScore([0, 0.01, 1], 1)
          break
        case 'likert':
          v.score = setScore([0, 0.25, 0.5, 0.75, 1], 1)
          break
        case 'options':
          v.score = setScore([0.01, 0.02, 0.03, 0.04], Math.floor(Math.random() * (4 - 1) + 1))
          break
      }
    })
  })

  // Additional Questions
  if (vueInstance.hasAdditionalQuestions) {
    additionalQs.forEach((a, index) => {
      const randomAnswer = a.options[Math.floor(Math.random() * a.options.length)]
      tmpAnswers.additional[index].answer[0] = randomAnswer
    })
  }

  vueInstance.displayedMiddleDialog = true
  vueInstance.saveAnswers()
  vueInstance.currentPage = vueInstance.pages.length - 1
}
