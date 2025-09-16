import express from 'express';
import ldapts from 'ldapts';
import * as z from 'zod';

import { ldapDbNewClientSchema, bindReqSchema } from '../utils/schemas';
import type { bindReq, clientReq } from '../utils/types';

const router = express.Router();

const clients: (ldapts.Client | null)[] = [];

//returns index of client in clients array for future refrence
router.post('/client', (req, rsp, next) => {
  try {
    const serverUrl: clientReq = ldapDbNewClientSchema.parse(req.body);

    const client = new ldapts.Client({
      url: serverUrl.url
    });

    clients.push(client);

    rsp.status(201).send({ id: clients.length - 1 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      rsp.status(400).send({ error: 'url is invalid' });

      return;
    }

    next(err);
  }
});

router.post('/bind', async (req, rsp, next) => {
  try {
    const bindArgs: bindReq = bindReqSchema.parse(req.body);

    if (bindArgs.clientId >= clients.length) {
      rsp.status(400).send({ error: 'no such client exists' });

      return;
    }

    const client = clients[bindArgs.clientId];

    if (client === null || client === undefined) {
      rsp.status(400).send({ error: 'no such client exists' });

      return;
    }

    if (bindArgs.password) {
      await client.bind(bindArgs.dnOrSaslMechanism, bindArgs.password);
    } else {
      await client.bind(bindArgs.dnOrSaslMechanism);
    }

    rsp.status(201).end();
  } catch (err) {
    if (err instanceof z.ZodError) {
      rsp.status(400).send(err);

      return;
    }

    next(err);
  }
});

export default router;
