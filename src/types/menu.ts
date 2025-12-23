import {
  RequestWithBody,
  RequestWithQuery,
  RequestWithValidatedParams,
} from './request';
import { z } from 'zod';
import {
  menuAddItemSchema,
  menuDeleteParamSchema,
  menuItemsQuerySchema,
  menuTypeParamSchema,
} from '../validation-schema/menu.schema';
import { UUID } from 'node:crypto';

export enum MenuType {
  ALE = 'ale',
  WINE = 'wine',
  FOOD = 'food',
}

export enum MenuSort {
  NAME = 'name',
  PRICE = 'price',
}

export interface MenuItem {
  id: UUID;
  name: string;
  description: string;
  price: number;
}

export type Menu = MenuItem[];

export type MenuRequest =
  RequestWithValidatedParams<z.output<typeof menuTypeParamSchema>>
  & RequestWithQuery<z.output<typeof menuItemsQuerySchema>>;

export type AddMenuItemRequest =
  RequestWithValidatedParams<z.output<typeof menuTypeParamSchema>>
  & RequestWithBody<z.output<typeof menuAddItemSchema>>;

export type MenuDeleteRequest = RequestWithValidatedParams<z.output<typeof menuDeleteParamSchema>>;
