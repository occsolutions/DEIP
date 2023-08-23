
import JWTUtils from './jwt-utils';
import jwt from './middlewares/jwt';

export default () => {
  const jwtUtils = new JWTUtils();
  const middlewares = {
    jwt: jwt(jwtUtils)
  };

  return middlewares;
};
