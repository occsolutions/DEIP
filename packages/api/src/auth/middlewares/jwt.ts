
import { NextFunction, Request, Response } from 'express';

import { catchAsyncError } from '../../error';
import JWTUtils from '../jwt-utils';

export default (jwt: JWTUtils) => {
  return catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    await jwt.validate(req);
    next();
  });
};
