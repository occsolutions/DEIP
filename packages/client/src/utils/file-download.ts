
const createDownloaderLink = (blob: any, fileName: string) => {
  const link = document.createElement('a')
  link.setAttribute('href', window.URL.createObjectURL(blob))
  link.setAttribute('download', fileName)
  document.body.appendChild(link)

  return link
}

export default (blob: any, fileName: string) => {
  const link = createDownloaderLink(blob, fileName)
  link.click()
  link.remove()
}
