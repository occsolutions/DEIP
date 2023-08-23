
import { DateUtils } from '@/libraries/common'

export default {
  name: 'dateNowAfter',
  definition: {
    params: ['startDate'],
    message: (field: any, placeholders: any) => {
      return placeholders.startDate
        ? `La ${field} debe ser posterior (o igual) a ${placeholders.startDate}.`
        : `La ${field} debe ser posterior (o igual) al día actual.`
    },
    validate: (value: any, params: any) => {
      const [day, month, year] = value.split('/')
      const date = new Date()
      date.setFullYear(year, month - 1, day)

      if (params.startDate) {
        const [day, month, year] = params.startDate.split('/')
        const afterDate = new Date()
        afterDate.setFullYear(year, month - 1, day)

        return DateUtils.isNowAfter(date, afterDate)
      } else {
        return DateUtils.isNowAfter(date)
      }
    }
  }
}
