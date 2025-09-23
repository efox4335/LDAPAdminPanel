import express from 'express';
import ldapts, { InvalidCredentialsError, InvalidDNSyntaxError, InvalidSyntaxError, NoSuchObjectError, SizeLimitExceededError, TimeLimitExceededError, UndefinedTypeError } from 'ldapts';
import * as z from 'zod';

import { ldapDbNewClientSchema, bindReqSchema, searchReqSchema, addReqSchema, delReqSchema } from '../utils/schemas';
import type { addReq, bindReq, clientMetaData, clientReq, delReq, searchReq } from '../utils/types';
import { addNewClient, getClientById, removeClientById } from '../utils/state';

const router = express.Router();

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

    //removes password to prevent inclusion on logs
    //eslint rule is useless in this case as req.body is already validated
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (req.body.password) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      req.body.password = 'redacted';
    }

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
      rsp.status(401).send({ error: 'cannot bind: invalid credentials', originalError: err });

      return;
    }

    if (err instanceof InvalidDNSyntaxError) {
      rsp.status(400).send({ error: 'cannot bind: invalid dn syntax', originalError: err });

      return;
    }

    next(err);
  }
});

router.put('/:id/unbind', async (req, rsp, next) => {
  try {
    const client = getClientById(req.params.id);

    if (client === undefined) {
      rsp.status(404).send({ error: 'cannot unbind: no client exists' });

      return;
    }

    if (!client.isConnected) {
      rsp.status(409).send({ error: 'cannot unbind: client is not connected' });

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

      return;
    }

    removeClientById(req.params.id);

    rsp.status(204).end();
  } catch (err) {
    next(err);
  }
});

router.post('/:id/search', async (req, rsp, next) => {
  try {
    const client = getClientById(req.params.id);

    if (client === undefined) {
      rsp.status(404).send({ error: 'cannot search: no client exists' });

      return;
    }

    //i don't like the idea of a search changing the client state
    //if binding where allowed bind errors would also have to be handeled here
    if (!client.isConnected) {
      rsp.status(409).send({ error: 'cannot search: client is not connected' });

      return;
    }

    const searchArgs: searchReq = searchReqSchema.parse(req.body);

    const res = await client.search(searchArgs.baseDn, searchArgs.options);

    rsp.status(200).send(res);
  } catch (err) {
    if (err instanceof z.ZodError) {
      rsp.status(400).send(err);

      return;
    }

    if (err instanceof NoSuchObjectError) {
      rsp.status(404).send({ error: 'cannot search: base dn does not match any in server', originalError: err });

      return;
    }

    if (err instanceof InvalidDNSyntaxError) {
      rsp.status(400).send({ error: 'cannot search: base dn syntax is invalid', originalError: err });

      return;
    }

    //TODO: figure out a way to test
    if (err instanceof UndefinedTypeError) {
      rsp.status(400).send({ error: 'cannot search: attribute does not exist in server', originalError: err });

      return;
    }

    //TODO: figure out a way to test
    if (err instanceof SizeLimitExceededError) {
      rsp.status(400).send({ error: 'cannot search: size limit has been exceeded', originalError: err });

      return;
    }

    //TODO: figure out a way to test
    if (err instanceof TimeLimitExceededError) {
      rsp.status(408).send({ error: 'cannot search: time limit exceeded', originalError: err });

      return;
    }

    next(err);
  }
});

router.post('/:id/add', async (req, rsp, next) => {
  try {
    const client = getClientById(req.params.id);

    if (!client) {
      rsp.status(404).send({ error: 'cannot add: no client exists' });

      return;
    }

    if (!client.isConnected) {
      rsp.status(409).send({ error: 'cannot add: client is not connected' });

      return;
    }

    const addArgs: addReq = addReqSchema.parse(req.body);

    await client.add(addArgs.baseDn, addArgs.entry);

    rsp.status(201).end();
  } catch (err) {
    if (err instanceof z.ZodError) {
      rsp.status(400).send(err);

      return;
    }

    if (err instanceof InvalidDNSyntaxError) {
      rsp.status(400).send({ error: 'cannot add: base dn syntax is invalid', originalError: err });

      return;
    }

    if (err instanceof NoSuchObjectError) {
      rsp.status(400).send({ error: 'cannot add: base dn does not exist', originalError: err });

      return;
    }

    if (err instanceof UndefinedTypeError) {
      rsp.status(400).send({ error: 'cannot add: attributes given do not match schema', originalError: err });

      return;
    }

    if (err instanceof InvalidSyntaxError) {
      rsp.status(400).send({ error: 'cannot add: attributes given do not match their syntax', originalError: err });

      return;
    }

    next(err);
  }
});

router.delete('/:id/del', async (req, rsp, next) => {
  try {
    const client = getClientById(req.params.id);

    if (!client) {
      rsp.status(404).send({ error: 'cannot del: no client exists' });

      return;
    }

    if (!client.isConnected) {
      rsp.status(409).send({ error: 'cannot del: client is not connected' });

      return;
    }

    const delArgs: delReq = delReqSchema.parse(req.body);

    await client.del(delArgs.dn);

    rsp.status(204).end();
  } catch (err) {
    next(err);
  }
});

router.get('/:id', (req, rsp) => {
  const client = getClientById(req.params.id);

  if (!client) {
    rsp.status(404).send({ error: 'no client exists' });

    return;
  }

  const clientMetaData: clientMetaData = {
    isConnected: client.isConnected
  };

  rsp.status(200).send(clientMetaData);
});

export default router;
