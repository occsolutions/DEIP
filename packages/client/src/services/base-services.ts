
import axios from 'axios'
import sendformData from '../utils/form-data'
import mapResponse from '../utils/map-response'

export default class Services {
  private readonly suiteBaseUrl = process.env.VUE_APP_SUITE_BASE_API;
  private readonly baseUrl = process.env.VUE_APP_DEIP_BASE_API;
  private module: string | undefined = '';
  private suite = false;

  constructor (module?: string) {
    this.module = module
  }

  public get (url: string, params?: object) {
    return mapResponse(axios.get(this.getUrl(url), params))
  }

  public post (url: string, data?: object) {
    return mapResponse(axios.post(this.getUrl(url), data))
  }

  public put (url: string, data?: object) {
    return mapResponse(axios.put(this.getUrl(url), data))
  }

  public form (url: string, data?: object, transf?: object) {
    return sendformData(this.getUrl(url), data, transf)
  }

  public bGet (url: string, params?: object) {
    return mapResponse(axios.get(this.getUrl(url, true), params))
  }

  public bPost (url: string, data?: object) {
    return mapResponse(axios.post(this.getUrl(url, true), data))
  }

  public bPut (url: string, data?: object) {
    return mapResponse(axios.put(this.getUrl(url, true), data))
  }

  public bForm (url: string, data?: object, transf?: object) {
    return sendformData(this.getUrl(url, true), data, transf)
  }

  public suiteOperation (callBack: Function) {
    this.suite = true
    return new Promise((resolve, reject) => {
      try {
        resolve(callBack())
      } catch (error) {
        reject(error)
      }
    }).then(resp => {
      this.suite = false
      return resp
    })
  }

  private getUrl (url: string, onlyBase = false) {
    return `${this.suite ? this.suiteBaseUrl : this.baseUrl}${onlyBase ? url : this.checkModule(url)}`
  }

  private checkModule (url: string) {
    return (this.module ? `${this.module}/` : '') + url
  }
}
