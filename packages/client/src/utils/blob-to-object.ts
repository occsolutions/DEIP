
export default (blob: any): any => {
  const reader = new FileReader()

  return new Promise((resolve, reject) => {
    reader.addEventListener('loadend', (e: ProgressEvent) => {
      const text = e && e.srcElement ? (e.srcElement as any).result : ''
      try {
        const parsedObject = JSON.parse(text)
        resolve(parsedObject)
      } catch (err) {
        reject(err)
      }
    })
    reader.readAsText(blob)
  })
}
