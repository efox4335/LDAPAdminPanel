import express from 'express';
import * as z from 'zod';

import { setCaCerts } from '../utils/config';
import { stringArraySchema } from '../utils/schemas';

const router = express.Router();

router.post('/caCerts', (req, rsp) => {
  try {
    const newCerts = stringArraySchema.parse(req.body);

    setCaCerts(newCerts);

    rsp.status(201).send(newCerts);
  } catch (err) {
    if (err instanceof z.ZodError) {
      rsp.status(400).send({ error: 'invalid certs' });
    }
  }
});

export default router;
