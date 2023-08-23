
import axios from 'axios'
import mapResponse from '../utils/map-response'

const getValue = (prop: {[key: string]: any}, key: string) => {
  return prop[key]
}

const iterateData = (formData: FormData, data?: object, transf?: object, customKey = { base: '', add: true }) => {
  if (!data) {
    return formData
  }

  for (const key of Object.keys(data)) {
    const valueData = getValue(data, key)
    if (transf && Object.prototype.hasOwnProperty.call(transf, 'key')) {
      const transfKey = { base: `${key}-`, add: true }
      const valueTrans = Object.getOwnPropertyDescriptor(transf, key)
      if (valueTrans && valueTrans.value === 'array') {
        transfKey.base = `${key}[]`
        transfKey.add = false
      }

      iterateData(formData, valueData || '', transf, transfKey)
    } else {
      formData.append(customKey.base + (customKey.add ? key : ''), valueData || '')
    }
  }
}

export default (pathApi: string, data?: object, transf?: object) => {
  const formData = new FormData()
  iterateData(formData, data, transf || {})

  return mapResponse(axios.post(pathApi, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }))
}
