import { z } from 'zod';
import {
  MenuSort,
  MenuType,
} from '../types/menu';
import { SortOrder } from '../types/common';
import { UUID } from 'node:crypto';

export const menuTypeParamSchema = z.object({
  type: z.enum(MenuType),
});

export const menuItemsQuerySchema = z.object({
  sort: z.enum(MenuSort)
    .default(MenuSort.PRICE),
  order: z.enum(SortOrder)
    .default(SortOrder.ASC),
});

export const menuDeleteParamSchema = menuTypeParamSchema.extend({
  id: z.uuidv4()
    .transform(uuid => uuid as UUID),
});

export const menuAddItemSchema = z.object({
  name: z.string().min(2).max(50),
  description: z.string().min(15).max(500),
  price: z.number().min(0),
});
