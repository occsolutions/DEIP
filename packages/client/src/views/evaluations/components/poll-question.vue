
<template>
  <h5 v-if="!hasTooltip" class="mt-5 text-left headline" style="cursor: default; user-select: none;">
    {{ label }}
  </h5>
  <h5 v-else class="mt-5 text-left headline" style="cursor: default; user-select: none;">
    {{ tooltipInfo.start }}
    <v-tooltip top
      color="info darken-1"
      :open-on-click="false"
      :open-on-focus="false"
    >
      <template v-slot:activator="{ on }">
        <!-- text-decoration-underline -->
        <span v-on="on"
          class="headline info--text text--darken-1 font-weight-medium"
        >{{tooltipInfo.key}}</span>
      </template>
      <span class="body-2" v-html="tooltipInfo.helpText"></span>
    </v-tooltip>
    {{ tooltipInfo.end }}
  </h5>
</template>

<script>

import Vue from 'vue'

export default Vue.extend({
  props: {
    question: Object,
    lang: String
  },
  data () {
    return {
      tooltipInfo: {
        start: '',
        key: '',
        end: '',
        helpText: ''
      },
      helpTexts: {
        es: {
          'acciones afirmativas': 'Acciones/comportamientos en pro de la inclusión y la equidad',
          'ambiente incluyente': 'Espacio donde todas las personas son valoradas y respetadas',
          'aristas de la inclusión y la diversidad': 'Género, diversidad sexual, etnia, origen, nivel socioeconómico, disCapacidad, entre otras',
          balance: 'Equilibrio/armonía en la cotidianidad',
          champions: 'Líderes del equipo directivo para la estrategia de Diversidad, Equidad e Inclusión',
          'comunidades o poblaciones vulnerables': 'Poblaciones que enfrentan a desafíos sociales y/o discriminación',
          'grupos de afinidad': 'Comparten características, experiencias de vida y movilizan cultura incluyente',
          'grupos de interés': 'Individuos y organizaciones que tienen relación con la misión y el propósito de su organización',
          'impacto social': 'Resultado o consecuencia de una acción sobre la sociedad/comunidad',
          'propósito superior': 'La razón por la cual existe y el legado que desea dejar más allá de lo económico',
          'sesgos inconscientes': 'Creencias automáticas y etiquetas con referencia a una persona',
          sostenibilidad: 'Cuidar las necesidades de la generación actual y las generaciones futuras',
          'talento diverso': 'Género, diversidad sexual, etnia, origen, nivel socioeconómico, disCapacidad, entre otras',
          'aaa bbb': '',
          'xxx yyy': ''
        },
        en: {
          'affirmative actions': 'Actions/behaviors in favor of inclusion and equity',
          'inclusive environment': 'Space where all people are valued and respected',
          'aspects of inclusion and diversity': 'Gender, sexual diversity, ethnicity, origin, socioeconomic level, disability, among others',
          balance: 'Harmony in everyday life',
          champions: 'Leaders of the management team for the Diversity, Equity and Inclusion strategy',
          'vulnerable communities or populations': 'Populations that face social challenges and/or discrimination',
          'affinity groups': 'They share characteristics, life experiences and mobilize an inclusive cultur',
          'interest groups': 'Individuals and organizations that are related to the mission and purpose of your organization',
          'social impact': 'Result or consequence of an action on society/community',
          'higher purpose': 'The reason why exists and the legacy it wants to leave beyond the economic',
          'unconscious biases': 'Automatic beliefs and labels with reference to a person',
          sustainability: 'Caring for the needs of the current generation and future generations',
          'diverse talent': 'Gender, sexual diversity, ethnicity, origin, socioeconomic level, disability, among others',
          'aaa bbb': '',
          'xxx yyy': ''
        }
      }
    }
  },
  computed: {
    hasTooltip () {
      let found = false
      Object.keys(this.helpTexts[this.lang]).forEach(key => {
        if (this.question.label[this.lang].includes(key)) {
          const parts = this.question.label[this.lang].split(key)
          const qCnt = this.question.qCount ? `${this.question.qCount}.- ` : ''
          this.tooltipInfo = {
            start: qCnt + parts[0],
            key: key,
            end: parts[1],
            helpText: this.helpTexts[this.lang][key]
          }
          found = true
        }
      })
      return found
    },
    label () {
      const qCnt = this.question.qCount ? `${this.question.qCount}.- ` : ''
      return qCnt + this.question.label[this.lang]
    }
  },
  methods: {
    //
  }
})
</script>
