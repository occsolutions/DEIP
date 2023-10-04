
function getIdx (max, min) {
  return Math.floor(Math.random() * (max - min) + min)
}

export default (vueInstance, options) => {
  options = options || {}
  const min = options.min && typeof options.min === 'number' ? options.min : 1
  const max = options.max && typeof options.max === 'number' ? options.max : 5
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
    d.variable.forEach(v => {
      v.score = getIdx(max, min)
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
