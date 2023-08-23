
import { Router } from 'express';
import AuthRouterFactory from './auth';
import DashboardRouterFactory from './dashboard';
import EvaluationsRouterFactory from './evaluations';
import HostsRouterFactory from './hosts';
import ProductServiceRouterFactory from './product-services';
import QuestionnairesRouterfactory from './questionnaires';
import OpenQuestionsRouterfactory from './open-question';
import EvaluatedRouterFactory from './evaluated';
import FollowUpsRouterFactory from './follow-ups';


export default (middlewares, services) => {
  const router = Router();

  router.use('/auth', AuthRouterFactory(middlewares));
  router.use('/dashboard', DashboardRouterFactory(middlewares));
  router.use('/evaluations', EvaluationsRouterFactory(middlewares, services));
  router.use('/hosts', HostsRouterFactory());
  router.use(middlewares.jwt);
  router.use('/product-services', ProductServiceRouterFactory());
  router.use('/questionnaires', QuestionnairesRouterfactory());
  router.use('/open-questions', OpenQuestionsRouterfactory());
  router.use('/evaluated', EvaluatedRouterFactory(middlewares));
  router.use('/follow-ups', FollowUpsRouterFactory());

  return router;
};
