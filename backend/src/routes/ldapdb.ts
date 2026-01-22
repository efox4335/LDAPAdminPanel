import express from 'express';
import ldapts from 'ldapts';

import { ldapDbNewClientSchema, bindReqSchema, searchReqSchema, addReqSchema, delReqSchema, exopReqSchema, compareReqSchema, modifyDNReqSchema, modifyReqSchema } from '../utils/schemas';
import type { addReq, bindReq, clientMetaData, clientReq, delReq, searchReq, responseError, exopReq, compareReq, modifyDnReq, modifyReq } from '../utils/types';
import { addNewClient, getAllStoredClientMetaData, getClientById, getStoredClientMetaDataById, removeClientById, setBoundDnById } from '../utils/state';
import controlParser from '../utils/controlParser';
import changeParser from '../utils/changeParser';

const router = express.Router();

router.post('/', (req, res, next) => {
  try {
    const serverUrl: clientReq = ldapDbNewClientSchema.parse(req.body);

    const client = new ldapts.Client({
      url: serverUrl.url
    });

    const clientId = addNewClient(client, serverUrl.url);

    res.status(201).send({ id: clientId });
  } catch (err) {
    if (err instanceof Error) {
      if (/.*is an invalid LDAP URL \(protocol\)/.test(err.message)) {
        const retError: responseError = {
          type: 'validationError',
          error: err.message
        };

        res.status(400).send(retError);

        return;
      }
    }

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

    setBoundDnById(req.params.id, bindArgs.dnOrSaslMechanism);

    res.status(200).end();
  } catch (err) {
    //on some errors the client will be anonymously bound
    const client = getClientById(req.params.id);

    if (client && client.isConnected) {
      await client.unbind();
    }

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

    setBoundDnById(req.params.id, null);

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

router.post('/:id/del', async (req, res, next) => {
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

router.post('/:id/exop', async (req, res, next) => {
  try {
    const client = getClientById(req.params.id);

    if (!client) {
      const err: responseError = {
        type: 'customErrorMessage',
        message: 'cannot exop: no client exists'
      };

      res.status(404).send(err);

      return;
    }

    if (!client.isConnected) {
      const err: responseError = {
        type: 'customErrorMessage',
        message: 'cannot exop: client is not connected'
      };

      res.status(409).send(err);

      return;
    }

    const exopArgs: exopReq = exopReqSchema.parse(req.body);

    const controlArg = controlParser(exopArgs);

    const exopRes = await client.exop(exopArgs.oid, exopArgs.value, controlArg);

    res.status(200).send(exopRes);
  } catch (err) {
    next(err);
  }
});

router.post('/:id/compare', async (req, res, next) => {
  try {
    const client = getClientById(req.params.id);

    if (!client) {
      const err: responseError = {
        type: 'customErrorMessage',
        message: 'cannot compare: no client exists'
      };

      res.status(404).send(err);

      return;
    }

    if (!client.isConnected) {
      const err: responseError = {
        type: 'customErrorMessage',
        message: 'cannot compare: client is not connected'
      };

      res.status(409).send(err);

      return;
    }

    const compareArgs: compareReq = compareReqSchema.parse(req.body);

    const controlArg = controlParser(compareArgs);

    const compareRes = await client.compare(compareArgs.dn, compareArgs.attribute, compareArgs.value, controlArg);

    res.status(200).send({ result: compareRes });
  } catch (err) {
    next(err);
  }
});

router.put('/:id/modifydn', async (req, res, next) => {
  try {
    const client = getClientById(req.params.id);

    if (!client) {
      const err: responseError = {
        type: 'customErrorMessage',
        message: 'cannot modify dn: no client exists'
      };

      res.status(404).send(err);

      return;
    }

    if (!client.isConnected) {
      const err: responseError = {
        type: 'customErrorMessage',
        message: 'cannot modify dn: client is not connected'
      };

      res.status(409).send(err);

      return;
    }

    const modifyDnArgs: modifyDnReq = modifyDNReqSchema.parse(req.body);

    const controlArg = controlParser(modifyDnArgs);

    await client.modifyDN(modifyDnArgs.dn, modifyDnArgs.newDN, controlArg);

    res.status(201).end();
  } catch (err) {
    next(err);
  }
});

router.put('/:id/modify', async (req, res, next) => {
  try {
    const client = getClientById(req.params.id);

    if (!client) {
      const err: responseError = {
        type: 'customErrorMessage',
        message: 'cannot modify: no client exists'
      };

      res.status(404).send(err);

      return;
    }

    if (!client.isConnected) {
      const err: responseError = {
        type: 'customErrorMessage',
        message: 'cannot modify: client is not connected'
      };

      res.status(409).send(err);

      return;
    }

    const modifyArgs: modifyReq = modifyReqSchema.parse(req.body);

    const controlArg = controlParser(modifyArgs);

    const changes = changeParser(modifyArgs.changes);

    await client.modify(modifyArgs.dn, changes, controlArg);

    res.status(201).end();
  } catch (err) {
    next(err);
  }
});

router.get('/:id', (req, res) => {
  const client = getStoredClientMetaDataById(req.params.id);

  if (!client) {
    const err: responseError = {
      type: 'customErrorMessage',
      message: 'no client exists'
    };

    res.status(404).send(err);

    return;
  }

  const isConnected = client.ldapClient.isConnected;

  if (!isConnected) {
    setBoundDnById(client.id, null);
  }

  const clientMetaData: clientMetaData = {
    id: req.params.id,
    serverUrl: client.serverUrl,
    boundDn: client.boundDn,
    isConnected: isConnected
  };

  res.status(200).send(clientMetaData);
});

router.get('/', (_req, res) => {
  const clients = getAllStoredClientMetaData();

  const clientsMetaData: clientMetaData[] = clients.map((val) => {
    const isConnected = val.ldapClient.isConnected;

    if (!isConnected) {
      setBoundDnById(val.id, null);
    }

    return {
      id: val.id,
      serverUrl: val.serverUrl,
      boundDn: val.boundDn,
      isConnected: isConnected
    };
  });

  res.status(200).send(clientsMetaData);
});

export default router;
