
import { Request } from 'express';
import { ExtractJwt } from 'passport-jwt';

import { UnauthorizedException } from '../error';
import HttpSuperagentRequest from '../utils/http-superagent-request';

export default class JWTUtils {
  constructor() {}

  public async validate(req: Request): Promise<void> {
    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
    if (!token) {
      throw new UnauthorizedException('auth/no-token-provided');
    }

    let user: any;
    try {
      user = await HttpSuperagentRequest.sendRequest({ product: 'suite', path: 'users/user'}, req);
    } catch (err) {
      throw new UnauthorizedException(err);
    }
    if (!user || !user.body.id) {
      throw new UnauthorizedException('auth/invalid-token');
    }
    req.user = user.body;
  }
}
