import {
  describe,
  expect,
  it,
} from 'vitest';
import { MenuService } from '../menu.service';
import {
  MenuSort,
  MenuType,
} from '../../types/menu';
import { SortOrder } from '../../types/common';

describe('menu service', () => {
  describe('getMenu', () => {
    it('should return the ale menu for MenuType.ALE', () => {
      const result = MenuService.getMenu(MenuType.ALE);
      expect(result).toEqual(MenuService.aleMenu);
      expect(result.length).toBe(3);
    });

    it('should return the wine menu for MenuType.WINE', () => {
      const result = MenuService.getMenu(MenuType.WINE);
      expect(result).toEqual(MenuService.wineMenu);
      expect(result.length).toBe(3);
    });

    it('should return the food menu for MenuType.FOOD', () => {
      const result = MenuService.getMenu(MenuType.FOOD);
      expect(result).toEqual(MenuService.foodMenu);
      expect(result.length).toBe(3);
    });

    it('should return a menu with valid menu item structure', () => {
      const menu = MenuService.getMenu(MenuType.ALE);
      const firstItem = menu[ 0 ];
      const properties = firstItem && Object.keys(firstItem) || [];

      expect(firstItem).toBeDefined();
      expect(properties).toEqual(expect.arrayContaining([ 'id', 'name', 'description', 'price' ]));
    });

    it('should throw an error for invalid menu type', () => {
      const invalidMenuType = 'INVALID' as MenuType;

      expect(() => MenuService.getMenu(invalidMenuType)).toThrow();
    });

    it('should throw an ApiError with 404 status code for invalid menu type', () => {
      const invalidMenuType = 'DESSERT' as MenuType;

      try {
        MenuService.getMenu(invalidMenuType);
        expect.fail('Expected function to throw an error');
      } catch (error) {
        expect(error).toBeDefined();
        expect(error).toHaveProperty('statusCode', 404);
        expect(error).toHaveProperty('message', 'Menu type DESSERT does not exist');
      }
    });

  });

  describe('retrieve', () => {
    it('should return menu sorted by name in ascending order', () => {
      const result = MenuService.retrieve(MenuType.ALE, MenuSort.NAME, SortOrder.ASC);
      const originalMenu = MenuService.getMenu(MenuType.ALE);

      expect(result).toHaveLength(originalMenu.length);

      // Verify ascending order by checking each item is <= next item
      for (let i = 0; i < result.length - 1; i++) {
        const currentItem = result[ i ];
        const nextItem = result[ i + 1 ];
        expect(currentItem).toBeDefined();
        expect(nextItem).toBeDefined();
        if (currentItem && nextItem) {
          expect(currentItem.name <= nextItem.name).toBe(true);
        }
      }
    });

    it('should return menu sorted by name in descending order', () => {
      const result = MenuService.retrieve(MenuType.ALE, MenuSort.NAME, SortOrder.DESC);
      const originalMenu = MenuService.getMenu(MenuType.ALE);

      expect(result).toHaveLength(originalMenu.length);

      // Verify descending order by checking each item is >= next item
      for (let i = 0; i < result.length - 1; i++) {
        const currentItem = result[ i ];
        const nextItem = result[ i + 1 ];
        expect(currentItem).toBeDefined();
        expect(nextItem).toBeDefined();
        if (currentItem && nextItem) {
          expect(currentItem.name >= nextItem.name).toBe(true);
        }
      }
    });

    it('should return menu sorted by price in ascending order', () => {
      const result = MenuService.retrieve(MenuType.WINE, MenuSort.PRICE, SortOrder.ASC);
      const originalMenu = MenuService.getMenu(MenuType.WINE);

      expect(result).toHaveLength(originalMenu.length);

      // Verify ascending order by checking each price is <= next price
      for (let i = 0; i < result.length - 1; i++) {
        const currentItem = result[ i ];
        const nextItem = result[ i + 1 ];
        expect(currentItem).toBeDefined();
        expect(nextItem).toBeDefined();
        if (currentItem && nextItem) {
          expect(currentItem.price).toBeLessThanOrEqual(nextItem.price);
        }
      }
    });

    it('should return menu sorted by price in descending order', () => {
      const result = MenuService.retrieve(MenuType.FOOD, MenuSort.PRICE, SortOrder.DESC);
      const originalMenu = MenuService.getMenu(MenuType.FOOD);

      expect(result).toHaveLength(originalMenu.length);

      // Verify descending order by checking each price is >= next price
      for (let i = 0; i < result.length - 1; i++) {
        const currentItem = result[ i ];
        const nextItem = result[ i + 1 ];
        expect(currentItem).toBeDefined();
        expect(nextItem).toBeDefined();
        if (currentItem && nextItem) {
          expect(currentItem.price).toBeGreaterThanOrEqual(nextItem.price);
        }
      }
    });

    it('should return all menu items from original menu', () => {
      const originalMenu = MenuService.getMenu(MenuType.WINE);
      const result = MenuService.retrieve(MenuType.WINE, MenuSort.NAME, SortOrder.ASC);

      expect(result).toHaveLength(originalMenu.length);

      // Verify all original items are present in sorted result
      const originalIds = originalMenu.map(item => item.id).sort();
      const resultIds = result.map(item => item.id).sort();
      expect(resultIds).toEqual(originalIds);
    });

    it('should return a menu with valid menu item structure', () => {
      const menu = MenuService.retrieve(MenuType.ALE, MenuSort.NAME, SortOrder.ASC);
      const firstItem = menu[ 0 ];
      const properties = firstItem && Object.keys(firstItem) || [];

      expect(firstItem).toBeDefined();
      expect(properties).toEqual(expect.arrayContaining([ 'id', 'name', 'description', 'price' ]));
    });

    it('should throw an error for invalid menu type', () => {
      const invalidMenuType = 'INVALID' as MenuType;

      expect(() => MenuService.retrieve(invalidMenuType, MenuSort.NAME, SortOrder.ASC)).toThrow();
    });

    it('should throw an ApiError with 404 status code for invalid menu type', () => {
      const invalidMenuType = 'DESSERT' as MenuType;

      try {
        MenuService.retrieve(invalidMenuType, MenuSort.PRICE, SortOrder.DESC);
        expect.fail('Expected function to throw an error');
      } catch (error) {
        expect(error).toBeDefined();
        expect(error).toHaveProperty('statusCode', 404);
        expect(error).toHaveProperty('message', 'Menu type DESSERT does not exist');
      }
    });

  });

  describe('add', () => {
    it('should add an item to the ale menu', () => {
      const originalMenu = MenuService.getMenu(MenuType.ALE);
      const originalLength = originalMenu.length;
      const newItem = {
        name: 'Saxon Hoard',
        description: 'A crisp golden ale',
        price: 1.1,
      };

      const result = MenuService.add(MenuType.ALE, newItem);

      expect(result).toHaveLength(originalLength + 1);
      expect(result[ result.length - 1 ]).toMatchObject(newItem);
    });

    it('should add an item to the wine menu', () => {
      const originalMenu = MenuService.getMenu(MenuType.WINE);
      const originalLength = originalMenu.length;
      const newItem = {
        name: 'Red Mist',
        description: 'A delicate rosé wine',
        price: 2.3,
      };

      const result = MenuService.add(MenuType.WINE, newItem);

      expect(result).toHaveLength(originalLength + 1);
      expect(result[ result.length - 1 ]).toMatchObject(newItem);
    });

    it('should add an item to the food menu', () => {
      const originalMenu = MenuService.getMenu(MenuType.FOOD);
      const originalLength = originalMenu.length;
      const newItem = {
        name: 'Fish and Chips',
        description: 'Beer-battered fish with crispy chips',
        price: 1.8,
      };

      const result = MenuService.add(MenuType.FOOD, newItem);

      expect(result).toHaveLength(originalLength + 1);
      expect(result[ result.length - 1 ]).toMatchObject(newItem);
    });

    it('should generate a UUID for the new item', () => {
      const newItem = {
        name: 'Test Item',
        description: 'A test item',
        price: 1.0,
      };

      const result = MenuService.add(MenuType.ALE, newItem);
      const addedItem = result[ result.length - 1 ];

      expect(addedItem).toBeDefined();
      if (addedItem) {
        expect(addedItem.id).toBeDefined();
        expect(typeof addedItem.id).toBe('string');
        // UUID v4 format: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
        expect(addedItem.id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
      }
    });

    it('should preserve all properties of the added item', () => {
      const newItem = {
        name: 'Premium Ale',
        description: 'An expensive premium ale',
        price: 3.5,
      };

      const result = MenuService.add(MenuType.ALE, newItem);
      const addedItem = result[ result.length - 1 ];

      expect(addedItem).toBeDefined();
      if (addedItem) {
        expect(addedItem.name).toBe(newItem.name);
        expect(addedItem.description).toBe(newItem.description);
        expect(addedItem.price).toBe(newItem.price);
      }
    });

    it('should update the menu mapping so subsequent retrieve calls return the expanded menu', () => {
      const originalMenu = MenuService.getMenu(MenuType.WINE);
      const originalLength = originalMenu.length;
      const newItem = {
        name: 'Chardonnay Reserve',
        description: 'Aged oak Chardonnay',
        price: 3.2,
      };

      const addResult = MenuService.add(MenuType.WINE, newItem);
      const chardonnay = addResult
        .find((item) => item.name === newItem.name);

      const retrievedMenu = MenuService.retrieve(MenuType.WINE);
      expect(retrievedMenu).toHaveLength(originalLength + 1);
      expect(retrievedMenu).toContain(chardonnay);
    });

    it('should return an array with valid menu item structure', () => {
      const newItem = {
        name: 'Lembas Bread',
        description: 'Just one small bite is enough to fill your stomach',
        price: 2.0,
      };

      const result = MenuService.add(MenuType.FOOD, newItem);
      const addedItem = result[ result.length - 1 ];
      const properties = addedItem && Object.keys(addedItem) || [];

      expect(addedItem).toBeDefined();
      expect(properties).toEqual(expect.arrayContaining([ 'id', 'name', 'description', 'price' ]));
    });

    it('should throw an error for invalid menu type', () => {
      const invalidMenuType = 'INVALID' as MenuType;
      const newItem = {
        name: 'Test Item',
        description: 'A test item',
        price: 1.0,
      };

      expect(() => MenuService.add(invalidMenuType, newItem)).toThrow();
    });

    it('should throw an ApiError with 404 status code for invalid menu type', () => {
      const invalidMenuType = 'DESSERT' as MenuType;
      const newItem = {
        name: 'Chocolate Cake',
        description: 'A rich chocolate cake',
        price: 2.5,
      };

      try {
        MenuService.add(invalidMenuType, newItem);
        expect.fail('Expected function to throw an error');
      } catch (error) {
        expect(error).toBeDefined();
        expect(error).toHaveProperty('statusCode', 404);
        expect(error).toHaveProperty('message', 'Menu type DESSERT does not exist');
      }
    });
  });

  describe('remove', () => {
    it('should remove an item from the ale menu', () => {
      const originalMenu = MenuService.getMenu(MenuType.ALE);
      const originalLength = originalMenu.length;
      const itemToRemove = originalMenu[ 0 ];

      expect(itemToRemove).toBeDefined();
      if (itemToRemove) {
        const result = MenuService.remove(MenuType.ALE, itemToRemove.id);

        expect(result).toBe(true);

        const updatedMenu = MenuService.retrieve(MenuType.ALE);
        expect(updatedMenu).toHaveLength(originalLength - 1);
      }
    });

    it('should remove an item from the wine menu', () => {
      const originalMenu = MenuService.getMenu(MenuType.WINE);
      const originalLength = originalMenu.length;
      const itemToRemove = originalMenu[ 1 ];

      expect(itemToRemove).toBeDefined();
      if (itemToRemove) {
        const result = MenuService.remove(MenuType.WINE, itemToRemove.id);

        expect(result).toBe(true);

        const updatedMenu = MenuService.retrieve(MenuType.WINE);
        expect(updatedMenu).toHaveLength(originalLength - 1);
      }
    });

    it('should remove an item from the food menu', () => {
      const originalMenu = MenuService.getMenu(MenuType.FOOD);
      const originalLength = originalMenu.length;
      const itemToRemove = originalMenu[ 2 ];

      expect(itemToRemove).toBeDefined();
      if (itemToRemove) {
        const result = MenuService.remove(MenuType.FOOD, itemToRemove.id);

        expect(result).toBe(true);

        const updatedMenu = MenuService.retrieve(MenuType.FOOD);
        expect(updatedMenu).toHaveLength(originalLength - 1);
      }
    });

    it('should remove the correct item from the menu', () => {
      const originalMenu = MenuService.getMenu(MenuType.ALE);
      const itemToRemove = originalMenu[ 1 ];

      expect(itemToRemove).toBeDefined();
      if (itemToRemove) {
        MenuService.remove(MenuType.ALE, itemToRemove.id);

        const updatedMenu = MenuService.retrieve(MenuType.ALE);
        const removedItemStillExists = updatedMenu.some(item => item.id === itemToRemove.id);

        expect(removedItemStillExists).toBe(false);
      }
    });

    it('should update the menu mapping so subsequent retrieve calls return the reduced menu', () => {
      const originalMenu = MenuService.getMenu(MenuType.FOOD);
      const originalLength = originalMenu.length;
      const itemToRemove = originalMenu[ 0 ];

      expect(itemToRemove).toBeDefined();
      if (itemToRemove) {
        MenuService.remove(MenuType.FOOD, itemToRemove.id);

        const retrievedMenu = MenuService.retrieve(MenuType.FOOD);
        expect(retrievedMenu).toHaveLength(originalLength - 1);

        // Verify the removed item is not in the retrieved menu
        const removedItemExists = retrievedMenu.some(item => item.id === itemToRemove.id);
        expect(removedItemExists).toBe(false);
      }
    });

    it('should return true when item is successfully removed', () => {
      const menu = MenuService.getMenu(MenuType.ALE);
      const itemToRemove = menu[ 0 ];

      expect(itemToRemove).toBeDefined();
      if (itemToRemove) {
        const result = MenuService.remove(MenuType.ALE, itemToRemove.id);
        expect(result).toBe(true);
      }
    });

    it('should throw an error when trying to remove a non-existent item', () => {
      const nonExistentId = '00000000-0000-4000-8000-000000000000';

      expect(() => MenuService.remove(MenuType.ALE, nonExistentId)).toThrow();
    });

    it('should throw an ApiError with 404 status code when item is not found', () => {
      const nonExistentId = '00000000-0000-4000-8000-000000000000';

      try {
        MenuService.remove(MenuType.WINE, nonExistentId);
        expect.fail('Expected function to throw an error');
      } catch (error) {
        expect(error).toBeDefined();
        expect(error).toHaveProperty('statusCode', 404);
        expect(error).toHaveProperty('message', `Menu item with id ${ nonExistentId } not found`);
      }
    });

    it('should throw an error for invalid menu type', () => {
      const invalidMenuType = 'INVALID' as MenuType;
      const someId = '00000000-0000-4000-8000-000000000000';

      expect(() => MenuService.remove(invalidMenuType, someId)).toThrow();
    });

    it('should throw an ApiError with 404 status code for invalid menu type', () => {
      const invalidMenuType = 'DESSERT' as MenuType;
      const someId = '00000000-0000-4000-8000-000000000000';

      try {
        MenuService.remove(invalidMenuType, someId);
        expect.fail('Expected function to throw an error');
      } catch (error) {
        expect(error).toBeDefined();
        expect(error).toHaveProperty('statusCode', 404);
        expect(error).toHaveProperty('message', 'Menu type DESSERT does not exist');
      }
    });
  });
});
