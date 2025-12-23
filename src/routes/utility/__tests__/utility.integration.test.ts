import {
  describe,
  it,
  expect,
  beforeAll,
} from 'vitest';
import request from 'supertest';
import { Express } from 'express';
import { createExpressServer } from '../../../express-server.js';
import { Success } from '../../../types/response-codes.js';

describe('Utility integration tests', () => {
  let app: Express;

  beforeAll(() => {
    app = createExpressServer();
  });

  describe('GET /api/ping', () => {
    it('should return 200 with ping response', async () => {
      const response = await request(app)
        .get('/api/ping')
        .expect(Success.OK);

      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('dateTime');
      expect(response.body.data).toHaveProperty('status');
    });

    it('should return current timestamp as unix integer', async () => {
      const beforeRequest = Math.floor(Date.now() / 1000);

      const response = await request(app)
        .get('/api/ping')
        .expect(Success.OK);

      const afterRequest = Math.floor(Date.now() / 1000);

      expect(response.body.data.dateTime).toBeGreaterThanOrEqual(beforeRequest);
      expect(response.body.data.dateTime).toBeLessThanOrEqual(afterRequest);
      expect(typeof response.body.data.dateTime).toBe('number');
    });

    it('should return status OK', async () => {
      const response = await request(app)
        .get('/api/ping')
        .expect(Success.OK);

      expect(response.body.data.status).toBe('OK');
    });
  });

  describe('POST /api/echo', () => {
    it('should return 200 and echo the text', async () => {
      const testText = 'Hello, World!';

      const response = await request(app)
        .post('/api/echo')
        .send({ text: testText })
        .expect(Success.OK);

      expect(response.body).toHaveProperty('echo');
      expect(response.body.echo).toBe(testText);
    });

    it('should echo different text values', async () => {
      const testCases = [
        'a',
        'Short text',
        'A longer text string with multiple words',
        '12345',
        'Special chars: !@#$%',
      ];

      for (const testText of testCases) {
        const response = await request(app)
          .post('/api/echo')
          .send({ text: testText })
          .expect(Success.OK);

        expect(response.body.echo).toBe(testText);
      }
    });

    it('should return 400 for missing text field', async () => {
      const response = await request(app)
        .post('/api/echo')
        .send({})
        .expect(400);

      expect(response.body).toHaveProperty('type', 'validation_error');
      expect(response.body).toHaveProperty('error', 'Validation error');
      expect(response.body).toHaveProperty('details');
      expect(Array.isArray(response.body.details)).toBe(true);
    });

    it('should return 400 for empty text', async () => {
      const response = await request(app)
        .post('/api/echo')
        .send({ text: '' })
        .expect(400);

      expect(response.body).toHaveProperty('type', 'validation_error');
      expect(response.body).toHaveProperty('error', 'Validation error');
      expect(response.body).toHaveProperty('details');
      expect(response.body.details).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            path: expect.arrayContaining(['text']),
          }),
        ]),
      );
    });

    it('should return 400 for text exceeding 50 characters', async () => {
      const longText = 'a'.repeat(51);

      const response = await request(app)
        .post('/api/echo')
        .send({ text: longText })
        .expect(400);

      expect(response.body).toHaveProperty('type', 'validation_error');
      expect(response.body).toHaveProperty('error', 'Validation error');
      expect(response.body).toHaveProperty('details');
      expect(response.body.details).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            path: expect.arrayContaining(['text']),
          }),
        ]),
      );
    });

    it('should accept text at the maximum length of 50 characters', async () => {
      const maxLengthText = 'a'.repeat(50);

      const response = await request(app)
        .post('/api/echo')
        .send({ text: maxLengthText })
        .expect(Success.OK);

      expect(response.body.echo).toBe(maxLengthText);
    });

    it('should return 400 for invalid content type', async () => {
      const response = await request(app)
        .post('/api/echo')
        .send('not json')
        .set('Content-Type', 'text/plain')
        .expect(400);

      // Express will fail to parse non-JSON body
      expect(response.body).toBeDefined();
    });

    it('should return 400 for non-string text value', async () => {
      const response = await request(app)
        .post('/api/echo')
        .send({ text: 12345 })
        .expect(400);

      expect(response.body).toHaveProperty('type', 'validation_error');
      expect(response.body).toHaveProperty('error', 'Validation error');
      expect(response.body).toHaveProperty('details');
      expect(Array.isArray(response.body.details)).toBe(true);
    });
  });
});
