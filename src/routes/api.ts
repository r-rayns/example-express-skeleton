import express from 'express';
import { utilityRoutes } from './utility/utility.routes';
import { menuRoutes } from './menu/menu.routes';

const router = express.Router();

utilityRoutes(router);
menuRoutes(router);

export default router;
