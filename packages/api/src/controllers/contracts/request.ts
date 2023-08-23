
import { Request } from 'express';

interface IParamsDictionary {
  [key: string]: any;
}

export default interface IRequest extends Request {
  params: IParamsDictionary;
  user: any;
  file: any;
}
