
import { HttpException } from './HttpException';

export class ForbiddenException extends HttpException {
  protected _httpCode = 403;
}
