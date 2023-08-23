
import { Router } from 'express';
import DashboardController from '../controllers/dashboard.ctrl';

export default (middlewares) => {

  const DashboardRouter = Router();

  DashboardRouter.post(
    '/get-employee-info',
    DashboardController.getEmployeeInfo
  );

  DashboardRouter.use(middlewares.jwt);

  DashboardRouter.get(
    '/get-info',
    DashboardController.getAdminInfo
  );

  DashboardRouter.get(
    '/get-enterprise-info',
    DashboardController.getEnterpriseInfo
  );

  return DashboardRouter;
};
