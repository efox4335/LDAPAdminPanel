import express from 'express';
import * as z from 'zod';

import { setCaCerts } from '../utils/config';
import { stringArraySchema } from '../utils/schemas';

const router = express.Router();

router.post('/caCerts', (req, rsp) => {
  try {
    const newCerts = stringArraySchema.parse(req.body);

    setCaCerts(newCerts);

    rsp.send(newCerts).status(201);
  } catch (err) {
    if (err instanceof z.ZodError) {
      rsp.send({ error: 'invalid certs' }).status(400);
    }
  }
});

export default router;
