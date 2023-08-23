
import { Request } from 'express';

import ProductServiceService from '../services/product-service.srvc';

import RunHttpRequest from './run-http-request';

export default async (req: Request, product: string, qty: number, operations?: Array<number>) => {
  const productService = await ProductServiceService.findByName(product);
  const spend = await RunHttpRequest.suitePost(req, 'token-account-detail/spend', {
    serviceCode: productService.code,
    qty,
    ...(operations ? { operations } : {})
  });

  if (!spend.success) {
    return spend.error ?
      Promise.reject(`suite-spend-fail/${spend.error.msg}/${spend.error.status}`) :
      Promise.reject('suite-spend-fail');
  }
  return spend.res;
};
