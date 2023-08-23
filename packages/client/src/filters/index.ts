
import capitalize from './capitalize'
import date from './date'
import identification from './identification'
import errorField from './error-field'
import initials from './initials'
import lowerCase from './lower-case'
import snakeCase from './snake-case'
import translate from './translate'
import upperCase from './upper-case'

const filters = [
  { key: 'capitalize', filter: capitalize },
  { key: 'date', filter: date },
  { key: 'identification', filter: identification },
  { key: 'errorField', filter: errorField },
  { key: 'initials', filter: initials },
  { key: 'lowerCase', filter: lowerCase },
  { key: 'snakeCase', filter: snakeCase },
  { key: 'upperCase', filter: upperCase },
  { key: 'translate', filter: translate }
]

export default (vue: any) => {
  filters.forEach((filter) => {
    vue.filter(filter.key, filter.filter)
  })
}
