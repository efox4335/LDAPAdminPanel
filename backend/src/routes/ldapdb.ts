import express from 'express';
import ldapts, { InvalidCredentialsError } from 'ldapts';
import * as z from 'zod';

import { ldapDbNewClientSchema, bindReqSchema } from '../utils/schemas';
import type { bindReq, clientReq } from '../utils/types';
import { addNewClient, getClientById, removeClientById } from '../utils/state';

const router = express.Router();

//returns index of client in clients array for future refrence
router.post('/', (req, rsp, next) => {
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

router.put('/:id/bind', async (req, rsp, next) => {
  try {
    const bindArgs: bindReq = bindReqSchema.parse(req.body);

    const client = getClientById(req.params.id);

    if (client === undefined) {
      rsp.status(404).send({ error: 'cannot bind: no client exists' });

      return;
    }

    if (bindArgs.password) {
      await client.bind(bindArgs.dnOrSaslMechanism, bindArgs.password);
    } else {
      await client.bind(bindArgs.dnOrSaslMechanism);
    }

    rsp.status(200).end();
  } catch (err) {
    if (err instanceof z.ZodError) {
      rsp.status(400).send(err);

      return;
    }

    if (err instanceof InvalidCredentialsError) {
      rsp.status(401).send({ error: 'cannot bind: invalid credentials' });

      return;
    }

    next(err);
  }
});

router.put('/:id/unbind', async (req, rsp, next) => {
  try {
    const client = getClientById(req.params.id);

    if (client === undefined) {
      rsp.status(404).send({ error: 'cannont unbind: no client exists' });

      return;
    }

    await client.unbind();

    rsp.status(200).end();
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', (req, rsp, next) => {
  try {
    const client = getClientById(req.params.id);

    if (client === undefined) {
      rsp.status(404).send({ error: 'cannot delete: no client exists' });

      return;
    }

    if (client.isConnected) {
      rsp.status(409).send({ error: 'cannot delete: client has active connection to database' });
    }

    removeClientById(req.params.id);

    rsp.status(204).end();
  } catch (err) {
    next(err);
  }
});

export default router;
