
const examplesWords = ['Cuerda', 'Limpieza', 'Esmalte', 'Propina', 'Bailarina', 'Micro', 'Venecia', 'Chinche', 'Alzar', 'Casado', 'Trasnocha', 'Cabina', 'Nombre', 'Malo', 'Pesadilla', 'Vegetal', 'Buzo', 'Tragaluz', 'Detenerse', 'Judas', 'Morder', 'Trigo', 'Alquiler', 'Kamikaze', 'Cordón', 'Oasis', 'Biplano', 'Fingir', 'Insensible', 'Lucifer', 'Calentador', 'Camping', 'Pasamanos', 'Nacimiento', 'Adoptar', 'Tierras', 'Soldar', 'Indios', 'Picotear', 'Visera', 'Lanza', 'Remolcador', 'Manubrio', 'Velero', 'Papelera', 'Reno', 'Ovillo', 'Transparente', 'Calculadora', 'China', 'Sastre', 'Altavoz', 'Consistencia', 'Granjero', 'Decir', 'Negocios', 'Revocar', 'Estatua', 'Cometa', 'Sentado', 'Acupuntura', 'Momia', 'Perla', 'Ciego', 'Fecha', 'Hincha', 'Involuntario', 'Diagrama', 'Escuchar', 'Bailarina', 'Moverse', 'Abrigo', 'Coma']

function getIdx (max, min) {
  return Math.floor(Math.random() * (max - min) + min)
}

export default (vueInstance, options) => {
  options = options || {}
  const min = options.min && typeof options.min === 'number' ? options.min : 1
  const max = options.max && typeof options.max === 'number' ? options.max : 5
  const words = options.words && typeof options.words === 'object' ? options.words : examplesWords
  const tmpAnswers = vueInstance.evaluated.temp
  const additionalQs = vueInstance.evaluation.additionalQuestions
  const openQs = vueInstance.evaluation.openQuestions

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

  // Indices
  tmpAnswers.indices.forEach(i => {
    i.answer = getIdx(max, min)
  })

  // Additional Questions
  if (vueInstance.hasAdditionalQuestions) {
    additionalQs.forEach((a, index) => {
      const randomAnswer = a.options[Math.floor(Math.random() * a.options.length)]
      tmpAnswers.additional[index].answer[0] = randomAnswer
    })
  }

  // Open Questions
  openQs.forEach((o, index) => {
    const shuffled = words.sort(() => { return 0.5 - Math.random() })
    const sliced = shuffled.slice(0, tmpAnswers.open[index].answer.length)
    tmpAnswers.open[index].answer = sliced
  })

  vueInstance.displayedMiddleDialog = true
  vueInstance.saveAnswers()
  vueInstance.currentPage = vueInstance.pages.length - 1
}
