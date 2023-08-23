
import Services from './base-services'

const service = new Services('follow-ups')

export default {
  getResults: (type: string, id: number, codes: Array<string>) => {
    return service.post(`${type}/${id}/get-results`, { codes })
  }
}
