
export default (item: any, fieldAlter: 'code') => {
  if (!item || typeof item !== 'object') {
    return ''
  }

  return item.translate ? item.translate.label : item[fieldAlter]
}
