
export default (value: any) => {
  if (!value || typeof value !== 'string') {
    return ''
  }

  return value.trim().split(/(?=[A-Z])/).join('_').toLowerCase()
}
