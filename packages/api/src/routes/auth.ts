
import { Router } from 'express';
import AuthController from './../controllers/auth.ctrl';
import { catchAsyncError } from '../error';

export default (middlewares) => {
  const AuthRouter = Router();

  AuthRouter.post(
    '/sign-out',
    AuthController.logOut
  );

  AuthRouter.get(
    '/sso',
    catchAsyncError(AuthController.sso)
  );

  AuthRouter.use(middlewares.jwt);

  AuthRouter.get(
    '/validate',
    AuthController.sso
  );

  return AuthRouter;
};
