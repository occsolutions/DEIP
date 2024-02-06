
import mapParameters from '../utils/map-parameters'
import resolver from '@/utils/resolver'

import Services from './base-services'
import academicDegreeService from './academic-degrees'
import chargeService from './charges'
import countryService from './countries'
import demographicItemsService from './demographic-items'
import departmentService from './departments'
import genderService from './genders'
import headquarterService from './headquarters'
import jobTypeService from './job-types'
import additionalDemographics1Service from './additional-demographics1'
import additionalDemographics2Service from './additional-demographics2'

const service = new Services('evaluations')

interface IOptionsList {
  page?: number;
  itemsPerPage?: number;
  filter?: string;
  search?: string;
}

export default {
  list: (options: IOptionsList) => {
    const params = mapParameters({
      page: options && options.page ? options.page : null,
      rowsPerPage: options && options.itemsPerPage ? options.itemsPerPage : null,
      filter: options && options.filter ? options.filter : null,
      search: options && options.search ? options.search : null
    })
    return service.get('list', params)
  },
  create: (evaluation: any) => {
    return service.post('create', { evaluation })
  },
  sendInvitationFiles: (id: string, file: object) => {
    return service.form(`upload-invitation-file/${id}`, file)
  },
  sendReminderFiles: (id: string, file: object) => {
    return service.form(`upload-reminder-file/${id}`, file)
  },
  getOneToEdit: (slug: string) => {
    return service.get(`get-one-to-edit/${slug}`)
  },
  getOneToShow: (slug: string) => {
    return service.get(`get-one-to-show/${slug}`)
  },
  getOne: (slug: string) => {
    return service.get(`get-one/${slug}`)
  },
  getOneById: (id: string) => {
    return service.get(`find-by-id/${id}`)
  },
  getParticipantsByPoll: (pollId: string) => {
    return service.get(`get-participants-by-poll/${pollId}`)
  },
  getCountEvaluated: (slug: string) => {
    return service.get(`get-count-evaluated/${slug}`)
  },
  findByTokenId: (tokenId: string) => {
    return service.get(`find-by-token-id/${tokenId}`)
  },
  saveEvaluatedTempAnswers: (tokenId: string, temp: any) => {
    return service.put('save-temp-answers', { tokenId: tokenId, data: temp })
  },
  finishPoll: (tokenId: string) => {
    return service.put('finish-poll', { tokenId: tokenId })
  },
  generateReportOrganizational: (id: number) => {
    return service.post(`generate-organizational-report/${id}`)
  },
  generateReportDemographic: (id: number, criteria: any) => {
    return service.post(`generate-demographic-report/${id}`, { criteria })
  },
  currentThreadsById: (id: number) => {
    return service.get(`current-threads/${id}`)
  },
  getOneReportByThreadId: (id: number, pollId: number) => {
    return service.post(`open-thread-report/${id}`, { id: pollId })
  },
  getAdditionalQuestionAnswers: (pollId: string, question: string) => {
    return service.post(`get-additional-question-answers/${pollId}`, { question })
  },
  edit: (slug: string, evaluation: any) => {
    return service.post(`edit/${slug}`, { evaluation })
  },
  toggle: (slug: string, active: boolean) => {
    return service.post(`toggle/${slug}`, { active })
  },
  updateInfo: (slug: string, evaluation: any) => {
    return service.post(`update-info/${slug}`, { evaluation })
  },
  massiveUpload: (file: File) => {
    return service.form('massive-upload', { file: file })
  },
  generateTemplate: (filters: Array<number | string>) => {
    return service.post('generate-template', { filters })
  },
  sendReminders: (slug: string) => {
    return service.post('send-reminders', { slug })
  },
  acceptPolicy: (tokenId: string, url: string) => {
    return service.put(`accept-policy/${tokenId}`, { url })
  },
  closeEvaluation: (slug: string) => {
    return service.get(`close/${slug}`)
  },
  checkBalance: (key: string) => {
    return service.get(`check-balance/${key}`)
  },
  getDemographicsItems (lang: string) {
    return demographicItemsService.list(lang)
  },
  getAnswersCount (id: string) {
    return service.get(`get-total-answers/${id}`)
  },
  getAnswersWithParticipant (id: string, skip: number) {
    return service.get(`answers-with-participant/${id}/${skip}`)
  },
  getDemographicsItemsByEntreprise (lang: string): any {
    const demographicItemsData: any = {
      jobTypes: [],
      headquarter: [],
      gender: [],
      departments: [],
      country: [],
      charge: [],
      antiquity: [],
      age: [],
      academicDegree: [],
      optionalDemo1: [],
      optionalDemo2: []
    }
    let demographicItem: any[] = []

    return resolver.all({
      academicDegreesAll: academicDegreeService.listAll(),
      charges: chargeService.fetchByEnterprise(),
      countries: countryService.listByEnterprise(),
      demographicItem: this.getDemographicsItems(lang),
      departmentsAll: departmentService.listAll(),
      gendersAll: genderService.listAll(),
      headquarters: headquarterService.fetchByEnterprise(),
      jobTypesAll: jobTypeService.listAll(),
      additinalDemographics1All: additionalDemographics1Service.listAll(),
      additinalDemographics2All: additionalDemographics2Service.listAll()
    })
      .then((res) => {
        // TODO: falta lista de items demograficos
        demographicItem.push(...res.demographicItem.items)
        // LISTO grados academicos
        demographicItemsData.academicDegree = res.academicDegreesAll.items.map((academicDegrees: any) => ({
          ...academicDegrees,
          translate: { label: lang === 'es' ? academicDegrees.translations[0].label : academicDegrees.translations[1].label }
        }))
        // LISTO Departamentos
        demographicItemsData.departments = res.departmentsAll.items.map((departments: any) => ({
          ...departments,
          translate: { label: lang === 'es' ? departments.translations[0].label : departments.translations[1].label }
        }))
        // CHARGES
        demographicItemsData.charge = res.charges.items.map((charge: any) => ({
          ...charge,
          translate: { label: lang === 'es' ? charge.translations[0].label : charge.translations[1].label }
        }))
        // TODO: falta lista de countrys
        demographicItemsData.country = res.countries.items
        // GENDER
        demographicItemsData.gender = res.gendersAll.items.map((gender: any) => ({
          ...gender,
          translate: { label: lang === 'es' ? gender.translations[0].label : gender.translations[1].label }
        }))
        // HEADQUARTERS NO TIENE TRADUCCION EN BASE DE DATOS
        demographicItemsData.headquarter = res.headquarters
        // JOBTYPES
        demographicItemsData.jobTypes = res.jobTypesAll.items.map((jobTypes: any) => ({
          ...jobTypes,
          translate: { label: lang === 'es' ? jobTypes.translations[0].label : jobTypes.translations[1].label }
        }))

        // Additional Demographic 1
        demographicItemsData.optionalDemo1 = res.additinalDemographics1All.items.map((item: any) => ({
          ...item,
          translate: { label: lang === 'es' ? item.translations[0].label : item.translations[1].label }
        }))

        // Additional Demographic 2
        demographicItemsData.optionalDemo2 = res.additinalDemographics2All.items.map((item: any) => ({
          ...item,
          translate: { label: lang === 'es' ? item.translations[0].label : item.translations[1].label }
        }))

        // Filter optionals with no items
        demographicItem = demographicItem.filter(it => !it.optional || Boolean(demographicItemsData[it.code].length))

        return { demographicItem: demographicItem, data: demographicItemsData }
      })
  }
}
