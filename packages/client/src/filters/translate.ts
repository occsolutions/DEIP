
export default (value: any, alter: 'code') => {
  if (!value || typeof value !== 'object') {
    return ''
  }

  return value.translate ? value.translate.label : value[alter]
}
