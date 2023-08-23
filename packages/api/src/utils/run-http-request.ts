
import HttpSuperagentRequest from './http-superagent-request';
import { Request } from 'express';

interface IHttpRequest {
  product: string;
  path?: string;
  method?: string;
  data?: any;
}

class RunHttpRequest {
  private async sendRequest(request: IHttpRequest, req?: Request) {
    let httpResponse: any;
    try {
      httpResponse = await HttpSuperagentRequest.sendRequest(request, req);
    } catch (error) {
      httpResponse = error;
    }

    const response = { success: true, request, error: undefined };
    if (!(httpResponse && httpResponse.status ) || httpResponse.status !== 200) {
      response.success = false;
      response.error = {
        msg: httpResponse.message,
        status: httpResponse.status,
        httpResponse
      };
    }
    return { ...response, res: httpResponse.body };
  }

  public post(req: Request|undefined, product: string, path: string, data?: {[key: string]: any}) {
    return this.sendRequest({
      product,
      path,
      data,
      method: 'POST'
    }, req);
  }

  public get(req: Request|undefined, product: string, path: string) {
    return this.sendRequest({
      product,
      path,
      method: 'GET'
    }, req);
  }

  public suitePost(req: Request|undefined, path: string, data?: {[key: string]: any}) {
    return this.post(req, 'suite', path, data);
  }

  public suiteGet(req: Request|undefined, path: string) {
    return this.get(req, 'suite', path);
  }

  public suiteSilentGet(req: any, path: string) {
    return this.get(req, 'suite', path);
  }
}

export default new RunHttpRequest();
