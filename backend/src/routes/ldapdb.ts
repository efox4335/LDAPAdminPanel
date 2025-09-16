import express from 'express';
import ldapts from 'ldapts';
import * as z from 'zod';

import { ldapDbNewClientSchema, bindReqSchema, unbindReqSchema } from '../utils/schemas';
import type { bindReq, clientReq, unbindReq } from '../utils/types';
import { addNewClient, getClientById, removeClientById } from '../utils/state';

const router = express.Router();

//returns index of client in clients array for future refrence
router.post('/client', (req, rsp, next) => {
  try {
    const serverUrl: clientReq = ldapDbNewClientSchema.parse(req.body);

    const client = new ldapts.Client({
      url: serverUrl.url
    });

    const clientId = addNewClient(client);

    rsp.status(201).send({ id: clientId });
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

    const client = getClientById(bindArgs.clientId);

    if (client === undefined) {
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

router.delete('/unbind', async (req, rsp, next) => {
  try {
    const args: unbindReq = unbindReqSchema.parse(req.body);

    const client = getClientById(args.clientId);

    if (client === undefined) {
      rsp.status(404).send({ error: 'no client exists' });

      return;
    }

    await client.unbind();

    removeClientById(args.clientId);

    rsp.status(200).end();
  } catch (err) {
    next(err);
  }
});

export default router;
