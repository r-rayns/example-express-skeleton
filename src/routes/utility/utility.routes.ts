import {
  Request,
  Response,
  Router,
} from 'express';
import { DateTime } from 'luxon';
import { Success } from '../../types/response-codes';
import { echoSchema } from '../../validation-schema/utility.schema';
import { validate } from '../../middleware/validator';
import { z } from 'zod';
import { RequestWithBody } from '../../types/request';

export const utilityRoutes = (router: Router) => {
  router.get('/ping', (req: Request, res: Response<{ data: PingResponse }>) => {
    res.status(Success.OK).json({
      data: {
        dateTime: DateTime.now().toUnixInteger(),
        status: 'OK',
      },
    });
  });

  router.post('/echo', validate(echoSchema), (req: EchoRequest, res: EchoResponse) => {
    res.status(Success.OK).json({
      echo: req.body.text,
    });
  });
};

type EchoRequest = RequestWithBody<z.output<typeof echoSchema>>;
type EchoResponse = Response<{
  echo: string;
}>;

export interface PingResponse {
  dateTime: number;
  status: string;
}
