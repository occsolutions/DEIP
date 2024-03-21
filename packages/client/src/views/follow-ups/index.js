
import { mapState } from 'vuex'
import demographicItems from '../../services/demographic-items'
import followUps from '../../services/follow-ups'
import evaluationsService from '../../services/evaluations'
import xlsxDownload from '../../utils/xlsx-download'

export default {
  data () {
    return {
      poll: {},
      step: 1,
      loadingInitial: false,
      loadingResults: false,
      selectedFiltered: [],
      selectedLabels: [],
      selectedCuts: [],
      selectedCount: 0,
      demographicCuts: [],
      results: [],
      wholes: {
        total: 0,
        obtained: 0
      }
    }
  },
  computed: {
    headers () {
      const headers = [
        {
          text: this.selectedLabels[0],
          align: 'start',
          sortable: false,
          value: 'demo1'
        }
      ]

      if (this.selectedLabels[1]) {
        headers.push({
          text: this.selectedLabels[1],
          align: 'start',
          sortable: false,
          value: 'demo2'
        })
      }

      headers.push(
        {
          text: this.$t('Views.FollowUpReport.total_participants'),
          align: 'center',
          sortable: false,
          value: 'total',
          width: 180
        },
        {
          text: this.$t('Views.FollowUpReport.total_completed'),
          align: 'center',
          sortable: false,
          value: 'obtained',
          width: 114
        },
        {
          text: this.$t('Views.FollowUpReport.total_remaining'),
          align: 'center',
          sortable: false,
          value: 'remaining',
          width: 117
        }
      )

      return headers
    },
    ...mapState({
      user: (state) => state.session.user
    })
  },
  watch: {
    step (val) {
      if (val === 2) {
        const selectedIds = this.selectedCuts.filter(sc => sc.selected === true).map(x => x.id)
        if (selectedIds.length) {
          this.selectedFiltered = this.demographicCuts.filter(dc => selectedIds.includes(dc.id))
          this.selectedLabels = this.selectedFiltered.map(x => x.demographicItem.translate.label)
          this.generate()
        }
      }
    }
  },
  methods: {
    selectedCounter () {
      const cnt = this.selectedCuts.filter(sa => sa.selected === true)
      this.selectedCount = cnt.length
    },
    generate () {
      this.loadingResults = true
      this.results = []
      this.wholes = {
        total: 0,
        obtained: 0
      }
      const payload = this.selectedFiltered.map(x => x.demographicItem.code)
      followUps.getResults(this.$route.params.type, this.$route.params.pollId, payload)
        .then((res) => {
          this.results = res.results
          this.wholes = res.wholes
          if (this.results[0].demo2) {
            this.wholes.demo2 = this.$t('Views.FollowUpReport.totals')
          } else {
            this.wholes.demo1 = this.$t('Views.FollowUpReport.totals')
          }
          this.results.push(this.wholes)
        })
        .finally(() => {
          this.loadingResults = false
        })
    },
    getPoll () {
      this.loadingInitial = true
      evaluationsService.getOneById(this.$route.params.pollId)
        .then((res) => {
          this.poll = res
          if (this.poll.status !== 'in_progress') {
            throw new TypeError('deip/closed')
          } else {
            this.getDemographicItems()
          }
        })
        .catch((err) => {
          if (err.message) err.code = err.message
          this.$store.dispatch('alert/error', this.$t(`errors.${err.code}`))
          setTimeout(() => {
            this.$router.back()
          }, 2000)
          setTimeout(() => {
            this.loadingInitial = false
          }, 2400)
        })
    },
    getDemographicItems () {
      demographicItems.list()
        .then((res) => {
          this.demographicCuts = res.items
            .map(c => {
              this.selectedCuts[c.id] = { id: c.id, selected: false }
              return {
                id: c.id,
                demographicItem: {
                  code: c.code,
                  translate: c.translate
                }
              }
            })
            .sort((a, b) => {
              // return a.demographicItem.translate.label.localeCompare(b.demographicItem.translate.label)
              return a.id - b.id
            })
        })
        .finally(() => {
          this.loadingInitial = false
        })
    },
    exportToXls () {
      const last = this.results[this.results.length - 1]

      const obtainedPercent = this.getPercent(last.obtained, last.total)
      const remainingPercent = this.getPercent((last.total - last.obtained), last.total)

      const data = []
      for (const result of this.results) {
        if (result.total) {
          data.push({
            ...{
              [`${this.selectedLabels[0]}`]: this.$te(`Views.FollowUpReport.${result.demo1}`)
                ? this.$t(`Views.FollowUpReport.${result.demo1}`)
                : result.demo1
            },
            ...(result.demo2 && {
              [`${this.selectedLabels[1]}`]: this.$te(`Views.FollowUpReport.${result.demo2}`)
                ? this.$t(`Views.FollowUpReport.${result.demo2}`)
                : result.demo2
            }),
            ...{ [`${this.$t('Views.FollowUpReport.total_participants')}`]: result.total },
            ...{ [`${this.$t('Views.FollowUpReport.total_completed')}`]: result.obtained },
            ...{ [`${this.$t('Views.FollowUpReport.total_remaining')}`]: result.total - result.obtained }
          })
        }
      }

      // Add percents row
      const totalsRow = data[data.length - 1]
      const totalsRowKeys = Object.keys(totalsRow)
      const percentsRow = {}
      for (const key of totalsRowKeys) {
        if (key === totalsRowKeys[totalsRowKeys.length - 1]) {
          percentsRow[key] = `${remainingPercent}%`
        } else if (key === totalsRowKeys[totalsRowKeys.length - 2]) {
          percentsRow[key] = `${obtainedPercent}%`
        } else if (key === totalsRowKeys[totalsRowKeys.length - 3]) {
          percentsRow[key] = '100%'
        } else if (key === totalsRowKeys[totalsRowKeys.length - 4]) {
          percentsRow[key] = undefined
        } else {
          percentsRow[key] = totalsRow[key]
        }
      }
      data.push(percentsRow)

      xlsxDownload(
        data,
        this.$t('Views.FollowUpReport.follow_up'),
        `${this.$t('Views.FollowUpReport.followup_report')}.xlsx`,
        true
      )
    },
    getPercent (val, total) {
      const base = (val / total) * 100
      return Math.round((base + Number.EPSILON) * 100) / 100
    }
  },
  created () {
    this.getPoll()
  }
}
