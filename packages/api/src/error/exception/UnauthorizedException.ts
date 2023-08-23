
import { HttpException } from './HttpException';

export class UnauthorizedException extends HttpException {
  protected _httpCode = 401;
}
