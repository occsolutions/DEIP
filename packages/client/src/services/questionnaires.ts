
import mapParameters from '../utils/map-parameters'
import Services from './base-services'

const service = new Services('questionnaires')

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
  listFiltered: () => {
    return service.get('filtered')
  },
  create: (questionnaire: any) => {
    return service.post('create', { questionnaire })
  },
  getOne: (slug: string) => {
    return service.get(`get-one/${slug}`)
  },
  edit: (slug: string, questionnaire: any) => {
    return service.post(`edit/${slug}`, { questionnaire })
  },
  editOptions: (slug: string, questionnaire: any) => {
    return service.post(`edit/${slug}/options`, { questionnaire })
  },
  toggle: (slug: string, active: boolean) => {
    return service.post(`toggle/${slug}`, { active })
  },
  updateInfo: (slug: string, questionnaire: any) => {
    return service.post(`update-info/${slug}`, { questionnaire })
  },
  questionsTypes: () => {
    return service.get('questions-types')
  }
}
