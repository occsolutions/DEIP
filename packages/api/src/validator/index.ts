
import { NextFunction, Request, Response } from 'express';
import * as validations from 'indicative/builds/validations';
import * as Validator from 'indicative/builds/validator';

import { BadRequestException, catchAsyncError } from '../error';
import Formatter from './formatter';

export default (customValidations?: { [key: string]: (...args) => any }) => {
  const validator = Validator({...validations, ...customValidations}, Formatter);

  return (rules: { [key: string]: string}) => {
    return catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
      try {
        const data = {...req.query, ...req.body, ...req.params};
        await validator.validateAll(data, rules);
        next();
      } catch (errors) {
        const details = errors.map((error) => {
          const args = error.args.join(',');
          return `${error.field}/${error.validation}` + (args ? `:${args}` : '');
        });
        throw new BadRequestException('validator/invalid-input', details);
      }
    });
  };
};
