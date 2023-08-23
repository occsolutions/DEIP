
const formated = (item: any) => ({
  value: item.id,
  text: item.translate ? item.translate.label : item.code
})

export default (
  items: any[],
  callBackFormated?: () => { value: string|number; text: string },
  sortText = true
) => {
  items = items.map(callBackFormated || formated)
  return sortText ? items.sort((a, b) => a.text.localeCompare(b.text)) : items
}
