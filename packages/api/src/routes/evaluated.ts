
import { Router } from 'express';
import EvaluatedController from './../controllers/evaluated.ctrl';


export default (middlewares) => {

  const EvaluatedRouter = Router();

  EvaluatedRouter.use(middlewares.jwt);

  EvaluatedRouter.get(
    '/list/:evaluationRef',
    EvaluatedController.list
  );

  return EvaluatedRouter;
};
