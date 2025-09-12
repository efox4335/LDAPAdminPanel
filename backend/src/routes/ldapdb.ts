import express from 'express';
import ldapts from 'ldapts';
import * as z from 'zod';

import { ldapDbUrlSchema, bindReqSchema } from '../utils/schemas';

const router = express.Router();

const clients: (ldapts.Client | null)[] = [];

//returns index of client in clients array for future refrence
router.post('/client', (req, rsp, next) => {
  try {
    const serverUrl = ldapDbUrlSchema.parse(req.body);

    const client = new ldapts.Client({
      url: serverUrl
    });

    clients.push(client);

    rsp.send({ id: clients.length }).status(201);
  } catch (err) {
    if (err instanceof z.ZodError) {
      console.log('here');

      rsp.send({ error: 'url is invalid' }).status(400);

      return;
    }

    next(err);
  }
});

router.post('/bind', async (req, rsp, next) => {
  try {
    const bindArgs = bindReqSchema.parse(req.body);

    if (bindArgs.cliendId >= clients.length) {
      rsp.send({ error: 'no such client exists' }).status(400);

      return;
    }

    const client = clients[bindArgs.cliendId];

    if (client === null || client === undefined) {
      rsp.send({ error: 'no such clien exists' }).status(400);

      return;
    }

    if (bindArgs.password) {
      await client.bind(bindArgs.dnOrSaslMechanism, bindArgs.password);
    } else {
      await client.bind(bindArgs.dnOrSaslMechanism);
    }

    rsp.status(201);
  } catch (err) {
    if (err instanceof z.ZodError) {
      rsp.send(err).status(400);

      return;
    }

    next(err);
  }
});

export default router;
