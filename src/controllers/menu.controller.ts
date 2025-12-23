import {
  NextFunction,
  Response,
} from 'express';
import {
  AddMenuItemRequest,
  Menu,
  MenuDeleteRequest,
  MenuRequest,
} from '../types/menu';
import { MenuService } from '../services/menu.service';
import { Success } from 'types/response-codes';

function retrieve(req: MenuRequest, res: Response, next: NextFunction) {
  try {
    const menuType = req.params.type;
    const { sort, order } = req.query;

    const menu: Menu = MenuService.retrieve(menuType, sort, order);
    res.status(Success.OK).json({ data: menu });
  } catch (err) {
    next(err);
  }
}

function add(req: AddMenuItemRequest, res: Response, next: NextFunction) {
  try {
    const menuType = req.params.type;
    const menu: Menu = MenuService.add(menuType, req.body);
    res.status(Success.OK).json({ data: menu });
  } catch (err) {
    next(err);
  }
}

function remove(req: MenuDeleteRequest, res: Response, next: NextFunction) {
  try {
    const { type, id } = req.params;
    const success: boolean = MenuService.remove(type, id);
    res.status(Success.NO_CONTENT).json({ data: success });
  } catch (err) {
    next(err);
  }
}

export const menuController = {
  retrieve,
  add,
  remove,
};
