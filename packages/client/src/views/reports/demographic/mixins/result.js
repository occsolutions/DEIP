
import pdfUtil from '../../utils/pdf';

export default {
  methods: {
    generateGeneralTable() {
      const tables = [{
        margin: [20, 15, 0, 0],
        table: pdfUtil.generateTable(
          [ '50%', '20%', '20%' ],
          [
            [
              {
                text: this.$t('demographicReport.participants'),
                alignment: 'center',
              },
              {
                text: this.totalReceivers,
                alignment: 'center',
              },
              {
                text: this.totalObtained,
                alignment: 'center',
              },
            ],
          ],
          [
            this.$t('demographicReport.population'),
            this.$t('demographicReport.total_sent').replace(': ', ''),
            this.$t('demographicReport.total_obtained').replace(': ', ''),
          ],
        ),
        layout: pdfUtil.setLayout(),
      }];

      return tables;
    },
    generateDemographicPopulationTable(){
      const tables = []
      const rows = {}
      for(const demographic in this.totalItems){
        const subId = demographic === 'jobTypes' || demographic === 'departments' ? `${demographic.slice(0, -1)}Id` : `${demographic}Id`
        for(const key in this.totalItems[demographic]){
          const idKey = this.totalItems[demographic][key].id;
          const abstainedParticipants = this.dimensionsByDemographicsCuts[demographic].hasOwnProperty(idKey) ? this.dimensionsByDemographicsCuts[demographic][idKey].abstained : 0
          const obtainedParticipants = this.dimensionsByDemographicsCuts[demographic].hasOwnProperty(idKey) ? this.dimensionsByDemographicsCuts[demographic][idKey].population : 0
          const expectedParticipants = Number(abstainedParticipants) + Number(obtainedParticipants)
          if (!rows.hasOwnProperty(demographic)) { rows[demographic] = [] }
          rows[demographic].push([
            {
              text: demographic === 'headquarter' ?
                this.totalItems[demographic][key].name :
                  demographic === 'charge' || demographic === 'gender' ||
                  demographic === 'additionalDemographic1' || demographic === 'additionalDemographic2' ?
                    this.totalItems[demographic][key].translations.find((t) => t.lang === this.lang).label :
                      demographic === 'age' || demographic === 'antiquity' ?
                        this.$t(`demographicReport.${demographic}_range.${this.totalItems[demographic][key].id}`) :
                          this.totalItems[demographic][key].translate.label,
              alignment: 'left',
            },
            {
              text: expectedParticipants > this.totalReceivers ? this.totalReceivers : expectedParticipants,
              alignment: 'center',
            },
            {
              text: obtainedParticipants > expectedParticipants ? expectedParticipants : obtainedParticipants,
              alignment: 'center',
            }
          ])
        }
        if (rows[demographic]) {
          tables.push({
            margin: [20, 15, 0, 0],
            table: pdfUtil.generateTable(
              ['50%', '20%', '20%'],
              rows[demographic],
              [
                this.$t(`demographicReport.${demographic}`),
                this.$t('demographicReport.total_sent').replace(': ', ''),
                this.$t('demographicReport.total_obtained').replace(': ', '')
              ]
            ),
            layout: pdfUtil.setLayout()
          })
        }
      }
      return tables;
    },
    generateDimensionsTable(demographicCut) {
      const rows = [];
      for (const dim in demographicCut) {
        const row = [];
        row.push();
        rows.push([
          { text: demographicCut[dim].label, alignment: 'left', bold: false, fontSize: 10 },
          { text: `${this.$round(demographicCut[dim].values[1])}%`, alignment: 'center', fillColor: pdfUtil.getColor(demographicCut[dim].values[1]) },
          { text: `${this.$round(demographicCut[dim].values[2])}%`, alignment: 'center', fillColor: pdfUtil.getColor(demographicCut[dim].values[2]) },
          { text: `${this.$round(demographicCut[dim].values[3])}%`, alignment: 'center', fillColor: pdfUtil.getColor(demographicCut[dim].values[3]) },
          { text: `${this.$round(demographicCut[dim].values[4])}%`, alignment: 'center', fillColor: pdfUtil.getColor(demographicCut[dim].values[4]) },
          { text: `${this.$round(demographicCut[dim].values[5])}%`, alignment: 'center', fillColor: pdfUtil.getColor(demographicCut[dim].values[5]) },
          { text: `${this.$round(demographicCut[dim].values[6])}%`, alignment: 'center', fillColor: pdfUtil.getColor(demographicCut[dim].values[6]) },
          { text: `${this.$calcTotal(demographicCut[dim].values)}%`, alignment: 'center', bold: true, fillColor: pdfUtil.getColor(this.$calcTotal(demographicCut[dim].values)) },
        ]);
      }
      return rows;
    },
    generateTotalDimensionsRows(){
      return [
        { text: this.$t(`demographicReport.global_score`), alignment: 'left', bold: true },
        { text: `${this.$round(this.currentDimensionsResults[1])}%`, alignment: 'center', bold: true, fillColor: pdfUtil.getColor(this.currentDimensionsResults[1]) },
        { text: `${this.$round(this.currentDimensionsResults[2])}%`, alignment: 'center', bold: true, fillColor: pdfUtil.getColor(this.currentDimensionsResults[2]) },
        { text: `${this.$round(this.currentDimensionsResults[3])}%`, alignment: 'center', bold: true, fillColor: pdfUtil.getColor(this.currentDimensionsResults[3]) },
        { text: `${this.$round(this.currentDimensionsResults[4])}%`, alignment: 'center', bold: true, fillColor: pdfUtil.getColor(this.currentDimensionsResults[4]) },
        { text: `${this.$round(this.currentDimensionsResults[5])}%`, alignment: 'center', bold: true, fillColor: pdfUtil.getColor(this.currentDimensionsResults[5]) },
        { text: `${this.$round(this.currentDimensionsResults[6])}%`, alignment: 'center', bold: true, fillColor: pdfUtil.getColor(this.currentDimensionsResults[6]) },
        { text: `${this.$calcTotal(this.currentDimensionsResults)}%`, alignment: 'center', bold: true, fillColor: pdfUtil.getColor(this.$calcTotal(this.currentDimensionsResults)) },
      ]
    },
    getDemographicTable(demographicCut, demographic, tablesCountPerPage) {
      // Anchos
      const widths = [ '25%', '10%', '10%', '12%', '10%', '10%', '10%', '10%' ]
      let arrayTable = [], count = 1, flagRowCount = 0
      const content = [], limit = 18, dividedObject = {}

      arrayTable = Object.keys(demographicCut)
      arrayTable.forEach((id) => {
        if (!dividedObject.hasOwnProperty(count) ) { dividedObject[count] = [] }
        dividedObject[count].push(demographicCut[id])
        flagRowCount += 1;
        if (flagRowCount >= limit) { 
          count += 1;
          flagRowCount = 0;
        }
      })

      for(const pos in dividedObject){
        const rows = []
        if (pos === '1') {
          rows.push(this.generateTotalDimensionsRows())
        }
        rows.push(...this.generateDimensionsTable(dividedObject[pos]))
        content.push({
          table: pdfUtil.generateTable(
            widths,
            rows,
            [
              this.$t(`demographicReport.${demographic}`),
              this.$t('demographicReport.my_inspiration'),
              this.$t('demographicReport.my_job'),
              this.$t('demographicReport.positive_work_enviroment'),
              this.$t('demographicReport.my_team'),
              this.$t('demographicReport.my_development_and_learning'),
              this.$t('demographicReport.the_leaders'),
              this.$t('demographicReport.total'),
            ],
            this.$t(`demographicReport.${demographic}`), // Top table Title
          ),
          layout: pdfUtil.setLayout(),
          margin: tablesCountPerPage === 0 && pos != 1 ? [0, 0, 20, 0] : [0, -25, 20, 0],
          pageBreak: tablesCountPerPage === 0 && dividedObject[pos].length === limit  ? 'after' : ''
        });
      }
      return content;
    },
    /* Metodo que retorna todas las tablas por corte demográfico */
    generateAllDemgraphicsTables() {
      const tableStruct = [];
      var sumRowsPerPage = 0;
      var rowsGeneralCount = 0;
      var tablesCountPerPage = 0;
      for (const demographic in this.resultsByDemographicsCuts) {
        // Contar la cantidad de filas para la página
        rowsGeneralCount = Object.keys(this.resultsByDemographicsCuts[demographic]).length;
        sumRowsPerPage += rowsGeneralCount
        if (
          (sumRowsPerPage >= 14 &&  tablesCountPerPage === 1) ||
          (sumRowsPerPage >= 9 &&  tablesCountPerPage === 2) ||
          (sumRowsPerPage >= 7 &&  tablesCountPerPage === 3) ||
          (tablesCountPerPage === 4)
        ){
          tableStruct.push({ text: '', pageBreak: '', });
          tablesCountPerPage = 0;
          sumRowsPerPage = rowsGeneralCount;
        }
        tableStruct.push(pdfUtil.generateTitle(''));
        const tables = this.getDemographicTable( this.resultsByDemographicsCuts[demographic], demographic, tablesCountPerPage );
        tables.forEach((table) => {
          tableStruct.push(table);
        })
        tablesCountPerPage += 1;
      }
      return tableStruct;
    },
    $generateSummaryResults() {
      return [
        pdfUtil.generateTitle(`${this.$t('demographicReport.results')}`, null, 'before'),
        {
          text: `${this.totalParticipantsPercent}%`,
          color: '#2196F3',
          fontSize: 45,
          absolutePosition: { x: 390, y: 50 },
        },
        {
          text: `${this.$t('demographicReport.total_obtained')} ${this.totalObtained}`,
          absolutePosition: { x: 400, y: 130 },
        },
        {
          text: `${this.$t('demographicReport.total_sent')} ${this.totalReceivers}`,
          absolutePosition: { x: 400, y: 145 },
        },

        pdfUtil.generateTitle(`${this.$t('demographicReport.answers_rate')}`),
        this.generateGeneralTable(),
        pdfUtil.generateTitle(`${this.$t('demographicReport.demographic_answers_rate')}`, null, [0, 20, 0, 10]),
        ...this.generateDemographicPopulationTable(),
        {
          text: '',
          pageBreak: 'before',
          pageOrientation: 'landscape',
        },
        pdfUtil.generateTitle(`${this.$t('demographicReport.results')}`, null, [0, 10]),
        this.generateAllDemgraphicsTables()
      ]
    }
  }
};
