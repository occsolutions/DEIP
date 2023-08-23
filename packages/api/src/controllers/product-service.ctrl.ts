import { Request, Response } from 'express';
import { default as ProductServiceService } from '../services/product-service.srvc';
import HttpSuperagentRequest from '../utils/http-superagent-request';
import { UnauthorizedException } from '../error';


class ProductServiceController {
  async getAll(req: Request, resp: Response) {
    try {
      const productServices = await ProductServiceService.findAll();
      resp.status(200).send(productServices);
    } catch (error) {
      resp.send({
        msg: 'Not found',
        status: 404
      });
    }
  }
  async getOne(req: Request, resp: Response) {
    try {
      const productService = await ProductServiceService.findByName(req.params.name);
      resp.status(200).send(productService);
    } catch (error) {
      resp.send({
        msg: 'Not found',
        status: 404
      });
    }
  }
  async getDemograficReportPrice(req: Request, res: Response) {

    const productService = await ProductServiceService.findByName('REPORTE ORGANIZACIONAL OCC DML 360°');
    const idProductService = productService.productServiceId;
    let resProductService: any;
    try {
      resProductService = await HttpSuperagentRequest.sendRequest({
        product: 'suite',
        path: `product-services/${idProductService}`,
        method: 'GET',
      }, req);
    } catch (error) {
     resProductService = { status: 401, error };
     // throw new BadRequestException('product-service/error-response');
    }
    if (!(resProductService && resProductService.status) || resProductService.status !== 200) {
      res.send({
        msg: 'fail',
        status: 401
      });
      throw new UnauthorizedException('generateTemplate/employee-list');
    }
    res.send(resProductService.body);
  }
}

export default new ProductServiceController();