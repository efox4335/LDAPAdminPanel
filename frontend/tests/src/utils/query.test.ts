import { test, vi, expect, describe } from 'vitest';

import { fetchAllLdapEntries, fetchLdapEntry } from '../../../src/utils/query';
import type { ldapEntry, operationalLdapEntry, searchReq, searchRes } from '../../../src/utils/types';

const visibleDseSearch: searchRes = {
  'searchEntries': [
    {
      'dn': '',
      'objectClass': [
        'top',
        'OpenLDAProotDSE'
      ],
      '*': []
    }
  ],
  'searchReferences': []
};

const operationalDseSearch: searchRes = {
  'searchEntries': [
    {
      'dn': '',
      'structuralObjectClass': 'OpenLDAProotDSE',
      'configContext': 'cn=config',
      'monitorContext': 'cn=Monitor',
      'namingContexts': 'dc=example,dc=org',
      'supportedControl': [
        '2.16.840.1.113730.3.4.18',
        '2.16.840.1.113730.3.4.2',
        '1.3.6.1.4.1.4203.1.10.1',
        '1.3.6.1.1.22',
        '1.2.840.113556.1.4.319',
        '1.2.826.0.1.3344810.2.3',
        '1.3.6.1.1.13.2',
        '1.3.6.1.1.13.1',
        '1.3.6.1.1.12'
      ],
      'supportedExtension': [
        '1.3.6.1.4.1.4203.1.11.1',
        '1.3.6.1.4.1.4203.1.11.3',
        '1.3.6.1.1.8',
        '1.3.6.1.1.21.3',
        '1.3.6.1.1.21.1'
      ],
      'supportedFeatures': [
        '1.3.6.1.1.14',
        '1.3.6.1.4.1.4203.1.5.1',
        '1.3.6.1.4.1.4203.1.5.2',
        '1.3.6.1.4.1.4203.1.5.3',
        '1.3.6.1.4.1.4203.1.5.4',
        '1.3.6.1.4.1.4203.1.5.5'
      ],
      'supportedLDAPVersion': '3',
      'entryDN': '',
      'subschemaSubentry': 'cn=Subschema',
      '+': []
    }
  ],
  'searchReferences': []
};

const visibleExampleDitSearchRes: searchRes = {
  'searchEntries': [
    {
      'dn': 'dc=example,dc=org',
      'objectClass': [
        'dcObject',
        'organization'
      ],
      'dc': 'example',
      'o': 'example',
      '*': []
    },
    {
      'dn': 'ou=users,dc=example,dc=org',
      'objectClass': 'organizationalUnit',
      'ou': 'users',
      '*': []
    },
    {
      'dn': 'ou=groups,dc=example,dc=org',
      'objectClass': 'organizationalUnit',
      'ou': 'groups',
      '*': []
    },
    {
      'dn': 'cn=user01,ou=users,dc=example,dc=org',
      'cn': [
        'User1',
        'user01'
      ],
      'sn': 'Bar1',
      'objectClass': [
        'inetOrgPerson',
        'posixAccount',
        'shadowAccount'
      ],
      'userPassword': 'bitnami1',
      'uid': 'user01',
      'uidNumber': '1000',
      'gidNumber': '1000',
      'homeDirectory': '/home/user01',
      '*': []
    },
    {
      'dn': 'cn=user02,ou=users,dc=example,dc=org',
      'cn': [
        'User2',
        'user02'
      ],
      'sn': 'Bar2',
      'objectClass': [
        'inetOrgPerson',
        'posixAccount',
        'shadowAccount'
      ],
      'userPassword': 'bitnami2',
      'uid': 'user02',
      'uidNumber': '1001',
      'gidNumber': '1001',
      'homeDirectory': '/home/user02',
      '*': []
    },
    {
      'dn': 'cn=readers,ou=groups,dc=example,dc=org',
      'cn': 'readers',
      'objectClass': 'groupOfNames',
      'member': [
        'cn=user01,ou=users,dc=example,dc=org',
        'cn=user02,ou=users,dc=example,dc=org'
      ],
      '*': []
    }
  ],
  'searchReferences': []
};

const operationalExampleDitSearchRes: searchRes = {
  'searchEntries': [
    {
      'dn': 'dc=example,dc=org',
      'structuralObjectClass': 'organization',
      'entryUUID': 'b5f2be88-377f-1040-916b-c3ed8cae84c5',
      'creatorsName': 'cn=admin,dc=example,dc=org',
      'createTimestamp': '20251007041323Z',
      'entryCSN': '20251007041323.744081Z#000000#000#000000',
      'modifiersName': 'cn=admin,dc=example,dc=org',
      'modifyTimestamp': '20251007041323Z',
      'entryDN': 'dc=example,dc=org',
      'subschemaSubentry': 'cn=Subschema',
      'hasSubordinates': 'TRUE',
      '+': []
    },
    {
      'dn': 'ou=users,dc=example,dc=org',
      'structuralObjectClass': 'organizationalUnit',
      'entryUUID': 'b5f3bb58-377f-1040-916c-c3ed8cae84c5',
      'creatorsName': 'cn=admin,dc=example,dc=org',
      'createTimestamp': '20251007041323Z',
      'entryCSN': '20251007041323.750554Z#000000#000#000000',
      'modifiersName': 'cn=admin,dc=example,dc=org',
      'modifyTimestamp': '20251007041323Z',
      'entryDN': 'ou=users,dc=example,dc=org',
      'subschemaSubentry': 'cn=Subschema',
      'hasSubordinates': 'TRUE',
      '+': []
    },
    {
      'dn': 'cn=readers,ou=groups,dc=example,dc=org',
      'structuralObjectClass': 'groupOfNames',
      'entryUUID': 'b5f4afa4-377f-1040-9170-c3ed8cae84c5',
      'creatorsName': 'cn=admin,dc=example,dc=org',
      'createTimestamp': '20251007041323Z',
      'entryCSN': '20251007041323.756808Z#000000#000#000000',
      'modifiersName': 'cn=admin,dc=example,dc=org',
      'modifyTimestamp': '20251007041323Z',
      'entryDN': 'cn=readers,ou=groups,dc=example,dc=org',
      'subschemaSubentry': 'cn=Subschema',
      'hasSubordinates': 'FALSE',
      '+': []
    },
    {
      'dn': 'ou=groups,dc=example,dc=org',
      'structuralObjectClass': 'organizationalUnit',
      'entryUUID': 'b5f3fa96-377f-1040-916d-c3ed8cae84c5',
      'creatorsName': 'cn=admin,dc=example,dc=org',
      'createTimestamp': '20251007041323Z',
      'entryCSN': '20251007041323.752172Z#000000#000#000000',
      'modifiersName': 'cn=admin,dc=example,dc=org',
      'modifyTimestamp': '20251007041323Z',
      'entryDN': 'ou=groups,dc=example,dc=org',
      'subschemaSubentry': 'cn=Subschema',
      'hasSubordinates': 'TRUE',
      '+': []
    },
    {
      'dn': 'cn=user01,ou=users,dc=example,dc=org',
      'structuralObjectClass': 'inetOrgPerson',
      'entryUUID': 'b5f434ca-377f-1040-916e-c3ed8cae84c5',
      'creatorsName': 'cn=admin,dc=example,dc=org',
      'createTimestamp': '20251007041323Z',
      'entryCSN': '20251007041323.753664Z#000000#000#000000',
      'modifiersName': 'cn=admin,dc=example,dc=org',
      'modifyTimestamp': '20251007041323Z',
      'entryDN': 'cn=user01,ou=users,dc=example,dc=org',
      'subschemaSubentry': 'cn=Subschema',
      'hasSubordinates': 'FALSE',
      '+': []
    },
    {
      'dn': 'cn=user02,ou=users,dc=example,dc=org',
      'structuralObjectClass': 'inetOrgPerson',
      'entryUUID': 'b5f470ac-377f-1040-916f-c3ed8cae84c5',
      'creatorsName': 'cn=admin,dc=example,dc=org',
      'createTimestamp': '20251007041323Z',
      'entryCSN': '20251007041323.755197Z#000000#000#000000',
      'modifiersName': 'cn=admin,dc=example,dc=org',
      'modifyTimestamp': '20251007041323Z',
      'entryDN': 'cn=user02,ou=users,dc=example,dc=org',
      'subschemaSubentry': 'cn=Subschema',
      'hasSubordinates': 'FALSE',
      '+': []
    }
  ],
  'searchReferences': []
};

let mockedSearchClient = (_id: string, _req: searchReq): searchRes => {
  throw new Error('assign first');
};

vi.mock('../../../src/services/ldapdbsService', (original) => {
  const mod = original;

  return {
    ...mod,
    searchClient: vi.fn((id: string, req: searchReq): searchRes => {
      return mockedSearchClient(id, req);
    })
  };
});

describe('query.ts tests', () => {
  describe('fetchAllLdapEntries tests', () => {
    test('no root DSE', async () => {
      mockedSearchClient = (_id: string, _req: searchReq): searchRes => {
        return {
          searchEntries: [],
          searchReferences: []
        };
      };

      try {
        await fetchAllLdapEntries('id');

        throw new Error('no error');
      } catch (err) {
        expect(err).instanceOf(Error);
        if (!(err instanceof Error)) {
          throw err;
        }

        expect(err.message).toStrictEqual('failed to locate root dse');
      }
    });

    test('no root dse objectClass', async () => {
      mockedSearchClient = (_id: string, req: searchReq): searchRes => {
        if (req.baseDn !== '') {
          throw new Error(`wrong baseDn: ${req.baseDn}`);
        }

        let res;

        if (req.options.attributes[0] === '*') {
          res = JSON.parse(JSON.stringify(visibleDseSearch)) as searchRes;

          delete res.searchEntries[0].objectClass;
        } else {
          res = operationalDseSearch;
        }

        return res;
      };

      try {
        await fetchAllLdapEntries('id');

        throw new Error('no error');
      } catch (err) {
        if (!(err instanceof Error)) {
          throw err;
        }

        expect(err.message).toStrictEqual('root dse does not have objectClass');
      }
    });

    test('no root dse namingContexts', async () => {
      mockedSearchClient = (_id: string, req: searchReq): searchRes => {
        if (req.baseDn !== '') {
          throw new Error(`wrong baseDn: ${req.baseDn}`);
        }

        let res;

        if (req.options.attributes[0] === '+') {
          res = JSON.parse(JSON.stringify(operationalDseSearch)) as searchRes;

          delete res.searchEntries[0].namingContexts;
        } else {
          res = visibleDseSearch;
        }

        return res;
      };

      try {
        await fetchAllLdapEntries('id');

        throw new Error('no error');
      } catch (err) {
        expect(err).instanceOf(Error);
        if (!(err instanceof Error)) {
          throw err;
        }

        expect(err.message).toStrictEqual('root dse does not have namingContexts');
      }
    });

    test('no root dse dn', async () => {
      mockedSearchClient = (_id: string, req: searchReq): searchRes => {
        let res;

        if (req.options.attributes[0] === '*') {
          res = JSON.parse(JSON.stringify(visibleDseSearch)) as searchRes;

          delete res.searchEntries[0].dn;
        } else {
          res = JSON.parse(JSON.stringify(operationalDseSearch)) as searchRes;

          delete res.searchEntries[0].dn;
        }

        return res;
      };

      try {
        await fetchAllLdapEntries('id');

        throw new Error('no error');
      } catch (err) {
        if (!(err instanceof Error)) {
          throw err;
        }

        expect(err.message).toStrictEqual('root dse does not have dn');
      }
    });

    test('visible entry does not have dn', async () => {
      mockedSearchClient = (_id: string, req: searchReq): searchRes => {
        let res;

        if (req.baseDn === '') {
          if (req.options.attributes[0] === '*') {
            res = visibleDseSearch;
          } else {
            res = operationalDseSearch;
          }
        } else {
          if (req.options.attributes[0] === '*') {
            res = JSON.parse(JSON.stringify(visibleExampleDitSearchRes)) as searchRes;

            delete res.searchEntries[0].dn;
          } else {
            res = JSON.parse(JSON.stringify(operationalExampleDitSearchRes)) as searchRes;
          }
        }

        return res;
      };

      try {
        await fetchAllLdapEntries('id');

        throw new Error('no error');
      } catch (err) {
        if (!(err instanceof Error)) {
          throw err;
        }

        expect(err.message).toStrictEqual('entry does not have dn');
      }
    });

    test('operational entry does not have dn', async () => {
      mockedSearchClient = (_id: string, req: searchReq): searchRes => {
        let res;

        if (req.baseDn === '') {
          if (req.options.attributes[0] === '*') {
            res = visibleDseSearch;
          } else {
            res = operationalDseSearch;
          }
        } else {
          if (req.options.attributes[0] === '*') {
            res = JSON.parse(JSON.stringify(visibleExampleDitSearchRes)) as searchRes;
          } else {
            res = JSON.parse(JSON.stringify(operationalExampleDitSearchRes)) as searchRes;

            delete res.searchEntries[0].dn;
          }
        }

        return res;
      };

      try {
        await fetchAllLdapEntries('id');

        throw new Error('no error');
      } catch (err) {
        if (!(err instanceof Error)) {
          throw err;
        }

        expect(err.message).toStrictEqual('entry does not have dn');
      }
    });

    test('entry does not have objectClass', async () => {
      mockedSearchClient = (_id: string, req: searchReq): searchRes => {
        let res;

        if (req.baseDn === '') {
          if (req.options.attributes[0] === '*') {
            res = visibleDseSearch;
          } else {
            res = operationalDseSearch;
          }
        } else {
          if (req.options.attributes[0] === '*') {
            res = JSON.parse(JSON.stringify(visibleExampleDitSearchRes)) as searchRes;

            delete res.searchEntries[0].objectClass;
          } else {
            res = JSON.parse(JSON.stringify(operationalExampleDitSearchRes)) as searchRes;
          }
        }

        return res;
      };

      try {
        await fetchAllLdapEntries('id');

        throw new Error('no error');
      } catch (err) {
        if (!(err instanceof Error)) {
          throw err;
        }

        expect(err.message).toStrictEqual('entry does not have objectClass');
      }
    });

    test('successful test', async () => {
      mockedSearchClient = (_id: string, req: searchReq): searchRes => {
        let res;

        if (req.baseDn === '') {
          if (req.options.attributes[0] === '*') {
            res = visibleDseSearch;
          } else {
            res = operationalDseSearch;
          }
        } else {
          if (req.options.attributes[0] === '*') {
            res = JSON.parse(JSON.stringify(visibleExampleDitSearchRes)) as searchRes;
          } else {
            res = JSON.parse(JSON.stringify(operationalExampleDitSearchRes)) as searchRes;
          }
        }

        return res;
      };

      const res = await fetchAllLdapEntries('id');

      res.forEach((entry) => {
        expect(entry.visibleEntry.dn).toStrictEqual(entry.operationalEntry.dn);

        expect(entry.visibleEntry['*']).not.toBeDefined();
        expect(entry.visibleEntry['+']).not.toBeDefined();

        expect(entry.operationalEntry['*']).not.toBeDefined();
        expect(entry.operationalEntry['+']).not.toBeDefined();

        if (entry.visibleEntry.dn === '') {
          const starLessVisRootDse = JSON.parse(JSON.stringify(visibleDseSearch.searchEntries[0])) as ldapEntry;

          delete starLessVisRootDse['*'];

          expect(entry.visibleEntry).toStrictEqual(starLessVisRootDse);

          const plusLessOprRootDse = JSON.parse(JSON.stringify(operationalDseSearch.searchEntries[0])) as operationalLdapEntry;

          delete plusLessOprRootDse['+'];

          expect(entry.operationalEntry).toStrictEqual(plusLessOprRootDse);
        } else {
          const starLessVisEntry = JSON.parse(JSON.stringify(
            visibleExampleDitSearchRes
              .searchEntries
              .find((visEntry) => visEntry.dn === entry.visibleEntry.dn)
          )) as ldapEntry;

          delete starLessVisEntry['*'];

          const plusLessOprEntry = JSON.parse(JSON.stringify(
            operationalExampleDitSearchRes
              .searchEntries
              .find((oprEntry) => oprEntry.dn === entry.visibleEntry.dn)
          )) as operationalLdapEntry;

          delete plusLessOprEntry['+'];

          expect(entry.operationalEntry).toStrictEqual(plusLessOprEntry);
        }
      });
    });
  });

  describe('fetchLdapEntry tests', () => {
    test('not found', async () => {
      mockedSearchClient = (id: string, req: searchReq): searchRes => {
        if (id !== 'id') {
          throw new Error(`incorrect id: ${id}`);
        }

        if (req.baseDn !== 'searchDn') {
          throw new Error(`incorrect baseDn: ${req.baseDn}`);
        }

        return {
          searchEntries: [],
          searchReferences: []
        };
      };

      try {
        await fetchLdapEntry('id', 'searchDn');

        throw new Error('no error');
      } catch (err) {
        if (!(err instanceof Error)) {
          throw err;
        }

        expect(err.message).toStrictEqual('failed to find entry');
      }
    });

    test('entry does not have dn', async () => {
      mockedSearchClient = (id: string, req: searchReq): searchRes => {
        if (id !== 'id') {
          throw new Error(`incorrect id: ${id}`);
        }

        if (req.baseDn !== 'searchDn') {
          throw new Error(`incorrect baseDn: ${req.baseDn}`);
        }

        const res: searchRes = {
          searchEntries: [],
          searchReferences: []
        };

        if (req.options.attributes[0] === '*') {
          res.searchEntries = [JSON.parse(JSON.stringify(visibleExampleDitSearchRes.searchEntries[0])) as ldapEntry];

          delete res.searchEntries[0].dn;
        } else {
          res.searchEntries = [operationalExampleDitSearchRes.searchEntries[0] as operationalLdapEntry];
        }

        return res;
      };

      try {
        await fetchLdapEntry('id', 'searchDn');

        throw new Error('no error');
      } catch (err) {
        if (!(err instanceof Error)) {
          throw err;
        }

        expect(err.message).toStrictEqual('entry does not have dn');
      }
    });

    test('entry does not have objectClass', async () => {
      mockedSearchClient = (id: string, req: searchReq): searchRes => {
        if (id !== 'id') {
          throw new Error(`incorrect id: ${id}`);
        }

        if (req.baseDn !== 'searchDn') {
          throw new Error(`incorrect baseDn: ${req.baseDn}`);
        }

        const res: searchRes = {
          searchEntries: [],
          searchReferences: []
        };

        if (req.options.attributes[0] === '*') {
          res.searchEntries = [JSON.parse(JSON.stringify(visibleExampleDitSearchRes.searchEntries[0])) as ldapEntry];

          delete res.searchEntries[0].objectClass;
        } else {
          res.searchEntries = [operationalExampleDitSearchRes.searchEntries[0] as operationalLdapEntry];
        }

        return res;
      };

      try {
        await fetchLdapEntry('id', 'searchDn');

        throw new Error('no error');
      } catch (err) {
        if (!(err instanceof Error)) {
          throw err;
        }

        expect(err.message).toStrictEqual('entry does not have objectClass');
      }
    });

    test('success test', async () => {
      mockedSearchClient = (id: string, req: searchReq): searchRes => {
        if (id !== 'id') {
          throw new Error(`incorrect id: ${id}`);
        }

        if (req.baseDn !== 'searchDn') {
          throw new Error(`incorrect baseDn: ${req.baseDn}`);
        }

        const res: searchRes = {
          searchEntries: [],
          searchReferences: []
        };

        if (req.options.attributes[0] === '*') {
          res.searchEntries = [JSON.parse(JSON.stringify(visibleExampleDitSearchRes.searchEntries[0])) as ldapEntry];
        } else {
          res.searchEntries = [JSON.parse(JSON.stringify(operationalExampleDitSearchRes.searchEntries[0])) as operationalLdapEntry];
        }

        return res;
      };

      const res = await fetchLdapEntry('id', 'searchDn');

      expect(res).toBeDefined();

      const starLessVisEntry = JSON.parse(JSON.stringify(visibleExampleDitSearchRes.searchEntries[0])) as ldapEntry;

      delete starLessVisEntry['*'];

      const plusLessOprEntry = JSON.parse(JSON.stringify(operationalExampleDitSearchRes.searchEntries[0])) as operationalLdapEntry;

      delete plusLessOprEntry['+'];

      expect(res.visibleEntry).toStrictEqual(starLessVisEntry);
      expect(res.operationalEntry).toStrictEqual(plusLessOprEntry);
    });
  });
});
