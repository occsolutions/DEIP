
import { DateUtils } from '@/libraries/common'

export default {
  name: 'dateAfter',
  definition: {
    params: ['startDate'],
    message: (field: any, placeholders: any) => {
      return placeholders.startDate
        ? `La ${field} debe ser posterior a ${placeholders.startDate}.`
        : `La ${field} debe ser posterior al día actual.`
    },
    validate: (value: any, params: any) => {
      const [day, month, year] = value.split('/')
      const date = new Date()
      date.setFullYear(year, month - 1, day)

      if (params.startDate) {
        const [day, month, year] = params.startDate.split('/')
        const afterDate = new Date()
        afterDate.setFullYear(year, month - 1, day)

        return DateUtils.isAfter(date, afterDate)
      } else {
        return DateUtils.isAfter(date)
      }
    }
  }
}
