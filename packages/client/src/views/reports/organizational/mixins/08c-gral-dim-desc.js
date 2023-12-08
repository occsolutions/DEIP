
export default {
  data () {
    return {
      dimensionDescriptions: {
        d1: {
          low: 'No existe o se desconoce el propósito superior. No se identifica una conexión con el impacto social/ambiental en el entorno. No se percibe intencionalidad con el balance vida-trabajo.',
          mid: 'Se reconoce la existencia de un propósito superior. Se identifica conexión con el impacto social o ambiental para el ecosistema. Hay consciencia y compromiso inicial con el balance vida-trabajo.',
          high: 'Existe un propósito superior y se alinea con el propósito personal. Se identifica conexión estratégica con el impacto social y ambiental en el ecosistema. Hay evidencia de intervenciones efectivas sobre el balance vida-trabajo.'
        },
        d2: {
          low: 'No se reconoce un Comité de DEI responsable del plan de acción DEI. No se evidencia la responsabilidad de los(as) líderes de la organización sobre los planes de carrera y desarrollo del talento diverso. No se evidencia inclusión y equidad por parte de los(as) líderes de la organización.',
          mid: 'Se reconoce la existencia de un Comité de DEI. Se evidencia una responsabilidad limitada de los(as) líderes de la organización en planes de carrera y desarrollo del talento diverso. Se evidencia que algunos líderes son inclusivos y equitativos en la organización.',
          high: 'Se reconoce la existencia de un Comité de DEI del cual se desea participar. Se evidencia una responsabilidad ejemplar de los(as) líderes de la organización en planes de carrera y desarrollo del talento diverso. Se evidencia que los líderes son referentes en inclusión y equidad en la organización.'
        },
        d3: {
          low: 'No se evidencian sesiones de sensibilización y capacitación en DEI. No se evidencian esfuerzos para educar sobre sesgos y etiquetas. No se percibe el uso de lenguaje incluyente y de no discriminación en la comunicación interna. No se percibe el uso de lenguaje incluyente y de no discriminación en la comunicación externa. No se evidencia Programas de Reconocimiento de comportamientos incluyentes.',
          mid: 'Se evidencian sesiones esporádicas de sensibilización y capacitación en DEI. Se evidencian esfuerzos parciales para educar sobre sesgos y etiquetas. Se percibe un lenguaje incluyente y de no discriminación en algunas comunicaciones internas. Se percibe un lenguaje incluyente y de no discriminación en algunas comunicaciones externas. Se evidencian Programas de Reconocimiento de comportamientos incluyentes, pero no son recompensados.',
          high: 'Se evidencian sesiones de sensibilización y capacitación periódicas en DEI. Se evidencian esfuerzos para educar sobre sesgos y etiquetas y la no repetición de estos actos. Se percibe un lenguaje incluyente ejemplar y de no discriminación en la comunicación interna. Se percibe un lenguaje incluyente referente y de no discriminación en la comunicación externa. Se evidencian Programas de Reconocimiento de comportamientos incluyentes y son recompensados.'
        },
        d4: {
          low: 'No se evidencia apertura e intencionalidad para atraer talentos diversos. No se evidencia equidad e igualdad de oportunidades en el proceso de atracción y selección de talento. No se evidencia equidad e igualdad de oportunidades en el desarrollo de carrera. No se evidencian procesos de promoción y crecimiento con base en el mérito sin importar la diversidad.',
          mid: 'Se evidencia apertura e intencionalidad por parte de algunas áreas de la organización para atraer talentos diversos. Se evidencia equidad e igualdad de oportunidades en el proceso de atracción de talento. Se evidencia equidad de oportunidades en el desarrollo de carrera. En algunas ocasiones, se evidencian procesos de promoción y crecimiento con base en el mérito sin importar la diversidad.',
          high: 'Se evidencia apertura e intencionalidad para atraer talentos diversos. Se evidencia equidad e igualdad de oportunidades en el proceso de atracción y selección de talento. Se evidencia equidad e igualdad de oportunidades en el desarrollo de carrera. Se evidencian procesos de promoción y crecimiento con base en el mérito sin importar la diversidad.'
        },
        d5: {
          low: 'No se evidencia desarrollo de productos y servicios para los clientes diversos. No se evidencian canales de denuncia de situaciones de discriminación, acoso o violencias. No se evidencia reconocimiento como organización diversa, incluyente o equitativa.',
          mid: 'Se evidencia desarrollo de algunos productos y servicios para los clientes diversos. Se evidencian pocos canales de denuncia de situaciones de discriminación, acoso o violencias. Se evidencia un reconocimiento parcial como organización diversa, incluyente y equitativa.',
          high: 'Se evidencia desarrollo de productos y servicios para los clientes diversos de manera ejemplar. Se evidencian canales de denuncia seguros y confidenciales ante situaciones de discriminación, acoso o violencias. Se evidencia un reconocimiento ejemplar y referente como organización diversa, incluyente y equitativa.'
        },
        leader: {
          low: 'No se evidencia el fomento de la cultura de inclusión. No se escuchan voces diversas para impactar y tomar decisiones. Los(as) líderes no consideran que tengan las herramientas necesarias para desarrollar talento diverso en sus equipos. Los(as) líderes no observan espacios para el desarrollo de líderes diversos. Los(as) líderes no identifican prácticas o políticas que apoyen ecosistemas diversos en cuanto a compras inclusivas (proveedores, comunidades vulnerables). Los(as) líderes no identifican prácticas que apoyen comunidades o poblaciones vulnerables.',
          mid: 'Se evidencia parcialmente un fomento de la cultura de inclusión. En algunas ocasiones los(as) líderes escuchan las voces diversas para impactar y tomar decisiones. Los(as) líderes consideran que tienen herramientas limitadas para desarrollar talento diverso en sus equipos. Los(as) líderes observan algunos espacios para el desarrollo de líderes diversos. Los(as) líderes identifican algunas prácticas o políticas que apoyan ecosistemas diversos en cuanto a compras inclusivas (proveedores, comunidades vulnerables). Los(as) líderes identifican algunas prácticas que apoyan comunidades o poblaciones vulnerables.',
          high: 'Se evidencia el fomento ejemplar de la cultura de inclusión. Los(as) líderes escuchan las voces diversas, en todo momento, para impactar y tomar decisiones. Los(as) líderes consideran que tienen herramientas suficientes para desarrollar talento diverso en sus equipos. Los(as) líderes observan que todos los espacios son seguros para el desarrollo de líderes diversos. Los(as) líderes identifican prácticas o políticas ejemplares que apoyan ecosistemas diversos en cuanto a compras inclusivas (proveedores, comunidades vulnerables). Los(as) líderes identifican prácticas referentes que apoyan comunidades o poblaciones vulnerables.'
        }
      }
    }
  },
  methods: {
    generateDimensionsDescriptionTableRows () {
      const rows = []
      Object.keys(this.answersDimension).forEach(key => {
        if (key !== 'leader') {
          rows.push([
            {
              text: this.evaluationData.questionnaire.evaluations[key].label[this.user.lang].replace(/\((.*?)\)/g, '').replace(' *', ''),
              margin: [2, 3, 0, 0],
              color: '#777777'
            },
            {
              text: this.dimensionDescriptions[key].low,
              margin: [0, 1, 0, -0.5],
              fontSize: 7.5,
              color: '#333333'
            },
            {
              text: this.dimensionDescriptions[key].mid,
              margin: [0, 1, 0, -0.5],
              fontSize: 7.5,
              color: '#333333'
            },
            {
              text: this.dimensionDescriptions[key].high,
              margin: [0, 1, 0, -0.5],
              fontSize: 7.5,
              color: '#333333'
            }
          ])
        }
      })

      return rows
    },
    generateLeadersDescriptionTableRows () {
      return [[
        {
          text: 'Líder con personas a cargo',
          margin: [2, 3, 0, 0],
          color: '#777777'
        },
        {
          text: this.dimensionDescriptions.leader.low,
          margin: [0, 1, 0, -0.5],
          fontSize: 7.5,
          color: '#333333'
        },
        {
          text: this.dimensionDescriptions.leader.mid,
          margin: [0, 1, 0, -0.5],
          fontSize: 7.5,
          color: '#333333'
        },
        {
          text: this.dimensionDescriptions.leader.high,
          margin: [0, 1, 0, -0.5],
          fontSize: 7.5,
          color: '#333333'
        }
      ]]
    },
    $generateDimDescTable (isLeader = false) {
      return [
        !isLeader ? {
          text: 'Descripción Resultados por dimensión',
          margin: [0, -5, 0, 0],
          color: '#111111',
          fontSize: 24,
          pageBreak: isLeader ? '' : 'before',
          bold: true
        } : '',
        // * ------------------------ *
        // *      DIM DESC. TABLE     *
        // * ------------------------ *
        {
          margin: [1, isLeader ? 25 : 10, 0, 0],
          fontSize: 10,
          table: {
            widths: ['*', '25%', '26%', '24%'],
            body: [
              // Headers
              [
                {
                  text: this.$t('Views.Evaluations.report.dimension'),
                  margin: [0, 3.5, 0, 1],
                  fillColor: '#f5afa6',
                  alignment: 'center',
                  color: '#222222',
                  fontSize: 9.5,
                  bold: true
                },
                {
                  text: 'Descripción Franja Baja',
                  margin: [0, 3.5, 0, 1],
                  fillColor: '#c15252',
                  alignment: 'center',
                  color: '#222222',
                  fontSize: 9.5,
                  bold: true
                },
                {
                  text: 'Descripción Franja Media',
                  margin: [0, 3.5, 0, 1],
                  fillColor: '#ffd97b',
                  alignment: 'center',
                  color: '#222222',
                  fontSize: 9.5,
                  bold: true
                },
                {
                  text: 'Descripción Franja Alta',
                  margin: [0, 3.5, 0, 1],
                  fillColor: '#93d379',
                  alignment: 'center',
                  color: '#222222',
                  fontSize: 9.5,
                  bold: true
                }
              ],
              // Body
              ...isLeader
                ? this.generateLeadersDescriptionTableRows()
                : this.generateDimensionsDescriptionTableRows()
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
