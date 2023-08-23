
export default (value: any) => {
  if (!value || typeof value !== 'string') {
    return ''
  }

  return value.toUpperCase().trim()
}
