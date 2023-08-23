
export default {
  all (requests: { [key: string]: Promise<any>}): Promise<any> {
    const keys: any[] | string[] = []
    const promises = []
    for (const key of Object.keys(requests)) {
      keys.push(key)
      promises.push(requests[key])
    }
    return Promise.all(promises).then((reply) => {
      const result: {[k: string]: any} = {}
      keys.forEach((key, index) => {
        result[key] = reply[index]
      })
      return result
    })
  }
}
