import {
  beforeAll,
  describe,
  expect,
  it,
} from 'vitest';
import { Express } from 'express';
import { createExpressServer } from '../../../express-server';
import request from 'supertest';
import {
  ClientError,
  Success,
} from '../../../types/response-codes';
import { MenuService } from '../../../services/menu.service';
import { omit } from 'es-toolkit';
import { MenuItem } from '../../../types/menu';

describe('Menu integration tests', () => {
  let app: Express;

  beforeAll(() => {
    app = createExpressServer();
  });

  describe('GET /api/menus/:type', () => {
    it('should return 200 with the ale menu', async () => {
      const response = await request(app)
        .get('/api/menus/ale')
        .expect(Success.OK);

      expect(response.body).toHaveProperty('data');
      expect(response.body.data).instanceOf(Array);
      expect(response.body.data).toHaveLength(MenuService.aleMenu.length);

      const responseMenuItemsWithoutId = response.body.data.map((item: MenuItem) => omit(item, [ 'id' ]));
      const aleMenuItemsWithoutId = MenuService.aleMenu.map((item: MenuItem) => omit(item, [ 'id' ]));

      aleMenuItemsWithoutId.forEach(ale => {
        expect(responseMenuItemsWithoutId).toContainEqual(ale);
      });
    });

    it('should return 200 with the wine menu', async () => {
      const response = await request(app)
        .get('/api/menus/wine')
        .expect(Success.OK);

      expect(response.body).toHaveProperty('data');
      expect(response.body.data).instanceOf(Array);
      expect(response.body.data.length).toBeGreaterThan(0);
    });

    it('should return 200 with the food menu', async () => {
      const response = await request(app)
        .get('/api/menus/food')
        .expect(Success.OK);

      expect(response.body).toHaveProperty('data');
      expect(response.body.data).instanceOf(Array);
      expect(response.body.data.length).toBeGreaterThan(0);
    });

    it('should return menu sorted by name in ascending order', async () => {
      const response = await request(app)
        .get('/api/menus/ale?sort=name&order=asc')
        .expect(Success.OK);

      expect(response.body).toHaveProperty('data');
      const items = response.body.data;
      expect(items).instanceOf(Array);
      expect(items.length).toBeGreaterThan(0);

      for (let i = 0; i < items.length - 1; i++) {
        const currentItem = items[ i ];
        const nextItem = items[ i + 1 ];
        expect(currentItem).toBeDefined();
        expect(nextItem).toBeDefined();
        if (currentItem && nextItem) {
          expect(currentItem.name <= nextItem.name).toBe(true);
        }
      }
    });

    it('should return menu sorted by name in descending order', async () => {
      const response = await request(app)
        .get('/api/menus/wine?sort=name&order=desc')
        .expect(Success.OK);

      expect(response.body).toHaveProperty('data');
      const items = response.body.data;
      expect(items).instanceOf(Array);
      expect(items.length).toBeGreaterThan(0);

      for (let i = 0; i < items.length - 1; i++) {
        const currentItem = items[ i ];
        const nextItem = items[ i + 1 ];
        expect(currentItem).toBeDefined();
        expect(nextItem).toBeDefined();
        if (currentItem && nextItem) {
          expect(currentItem.name >= nextItem.name).toBe(true);
        }
      }
    });

    it('should return menu sorted by price in ascending order', async () => {
      const response = await request(app)
        .get('/api/menus/food?sort=price&order=asc')
        .expect(Success.OK);

      expect(response.body).toHaveProperty('data');
      const items = response.body.data;
      expect(items).instanceOf(Array);
      expect(items.length).toBeGreaterThan(0);

      for (let i = 0; i < items.length - 1; i++) {
        const currentItem = items[ i ];
        const nextItem = items[ i + 1 ];
        expect(currentItem).toBeDefined();
        expect(nextItem).toBeDefined();
        if (currentItem && nextItem) {
          expect(currentItem.price).toBeLessThanOrEqual(nextItem.price);
        }
      }
    });

    it('should return menu sorted by price in descending order', async () => {
      const response = await request(app)
        .get('/api/menus/ale?sort=price&order=desc')
        .expect(Success.OK);

      expect(response.body).toHaveProperty('data');
      const items = response.body.data;
      expect(items).instanceOf(Array);
      expect(items.length).toBeGreaterThan(0);

      for (let i = 0; i < items.length - 1; i++) {
        const currentItem = items[ i ];
        const nextItem = items[ i + 1 ];
        expect(currentItem).toBeDefined();
        expect(nextItem).toBeDefined();
        if (currentItem && nextItem) {
          expect(currentItem.price).toBeGreaterThanOrEqual(nextItem.price);
        }
      }
    });

    it('should apply default sorting (price, asc) when no query params are provided', async () => {
      const response = await request(app)
        .get('/api/menus/ale')
        .expect(Success.OK);

      expect(response.body).toHaveProperty('data');
      const items = response.body.data;
      expect(items).instanceOf(Array);
      expect(items.length).toBeGreaterThan(0);

      for (let i = 0; i < items.length - 1; i++) {
        const currentItem = items[ i ];
        const nextItem = items[ i + 1 ];
        expect(currentItem).toBeDefined();
        expect(nextItem).toBeDefined();
        if (currentItem && nextItem) {
          expect(currentItem.price).toBeLessThanOrEqual(nextItem.price);
        }
      }
    });

    it('should return 400 when invalid menu type is provided', async () => {
      const response = await request(app)
        .get('/api/menus/invalid-type')
        .expect(ClientError.BAD_REQUEST);

      expect(response.body).toHaveProperty('type', 'validation_error');
      expect(response.body).toHaveProperty('error', 'Validation error');
      expect(response.body).toHaveProperty('details');
      expect(Array.isArray(response.body.details)).toBe(true);
    });

    it('should return 400 when invalid sort parameter is provided', async () => {
      const response = await request(app)
        .get('/api/menus/ale?sort=invalid')
        .expect(ClientError.BAD_REQUEST);

      expect(response.body).toHaveProperty('type', 'validation_error');
      expect(response.body).toHaveProperty('error', 'Validation error');
      expect(response.body).toHaveProperty('details');
      expect(Array.isArray(response.body.details)).toBe(true);
    });

    it('should return 400 when invalid order parameter is provided', async () => {
      const response = await request(app)
        .get('/api/menus/ale?order=invalid')
        .expect(ClientError.BAD_REQUEST);

      expect(response.body).toHaveProperty('type', 'validation_error');
      expect(response.body).toHaveProperty('error', 'Validation error');
      expect(response.body).toHaveProperty('details');
      expect(Array.isArray(response.body.details)).toBe(true);
    });

    it('should return JSON content type', async () => {
      const response = await request(app)
        .get('/api/menus/ale')
        .expect(Success.OK);

      expect(response.headers[ 'content-type' ]).toMatch(/application\/json/);
    });
  });

  describe('POST /api/menus/:type/items', () => {
    it('should return 200 and add an item to the ale menu', async () => {
      const newItem = {
        name: 'Test Ale',
        description: 'A test ale description',
        price: 5.99,
      };

      const response = await request(app)
        .post('/api/menus/ale/items')
        .send(newItem)
        .expect(Success.OK);

      expect(response.body).toHaveProperty('data');
      expect(response.body.data).instanceOf(Array);
      expect(response.body.data.length).toBeGreaterThan(MenuService.aleMenu.length);

      const addedItem = response.body.data.find((item: MenuItem) => {
        return (item.name === newItem.name &&
          item.description === newItem.description &&
          item.price === newItem.price);
      });
      expect(addedItem).toBeDefined();
      expect(addedItem).toHaveProperty('id');
    });

    it('should return 200 and add an item to the wine menu', async () => {
      const newItem = {
        name: 'Test Wine',
        description: 'A test wine description',
        price: 12.50,
      };

      const response = await request(app)
        .post('/api/menus/wine/items')
        .send(newItem)
        .expect(Success.OK);

      expect(response.body).toHaveProperty('data');
      expect(response.body.data).instanceOf(Array);

      const addedItem = response.body.data.find((item: MenuItem) => item.name === newItem.name);
      expect(addedItem).toBeDefined();
    });

    it('should return 400 when invalid menu type is provided', async () => {
      const newItem = {
        name: 'Test Item',
        description: 'A test item description',
        price: 5.99,
      };

      const response = await request(app)
        .post('/api/menus/invalid-type/items')
        .send(newItem)
        .expect(ClientError.BAD_REQUEST);

      expect(response.body).toHaveProperty('type', 'validation_error');
      expect(response.body).toHaveProperty('error', 'Validation error');
      expect(response.body).toHaveProperty('details');
      expect(Array.isArray(response.body.details)).toBe(true);
    });

    it('should return 400 when name is missing', async () => {
      const invalidItem = {
        description: 'A test description',
        price: 5.99,
      };

      const response = await request(app)
        .post('/api/menus/ale/items')
        .send(invalidItem)
        .expect(ClientError.BAD_REQUEST);

      expect(response.body).toHaveProperty('type', 'validation_error');
      expect(response.body).toHaveProperty('error', 'Validation error');
      expect(response.body).toHaveProperty('details');
      expect(Array.isArray(response.body.details)).toBe(true);
    });

    it('should return 400 when name is too short', async () => {
      const invalidItem = {
        name: 'A',
        description: 'A test description that is long enough',
        price: 5.99,
      };

      const response = await request(app)
        .post('/api/menus/ale/items')
        .send(invalidItem)
        .expect(ClientError.BAD_REQUEST);

      expect(response.body).toHaveProperty('type', 'validation_error');
      expect(response.body).toHaveProperty('error', 'Validation error');
      expect(response.body).toHaveProperty('details');
      expect(Array.isArray(response.body.details)).toBe(true);
    });

    it('should return 400 when name is too long', async () => {
      const invalidItem = {
        name: 'A'.repeat(51),
        description: 'A test description that is long enough',
        price: 5.99,
      };

      const response = await request(app)
        .post('/api/menus/ale/items')
        .send(invalidItem)
        .expect(ClientError.BAD_REQUEST);

      expect(response.body).toHaveProperty('type', 'validation_error');
      expect(response.body).toHaveProperty('error', 'Validation error');
      expect(response.body).toHaveProperty('details');
      expect(Array.isArray(response.body.details)).toBe(true);
    });

    it('should return 400 when description is missing', async () => {
      const invalidItem = {
        name: 'Test Item',
        price: 5.99,
      };

      const response = await request(app)
        .post('/api/menus/ale/items')
        .send(invalidItem)
        .expect(ClientError.BAD_REQUEST);

      expect(response.body).toHaveProperty('type', 'validation_error');
      expect(response.body).toHaveProperty('error', 'Validation error');
      expect(response.body).toHaveProperty('details');
      expect(Array.isArray(response.body.details)).toBe(true);
    });

    it('should return 400 when description is too short', async () => {
      const invalidItem = {
        name: 'Test Item',
        description: 'Too short',
        price: 5.99,
      };

      const response = await request(app)
        .post('/api/menus/ale/items')
        .send(invalidItem)
        .expect(ClientError.BAD_REQUEST);

      expect(response.body).toHaveProperty('type', 'validation_error');
      expect(response.body).toHaveProperty('error', 'Validation error');
      expect(response.body).toHaveProperty('details');
      expect(Array.isArray(response.body.details)).toBe(true);
    });

    it('should return 400 when description is too long', async () => {
      const invalidItem = {
        name: 'Test Item',
        description: 'A'.repeat(501),
        price: 5.99,
      };

      const response = await request(app)
        .post('/api/menus/ale/items')
        .send(invalidItem)
        .expect(ClientError.BAD_REQUEST);

      expect(response.body).toHaveProperty('type', 'validation_error');
      expect(response.body).toHaveProperty('error', 'Validation error');
      expect(response.body).toHaveProperty('details');
      expect(Array.isArray(response.body.details)).toBe(true);
    });

    it('should return 400 when price is missing', async () => {
      const invalidItem = {
        name: 'Test Item',
        description: 'A test description that is long enough',
      };

      const response = await request(app)
        .post('/api/menus/ale/items')
        .send(invalidItem)
        .expect(ClientError.BAD_REQUEST);

      expect(response.body).toHaveProperty('type', 'validation_error');
      expect(response.body).toHaveProperty('error', 'Validation error');
      expect(response.body).toHaveProperty('details');
      expect(Array.isArray(response.body.details)).toBe(true);
    });

    it('should return 400 when price is negative', async () => {
      const invalidItem = {
        name: 'Test Item',
        description: 'A test description that is long enough',
        price: -1,
      };

      const response = await request(app)
        .post('/api/menus/ale/items')
        .send(invalidItem)
        .expect(ClientError.BAD_REQUEST);

      expect(response.body).toHaveProperty('type', 'validation_error');
      expect(response.body).toHaveProperty('error', 'Validation error');
      expect(response.body).toHaveProperty('details');
      expect(Array.isArray(response.body.details)).toBe(true);
    });

    it('should return 400 when price is not a number', async () => {
      const invalidItem = {
        name: 'Test Item',
        description: 'A test description that is long enough',
        price: 'not-a-number',
      };

      const response = await request(app)
        .post('/api/menus/ale/items')
        .send(invalidItem)
        .expect(ClientError.BAD_REQUEST);

      expect(response.body).toHaveProperty('type', 'validation_error');
      expect(response.body).toHaveProperty('error', 'Validation error');
      expect(response.body).toHaveProperty('details');
      expect(Array.isArray(response.body.details)).toBe(true);
    });

    it('should return JSON content type', async () => {
      const newItem = {
        name: 'Test Item',
        description: 'A test description that is long enough',
        price: 5.99,
      };

      const response = await request(app)
        .post('/api/menus/ale/items')
        .send(newItem)
        .expect(Success.OK);

      expect(response.headers[ 'content-type' ]).toMatch(/application\/json/);
    });
  });

  describe('DELETE /api/menus/:type/:id', () => {
    it('should return 204 when successfully deleting an item', async () => {
      const menu = MenuService.aleMenu;
      const itemToDelete = menu[ 0 ];

      if (!itemToDelete) {
        throw new Error('No items in ale menu to delete');
      }

      await request(app)
        .delete(`/api/menus/ale/${ itemToDelete.id }`)
        .expect(Success.NO_CONTENT);
    });

    it('should return 404 when trying to delete a non-existent item', async () => {
      const nonExistentId = '00000000-0000-4000-8000-000000000000';

      const response = await request(app)
        .delete(`/api/menus/ale/${ nonExistentId }`)
        .expect(ClientError.NOT_FOUND);

      expect(response.body).toHaveProperty('type', 'missing_resource');
      expect(response.body).toHaveProperty('error');
      expect(response.body).toHaveProperty('details', null);
    });

    it('should return 400 when invalid menu type is provided', async () => {
      const someId = '00000000-0000-4000-8000-000000000000';

      const response = await request(app)
        .delete(`/api/menus/invalid-type/${ someId }`)
        .expect(ClientError.BAD_REQUEST);

      expect(response.body).toHaveProperty('type', 'validation_error');
      expect(response.body).toHaveProperty('error', 'Validation error');
      expect(response.body).toHaveProperty('details');
      expect(Array.isArray(response.body.details)).toBe(true);
    });

    it('should return 400 when invalid UUID format is provided', async () => {
      const response = await request(app)
        .delete('/api/menus/ale/not-a-uuid')
        .expect(ClientError.BAD_REQUEST);

      expect(response.body).toHaveProperty('type', 'validation_error');
      expect(response.body).toHaveProperty('error', 'Validation error');
      expect(response.body).toHaveProperty('details');
      expect(Array.isArray(response.body.details)).toBe(true);
    });

    it('should return 404 when id parameter is missing', async () => {
      const response = await request(app)
        .delete('/api/menus/ale/')
        .expect(ClientError.NOT_FOUND);

      expect(response.body).toHaveProperty('type', 'missing_route');
      expect(response.body).toHaveProperty('error', 'Route not found');
      expect(response.body).toHaveProperty('details', null);
    });
  });
});
