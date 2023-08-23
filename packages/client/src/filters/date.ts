
import { DateUtils } from '../libraries/common'

const dateUtils = new DateUtils()

export default (value: any, format: { date: boolean; hour: boolean}) => {
  if (!value) {
    return ''
  }
  if (!format) {
    format = { date: true, hour: true }
  }

  const formattedDate = dateUtils.format(new Date(value), format)

  return formattedDate.trim()
}
