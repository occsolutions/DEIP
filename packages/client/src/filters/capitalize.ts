
export default (value: any) => {
  if (!value || typeof value !== 'string') {
    return ''
  }

  value = value.trim()
  const lowerCase = value.slice(1).toLowerCase()

  return value.charAt(0)
    .toUpperCase()
    .concat(lowerCase)
}
