import express from 'express';
import ldapts from 'ldapts';
import * as z from 'zod';

import { ldapDbUrlSchema } from '../utils/scheams';

const router = express.Router();

let clients: ldapts.Client[] = [];

//returns index of client in clients array for future refrence
router.post('client', (req, rsp, next) => {
  try {
    const serverUrl = ldapDbUrlSchema.parse(req.body);

    const client = new ldapts.Client({
      url: serverUrl
    });

    clients.push(client);

    rsp.send({ id: clients.length }).status(201);
  } catch (err) {
    if (err instanceof z.ZodError) {
      rsp.send({ error: 'url is invalid' }).status(400);

      return;
    }

    next();
  }
});

export default router;
