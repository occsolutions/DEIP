
import { Request } from 'express';
import { default as HostService } from '../services/host.srvc';
import { ExtractJwt } from 'passport-jwt';
import { UnauthorizedException } from '../error';
import * as superagent from 'superagent';


interface IHttpRequest {
  product: string;
  path?: string;
  method?: string;
  data?: any;
}

class HttpRequest {
  public async sendRequest(request: IHttpRequest | string, req?: Request) {
    const options: IHttpRequest =  typeof request === 'string' ? {
      product : request,
    } : request;
    const host = await HostService.findByProductName(options.product);
    let token;
    if (req) {
      token = req.user && req.user['token']
        ? req.user['token']
        : ExtractJwt.fromAuthHeaderAsBearerToken()(req);
    } else if (host.token) {
      token = host.token;
    }
    if (host && host.serverUrl) {
      const endOptions = {
        hostname: host.serverUrl,
        port: host.serverPort,
        path: options.path || '',
        data: options.data || {},
        token,
        method: options.method || 'GET'
      };
      const callBackToPromise = (options) => {
        return options.method === 'POST' ?
          superagent
            .post(this.urlParse(options.hostname, options.port, options.path))
            .set('Content-Type', 'application/json')
            .accept('application/json')
            .send(JSON.stringify(options.data))
            .auth(options.token, { type: 'bearer' }) :
          superagent
            .get(this.urlParse(options.hostname, options.port, options.path))
            .query(options.data)
            .auth(options.token, { type: 'bearer' });
      };

      // Sixto Ortega 09/07/2020 17:45
      // Revisar esta sentencia por que se captura este error aca? En dado caso que diera error ese error debe ser capturado en el metodo donde se realiza el llamado Ojo con eso mejorar
      // Asi deberia de ser
      // return await callBackToPromise(endOptions)

      return await callBackToPromise(endOptions)
        .catch(err => {
          console.log('*Superagent Error:', err);
          throw err;
        });
    } else {
      throw new UnauthorizedException(`api/${options.product}-not-found`);
    }
  }

  public urlParse(hostname: string, port: number, path: string) {
    // const host = hostname.indexOf('http://') !== -1 || hostname.indexOf('https://') !== -1 ? hostname : '';
    const hostPort = hostname && hostname.indexOf('https://') === -1 ? (port === 80 ? hostname : `${hostname}:${port}`) : hostname;
    return `${hostPort}/${path || ''}`;
  }
}

export default new HttpRequest();
