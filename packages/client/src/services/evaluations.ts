
import mapParameters from '../utils/map-parameters'
import Services from './base-services'

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
  }
}
