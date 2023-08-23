import { Request, Response } from 'express';
import { default as HostService } from '../services/host.srvc';
import { NotFoundException } from '../error';

class HostController {
  async getAll(req: Request, resp: Response) {
    try {
      const hosts = await HostService.findAll();
      resp.status(200).send(hosts);
    } catch (error) {
      resp.send({
        msg: 'Not found',
        status: 404
      });
    }
  }
  async getOne(req: Request, resp: Response) {
    try {
      const host = await HostService.findByProductName(req.params.product);
      if (!host) {
        throw new NotFoundException('404', 'Host not found');
      }
      resp.status(200).send(host);
    } catch (error) {
      resp.status(404).send({
        msg: 'Not found',
        status: 404,
        error
      });
    }
  }
}

export default new HostController();