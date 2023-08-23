
import { HttpException } from './HttpException';

export class ConflictException extends HttpException {
  protected _httpCode = 409;
}
