
import { Request, Response } from 'express';

import { UnauthorizedException } from '../error';
import HttpSuperagentRequest from '../utils/http-superagent-request';


class AuthController {

  async sso(req: Request, res: Response) {
    let response: any;
    try {
      response = await HttpSuperagentRequest.sendRequest({ product: 'suite', path: 'users/sso'}, req);
    } catch (err) {
      throw new UnauthorizedException(err);
    }

    if (response.status !== 200) {
      throw new UnauthorizedException('auth/invalid-token');
    }
    const user = response.body;
    if (!user || !user.id) {
      throw new UnauthorizedException('auth/invalid-token');
    }
    res.send(user);
  }

  async logOut(req: Request, res: Response) {
    await HttpSuperagentRequest.sendRequest({ product: 'suite', path: 'auth/sign-out', method: 'POST'}, req);
    res.send();
  }

  async validate(req: Request, res: Response) {
    res.send(req.user);
  }
}

export default new AuthController();