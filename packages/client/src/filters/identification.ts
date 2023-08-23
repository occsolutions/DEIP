
export default (value: any) => {
  if (!value) { return '' }

  let identification
  if (typeof value === 'object') {
    identification = value.text
    if (value.code === 'others') { return '--' }
  } else {
    identification = value
  }

  return identification
    .split(' ')
    .map((x: any) => x.charAt(0))
    .join('')
    .toUpperCase()
}
