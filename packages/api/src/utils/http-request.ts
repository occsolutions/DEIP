
import { Request, Response } from 'express';
import { default as HostService } from '../services/host.srvc';

interface IHttpRequest {
  product: string;
  path: string;
  method: string;
  data?: any;
}

class HttpRequest {
  public async sendRequest(request: IHttpRequest, req: Request, res: Response) {
    const host = await HostService.findByProductName(request.product);
    const http = require('http');
    let dataString: string;
    let contentType = 'application/x-www-form-urlencoded';
    if (request.method === 'POST' && request.data) {
      dataString = JSON.stringify(request.data);
      contentType = 'application/json';
    }

    if (host && host.serverUrl) {
      const options = {
        hostname: host.serverUrl,
        port: host.serverPort,
        path: request.path,
        method: request.method,
        headers: {
          'Content-Type': contentType,
          'Content-Length': dataString.length,
          'Authorization': req.headers.authorization
        }
      };

      const callBackToPromise = (options, data = undefined) => {
        return new Promise((resolve, reject) => {
          const reqH = http.request(options, (res) => {
            res.setEncoding('utf8');
            res.on('data', (chunk) => resolve(chunk));
            res.on('error', (err) => reject(err));
            res.on('end', () => resolve());
          });
          if (data) {
            reqH.write(data);
          }
          reqH.end();
        });
      };

      if (request.method === 'POST') {
        return await callBackToPromise(options, dataString);
      } else {
        return await callBackToPromise(options);
      }
    } else {
      res.send('auth/suite-not-found');
    }
  }
}

export default new HttpRequest();
