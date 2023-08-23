
import { HttpException } from './HttpException';

export class NotFoundException extends HttpException {
  protected _httpCode = 404;
}
