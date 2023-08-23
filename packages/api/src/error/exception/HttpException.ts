
export abstract class HttpException extends Error {
  protected _httpCode: number;
  protected _code: string;
  protected _details: any;

  constructor(code: string, details?: any) {
    super();
    this._code = code;
    this._details = details;
  }

  get httpCode() {
    return this._httpCode;
  }

  get code() {
    return this._code;
  }

  get details() {
    return this._details;
  }
}
