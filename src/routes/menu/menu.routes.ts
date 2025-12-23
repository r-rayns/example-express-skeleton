import { Router } from 'express';
import { validate } from '../../middleware/validator';
import {
  menuAddItemSchema,
  menuDeleteParamSchema,
  menuItemsQuerySchema,
  menuTypeParamSchema,
} from '../../validation-schema/menu.schema';
import { ValidationProperty } from '../../types/validation-property';
import { menuController } from '../../controllers/menu.controller';

export const menuRoutes = (router: Router) => {

  // Add to a menu (Example body request)
  router.post('/menus/:type/items',
    validate(menuTypeParamSchema, ValidationProperty.PARAMS),
    validate(menuAddItemSchema, ValidationProperty.BODY),
    menuController.add,
  );

  // Retrieve a menu with sorting (Example mixed parameter and query string request)
  router.get('/menus/:type',
    validate(menuTypeParamSchema, ValidationProperty.PARAMS),
    validate(menuItemsQuerySchema, ValidationProperty.QUERY),
    menuController.retrieve);

  // Delete an item from a menu (Example path parameter request)
  router.delete('/menus/:type/:id',
    validate(menuDeleteParamSchema, ValidationProperty.PARAMS),
    menuController.remove);

};
