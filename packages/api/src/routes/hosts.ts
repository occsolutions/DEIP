import { Router } from 'express';
import HostController from './../controllers/host.ctrl';


export default () => {
  const HostRouter = Router();

  HostRouter.get(
    '/',
    HostController.getAll
  );

  HostRouter.get(
    '/one/:product',
    HostController.getOne
  );

  return HostRouter;
};
