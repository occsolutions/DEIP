
import mapParameters from '../utils/map-parameters'
import Services from './base-services'

const service = new Services('evaluated')

interface IOptionsList {
  page?: number;
  itemsPerPage?: number;
  filter?: string;
  search?: string;
}

export default {
  list: (evaluationRef: string, options: IOptionsList) => {
    const params = mapParameters({
      page: options && options.page ? options.page : null,
      rowsPerPage: options && options.itemsPerPage ? options.itemsPerPage : null,
      filter: options && options.filter ? options.filter : null,
      search: options && options.search ? options.search : null
    })
    return service.get(`list/${evaluationRef}`, params)
  }
}
