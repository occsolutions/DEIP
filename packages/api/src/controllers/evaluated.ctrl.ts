import { Response } from 'express';
import IRequest from './contracts/request';
import evaluatedServices from '../services/evaluated.srvc';

class EvaluatedController {

  async list (req: IRequest, resp: Response) {
    const { page, rowsPerPage, filter, search } = req.query as { [key: string]: any };
    try {
      const results = await evaluatedServices.getByEvaluationRefWithTotalCount(
        req.params.evaluationRef,
        filter,
        search as string,
        page as number,
        rowsPerPage as number
      );
      resp.send(results);
    } catch (error) {
      if (error._code && error._httpCode) {
        resp.status(error._httpCode).send({ code: error._code });
      } else {
        resp.send({
          msg: 'Not found',
          er: error,
          status: 404
        });
      }
    }
  }
}

export default new EvaluatedController();