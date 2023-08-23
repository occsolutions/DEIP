
export default {
  name: 'dateBetween',
  definition: {
    message: (field: string) => `${field} deben establecerse entre las fechas de la medición.`,
    validate: (value: any, param: any) => {
      if (Array.isArray(param) && param.length === 3) {
        const [day, month, year] = value.split('/')
        const [hour, min] = param[2].split(':')

        const date = new Date()
        date.setFullYear(year, month - 1, day)
        date.setHours(hour, min, 0, 0)
        const time = date.getTime()
        return time > param[0] && time < param[1]
      } else {
        // tslint:disable-next-line:no-console
        console.error('Invalid params to perform validation')
        return false
      }
    }
  }
}
