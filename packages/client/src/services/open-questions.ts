
import Services from './base-services'

const service = new Services('open-questions')

export default {
  list: () => {
    return service.get('list')
  },
  updateQuestion: (data: any) => {
    return service.put('edit-question', { data })
  }
}
