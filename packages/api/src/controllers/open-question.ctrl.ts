
import { Request, Response } from 'express';
import { default as OpenQuestionService } from '../services/open-question.srvc';
import HttpSuperagentRequest from '../utils/http-superagent-request';
import { UnauthorizedException, BadRequestException } from '../error';


class OpenQuestionController {
  async getAll(req: Request, resp: Response) {
    try {
      resp.send(await OpenQuestionService.findAll());
    } catch (error) {
      resp.send({
        msg: 'Not found',
        status: 404
      });
    }
  }
  async editQuestion(req: Request, resp: Response) {
    try {
      resp.send(await OpenQuestionService.findOneByNameAndUpdate(req.body.data));
    } catch (error) {
      resp.send({
        msg: 'Not found',
        status: 404
      });
    }
  }
}

export default new OpenQuestionController();