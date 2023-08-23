
const specialParameters = {
  page: (value: number) => {
    return value ? value - 1 : null
  }
}

export default (args: any) => {
  const params: {[k: string]: any} = {}
  for (const key in args) {
    const valueSpecialParameters = Object.getOwnPropertyDescriptor(specialParameters, key)

    if (valueSpecialParameters) {
      const value = valueSpecialParameters.value(args[key])
      if (value !== null) {
        params[key] = value
      }
    } else if (args[key] !== null && args[key] !== undefined) {
      params[key] = args[key]
    }
  }
  return { params }
}
