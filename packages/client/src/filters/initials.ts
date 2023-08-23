
export default (value: any) => {
  if (!value) {
    return ''
  }

  return value.split(' ')
    .splice(0, 2)
    .map((word: any) => word[0].toUpperCase())
    .join('')
}
