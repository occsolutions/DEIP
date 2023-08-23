
import { BadRequestException } from './exception/BadRequestException';
import { ConflictException } from './exception/ConflictException';
import { ForbiddenException } from './exception/ForbiddenException';
import { HttpException } from './exception/HttpException';
import { NotFoundException } from './exception/NotFoundException';
import { UnauthorizedException } from './exception/UnauthorizedException';

const errorHandler = (err, req, res, next) => {
  if (err instanceof HttpException) {
    res.status(err.httpCode);
    if (err.httpCode === 401) {
      return res.send(err);
    }
    return res.send({ code: err.code, details: err.details });
  }
  next(err);
};

const catchAsyncError = (handler) => {
  return (req, res, next) => {
    const routePromise = handler(req, res, next);
    if (routePromise.catch) {
      routePromise.catch((err) => next(err));
    }
  };
};

export {
  catchAsyncError,
  errorHandler,
  BadRequestException,
  ConflictException,
  ForbiddenException,
  NotFoundException,
  UnauthorizedException,
};
