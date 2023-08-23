
import * as bodyParser from 'body-parser';
import * as express from 'express';
import * as request from 'supertest';

import ValidatorFactory from '.';
import { errorHandler } from '../error';

const createApp = (router) => {
  const app = express();
  app.use(bodyParser.json());
  app.use('/', router);
  app.use(errorHandler);
  return app;
};
const validator = ValidatorFactory();

describe('validator module', () => {
  describe('validate get post and put requests', () => {
    const router = express.Router();
    router.post('/', validator({ country: 'required|min:4' }), (req, res) => res.send());
    router.put('/', validator({ country: 'required|min:4' }), (req, res) => res.send());
    router.get('/', validator({ country: 'required|min:4' }), (req, res) => res.send());
    const app = createApp(router);

    const testsBadData = [
      { method: 'post', payload: {} },
      { method: 'get',  payload: {} },
      { method: 'post', payload: {} },
    ];
    testsBadData.forEach((testData) => {
      it(`should return descriptive error for ${testData.method}`, async () => {
        const response = await request(app)[testData.method]('/').send(testData. payload);

        expect(response.status).toBe(400);
        expect(response.body).toEqual({
          code: 'validator/invalid-input',
          details: [ 'country/required' ],
        });
      });
    });

    const testGoodData = [
      { method: 'post', route: '/', payload: { country: 'spain' } },
      { method: 'get', route: '/?country=spain', payload: {} },
      { method: 'put', route: '/', payload: { country: 'spain'} },
    ];
    testGoodData.forEach((testData) => {
      it(`should allow access with valid input for ${testData.method}`, async () => {
        const response = await request(app)[testData.method](testData.route).send(testData.payload);

        expect(response.status).toBe(200);
      });
    });

    it(`should return arguments`, async () => {
      const response = await request(app).post('/').send({ country: 'a' });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('details', ['country/min:4']);
    });
  });

  describe('parameters', () => {
    const router = express.Router();
    router.get(
      '/:status',
      validator({ status: 'required|in:draft,published' }),
      (req, res) => res.send(),
    );
    const app = createApp(router);

    it(`should validate route parameters`, async () => {
      const response = await request(app).get('/other-status').send();

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('details', ['status/in:draft,published']);
    });
  });

  describe('extensions with custom validations', () => {
    const customValidations = {
      success: () => Promise.resolve(),
      error: () => Promise.reject(),
    };
    const customValidator = ValidatorFactory(customValidations);
    const router = express.Router();
    router.post('/success', customValidator({ field: 'success' }), (req, res) => res.send());
    router.post('/error', customValidator({ field: 'error' }), (req, res) => res.send());
    const app = createApp(router);

    it('should succeed with custom validator', async () => {
      const response = await request(app).post('/success').send({ field: 'anything' });
      expect(response.status).toBe(200);
    });

    it('should fail with custom validator', async () => {
      const response = await request(app).post('/error').send({ field: 'anything' });
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('details', ['field/error']);
    });
  });
});
