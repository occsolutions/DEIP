
export class DateUtils {
  public static isAfter (date: Date, afterDate: Date = new Date(), equal = false): boolean {
    afterDate.setHours(0, 0, 0, 0)
    date.setHours(0, 0, 0, 0)
    return equal ? date >= afterDate : date > afterDate
  }

  public static isNowAfter (date: Date, afterDate: Date = new Date()): boolean {
    return this.isAfter(date, afterDate, true)
  }

  public static formatToUS (value: string) {
    const [day, month, year] = value.split('/')
    return `${year}-${month}-${day}`
  }

  public format (date: Date, options = { date: true, hour: true }): string {
    let result = ''

    if (options.date) {
      const day = this.padZeros(date.getUTCDate())
      const month = this.padZeros(date.getUTCMonth() + 1)
      const year = date.getUTCFullYear()
      result += `${day}/${month}/${year}`
    }

    if (options.hour) {
      const hours = this.padZeros(date.getUTCHours())
      const minutes = this.padZeros(date.getUTCMinutes())
      const seconds = this.padZeros(date.getUTCSeconds())
      if (result.length > 0) {
        result += ' '
      }
      result += `${hours}:${minutes}:${seconds}`
    }

    return result
  }

  private padZeros (n: number, length = 2): string {
    const str = n.toString()
    const leadingZerosCount = length > str.length ? length - str.length : 0
    return '0'.repeat(leadingZerosCount) + str
  }
}
