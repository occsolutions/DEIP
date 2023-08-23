
import { Router } from 'express';
import ProductServiceController from './../controllers/product-service.ctrl';


export default () => {
  const ProductServiceRouter = Router();
  ProductServiceRouter.get('/list', ProductServiceController.getAll);
  ProductServiceRouter.get('/find-by-name/:name', ProductServiceController.getOne);
  ProductServiceRouter.get('/demografic-price-report', ProductServiceController.getDemograficReportPrice);

  return ProductServiceRouter;
};
