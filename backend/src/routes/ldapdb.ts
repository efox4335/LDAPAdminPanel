import express from 'express';
import ldapts from 'ldapts';

import { ldapDbNewClientSchema, bindReqSchema, searchReqSchema, addReqSchema, delReqSchema } from '../utils/schemas';
import type { addReq, bindReq, clientMetaData, clientReq, delReq, searchReq } from '../utils/types';
import { addNewClient, getClientById, removeClientById } from '../utils/state';

const router = express.Router();

router.post('/', (req, res, next) => {
  try {
    const serverUrl: clientReq = ldapDbNewClientSchema.parse(req.body);

    const client = new ldapts.Client({
      url: serverUrl.url
    });

    const clientId = addNewClient(client);

    res.status(201).send({ id: clientId });
  } catch (err) {
    next(err);
  }
});

router.put('/:id/bind', async (req, res, next) => {
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
      res.status(404).send({ error: 'cannot bind: no client exists' });

      return;
    }

    if (bindArgs.password) {
      await client.bind(bindArgs.dnOrSaslMechanism, bindArgs.password);
    } else {
      await client.bind(bindArgs.dnOrSaslMechanism);
    }

    res.status(200).end();
  } catch (err) {
    next(err);
  }
});

router.put('/:id/unbind', async (req, res, next) => {
  try {
    const client = getClientById(req.params.id);

    if (client === undefined) {
      res.status(404).send({ error: 'cannot unbind: no client exists' });

      return;
    }

    if (!client.isConnected) {
      res.status(409).send({ error: 'cannot unbind: client is not connected' });

      return;
    }

    await client.unbind();

    res.status(200).end();
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', (req, res, next) => {
  try {
    const client = getClientById(req.params.id);

    if (client === undefined) {
      res.status(404).send({ error: 'cannot delete: no client exists' });

      return;
    }

    if (client.isConnected) {
      res.status(409).send({ error: 'cannot delete: client has active connection to database' });

      return;
    }

    removeClientById(req.params.id);

    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

router.post('/:id/search', async (req, res, next) => {
  try {
    const client = getClientById(req.params.id);

    if (client === undefined) {
      res.status(404).send({ error: 'cannot search: no client exists' });

      return;
    }

    //i don't like the idea of a search changing the client state
    //if binding where allowed bind errors would also have to be handeled here
    if (!client.isConnected) {
      res.status(409).send({ error: 'cannot search: client is not connected' });

      return;
    }

    const searchArgs: searchReq = searchReqSchema.parse(req.body);

    const searchRes = await client.search(searchArgs.baseDn, searchArgs.options);

    res.status(200).send(searchRes);
  } catch (err) {
    next(err);
  }
});

router.post('/:id/add', async (req, res, next) => {
  try {
    const client = getClientById(req.params.id);

    if (!client) {
      res.status(404).send({ error: 'cannot add: no client exists' });

      return;
    }

    if (!client.isConnected) {
      res.status(409).send({ error: 'cannot add: client is not connected' });

      return;
    }

    const addArgs: addReq = addReqSchema.parse(req.body);

    await client.add(addArgs.baseDn, addArgs.entry);

    res.status(201).end();
  } catch (err) {
    next(err);
  }
});

router.delete('/:id/del', async (req, res, next) => {
  try {
    const client = getClientById(req.params.id);

    if (!client) {
      res.status(404).send({ error: 'cannot del: no client exists' });

      return;
    }

    if (!client.isConnected) {
      res.status(409).send({ error: 'cannot del: client is not connected' });

      return;
    }

    const delArgs: delReq = delReqSchema.parse(req.body);

    await client.del(delArgs.dn);

    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

router.get('/:id', (req, res) => {
  const client = getClientById(req.params.id);

  if (!client) {
    res.status(404).send({ error: 'no client exists' });

    return;
  }

  const clientMetaData: clientMetaData = {
    isConnected: client.isConnected
  };

  res.status(200).send(clientMetaData);
});

export default router;
