
export default {
  name: 'dateNowBefore',
  definition: {
    validate: (value: any) => {
      const date = new Date()
      const date2 = new Date()
      const parts = value.split('/')
      date.setDate(parts[0])
      date.setMonth(parts[1] - 1)
      date.setFullYear(parts[2])
      return date <= date2
    },
    message: 'La {_field_} debe ser anterior (o igual) al día actual.'
  }
}
