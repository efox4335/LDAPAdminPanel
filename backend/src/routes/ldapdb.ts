import express from 'express';
import ldapts from 'ldapts';

import { ldapDbNewClientSchema, bindReqSchema, searchReqSchema, addReqSchema, delReqSchema } from '../utils/schemas';
import type { addReq, bindReq, clientMetaData, clientReq, delReq, searchReq, responseError } from '../utils/types';
import { addNewClient, getClientById, removeClientById } from '../utils/state';
import controlParser from '../utils/controlParser';

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
      const err: responseError = {
        type: 'customErrorMessage',
        message: 'cannot bind: no client exists'
      };

      res.status(404).send(err);

      return;
    }

    const controlArg = controlParser(bindArgs);

    await client.bind(bindArgs.dnOrSaslMechanism, bindArgs.password, controlArg);

    res.status(200).end();
  } catch (err) {
    next(err);
  }
});

router.put('/:id/unbind', async (req, res, next) => {
  try {
    const client = getClientById(req.params.id);

    if (client === undefined) {
      const err: responseError = {
        type: 'customErrorMessage',
        message: 'cannot unbind: no client exists'
      };

      res.status(404).send(err);

      return;
    }

    if (!client.isConnected) {
      const err: responseError = {
        type: 'customErrorMessage',
        message: 'cannot unbind: client is not connected'
      };

      res.status(409).send(err);

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
      const err: responseError = {
        type: 'customErrorMessage',
        message: 'cannot delete: no client exists'
      };

      res.status(404).send(err);

      return;
    }

    if (client.isConnected) {
      const err: responseError = {
        type: 'customErrorMessage',
        message: 'cannot delete: client has active connection to database'
      };

      res.status(409).send(err);

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
      const err: responseError = {
        type: 'customErrorMessage',
        message: 'cannot search: no client exists'
      };

      res.status(404).send(err);

      return;
    }

    //i don't like the idea of a search changing the client state
    //if binding where allowed bind errors would also have to be handeled here
    if (!client.isConnected) {
      const err: responseError = {
        type: 'customErrorMessage',
        message: 'cannot search: client is not connected'
      };

      res.status(409).send(err);

      return;
    }

    const searchArgs: searchReq = searchReqSchema.parse(req.body);

    const controlArg = controlParser(searchArgs);

    const searchRes = await client.search(searchArgs.baseDn, searchArgs.options, controlArg);

    res.status(200).send(searchRes);
  } catch (err) {
    next(err);
  }
});

router.post('/:id/add', async (req, res, next) => {
  try {
    const client = getClientById(req.params.id);

    if (!client) {
      const err: responseError = {
        type: 'customErrorMessage',
        message: 'cannot add: no client exists'
      };

      res.status(404).send(err);

      return;
    }

    if (!client.isConnected) {
      const err: responseError = {
        type: 'customErrorMessage',
        message: 'cannot add: client is not connected'
      };

      res.status(409).send(err);

      return;
    }

    const addArgs: addReq = addReqSchema.parse(req.body);

    const controlArg = controlParser(addArgs);

    await client.add(addArgs.baseDn, addArgs.entry, controlArg);

    res.status(201).end();
  } catch (err) {
    next(err);
  }
});

router.delete('/:id/del', async (req, res, next) => {
  try {
    const client = getClientById(req.params.id);

    if (!client) {
      const err: responseError = {
        type: 'customErrorMessage',
        message: 'cannot del: no client exists'
      };

      res.status(404).send(err);

      return;
    }

    if (!client.isConnected) {
      const err: responseError = {
        type: 'customErrorMessage',
        message: 'cannot del: client is not connected'
      };

      res.status(409).send(err);

      return;
    }

    const delArgs: delReq = delReqSchema.parse(req.body);

    const controlArg = controlParser(delArgs);

    await client.del(delArgs.dn, controlArg);

    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

router.get('/:id', (req, res) => {
  const client = getClientById(req.params.id);

  if (!client) {
    const err: responseError = {
      type: 'customErrorMessage',
      message: 'no client exists'
    };

    res.status(404).send(err);

    return;
  }

  const clientMetaData: clientMetaData = {
    isConnected: client.isConnected
  };

  res.status(200).send(clientMetaData);
});

export default router;
