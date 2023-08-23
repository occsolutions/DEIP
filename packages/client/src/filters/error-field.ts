
export default (value: string, name: string, label: string) => {
  if (!value) return ''
  return value.replace('{field}', label || name)
}
