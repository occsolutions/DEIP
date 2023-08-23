
import { HttpException } from './HttpException';

export class BadRequestException extends HttpException {
  protected _httpCode = 400;
}
