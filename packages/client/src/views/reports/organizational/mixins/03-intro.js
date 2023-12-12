
import pdfUtils from '../../utils/pdf'
import headerBase64 from '../../base64files/intro-header'
import midBase64 from '../../base64files/intro-mid'
import footerBase64 from '../../base64files/intro-footer'

export default {
  methods: {
    $generateIntro () {
      const fontSize = 9.5

      return [
        pdfUtils.generateTitle(this.$t('Views.Evaluations.report.toc.introduction'), [0, 0, 0, 0], 'before', 38),
        {
          image: headerBase64,
          absolutePosition: { x: 380, y: 4 }
        },
        {
          text: '“Elevados niveles de igualdad, diversidad e inclusión están asociados a una mayor innovación, productividad y rendimiento, atracción y retención de talentos, y al bienestar del personal”',
          margin: [0, 30, 290, 0],
          fontSize,
          bold: true
        },
        {
          text: 'En los últimos 30 años, en el lugar de trabajo se ha promovido: La reducción signiﬁcativa de la brecha de género, aumento de la diversidad étnica; mayores esfuerzos para incluir a las personas con discapacidad y una fuerza de trabajo más multigeneracional, entre otras iniciativas. De esta manera, se genera una conciencia mundial en la que las personas tienen derecho a un lugar de trabajo digno y respetuoso, independientemente de su diversidad.',
          margin: [0, 15, 290, 0],
          fontSize
        },
        {
          image: midBase64,
          fit: [279, 198],
          absolutePosition: { x: 334, y: 120 }
        },
        {
          text: 'Esto, ayuda a crear empresas más innovadoras, productivas y resilientes porque aprovechan al máximo el poder de la diversidad y la inclusión, impulsando el éxito económico y competitivo organizacional*.',
          margin: [0, 20, 0, 0],
          fontSize
        },
        {
          text: 'De esta manera, trabajar cada vez más en DEIP tiene un impacto signiﬁcativo en la gestión y desempeño organizacional, además de cambios perdurables en el tiempo en innovación, creatividad, toma de decisiones, liderazgo, reputación y ﬁdelización del talento.',
          margin: [0, 15, 20, 0],
          fontSize
        },
        {
          text: 'Con el Índice de Evolución DEIP, se busca identiﬁcar el nivel de conocimiento, consciencia y madurez sobre la estrategia DEIP e inspirar y monitorear la evolución de los mismos en las organizaciones.',
          margin: [0, 15, 20, 0],
          fontSize,
          bold: true,
          color: '#1999da'
        },
        {
          text: 'Así mismo, se pretende generar compromiso valorando la diversidad, fomentando espacios equitativos e inclusivos para que todos(as) puedan acceder a las mismas oportunidades de ﬂorecimiento y desarrollo personal y profesional.',
          margin: [0, 18, 10, 0],
          fontSize,
          lineHeight: 1.4
        },
        {
          image: footerBase64,
          fit: [287, 170],
          absolutePosition: { x: 0, y: 545 }
        },
        {
          text: '*Organización Internacional del Trabajo (OIT)',
          margin: [212, 147, 0, 0],
          fontSize: 7.5
        },
        {
          text: [{ text: 'Fuente:' }, { text: 'https://n9.cl/uyp7s', link: 'https://n9.cl/uyp7s' }],
          margin: [212, 0, 0, 0],
          fontSize: 7.5
        }
      ]
    }
  }
}
