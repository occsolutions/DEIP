
import pdfUtils from '../../utils/pdf'
import dotsBase64 from '../../base64files/objectives-dots'
import bottomBase64 from '../../base64files/objectives'

export default {
  methods: {
    $generateObjectives () {
      const fontSize = 9.5

      return [
        pdfUtils.generateTitle('Objetivos', [0, 0, 0, 0], 'before', 38),
        {
          text: 'Objetivo General:',
          margin: [0, 35, 0, 0],
          bold: true,
          fontSize
        },
        {
          text: 'Elevar el nivel de consciencia sobre el valor y el impacto DEIP con enfoque diferencial/interseccional*',
          margin: [0, 14, 0, 0],
          fontSize
        },
        {
          text: 'Objetivos Específicos:',
          margin: [0, 30, 0, 0],
          bold: true,
          fontSize
        },
        {
          text: '- Identiﬁcar el nivel de conocimiento y madurez sobre la estrategia DEIP.',
          margin: [0, 14, 0, 0],
          fontSize
        },
        {
          text: '- Determinar una línea de base cuantitativa para identiﬁcar oportunidades y medir la evolución de la',
          margin: [0, 14, 0, 0],
          fontSize
        },
        {
          text: 'estrategia y la transformación de entornos incluyentes.',
          margin: [5.5, 0, 0, 0],
          fontSize
        },
        {
          text: '- Identiﬁcar y visibilizar fortalezas, victorias tempranas e imperativos/no negociables.',
          margin: [0, 14, 0, 0],
          fontSize
        },
        {
          text: '- Inspirar y acompañar la acción sobre el mapa de ruta.',
          margin: [0, 14, 0, 0],
          fontSize
        },
        {
          text: '*Enfoque Diferencial: Aristas de la diversidad (Género, diversidad sexual, etnia, origen, nivel socioeconómico, disCapacidad, entre otras).',
          margin: [0, 300, 290, 0],
          fontSize: 7.5
        },
        {
          text: '*Interseccional: El cruce de diversidades (aristas, dimensiones) que hacen único a cada ser humano.',
          margin: [0, 30, 290, 0],
          fontSize: 7.5
        },
        {
          image: bottomBase64,
          fit: [268, 380],
          absolutePosition: { x: 290, y: 414 }
        },
        {
          image: dotsBase64,
          fit: [77, 143],
          absolutePosition: { x: 210, y: 434 }
        }
      ]
    }
  }
}
