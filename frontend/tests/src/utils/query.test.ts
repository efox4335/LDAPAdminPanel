import { test, vi, expect, describe } from 'vitest';

import { fetchLdapEntry, fetchLdapChildren } from '../../../src/utils/query';
import type { ldapEntry, operationalLdapEntry, searchReq, searchRes } from '../../../src/utils/types';

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

  describe('fetchLdapChildren tests', () => {
    const parentDn = 'ou=users,dc=example,dc=org';

    const visibleChildSearchRes: searchRes = JSON.parse(JSON.stringify(
      {
        searchEntries: visibleExampleDitSearchRes.searchEntries.filter((entry) => {
          if (!entry.dn || typeof (entry.dn) !== 'string') {
            throw new Error('test data broken entry lacks dn');
          }

          return entry.dn.match(new RegExp(`${parentDn}$`));
        }),
        searchReferences: []
      }
    )) as searchRes;

    const operationalChildSearchRes: searchRes = JSON.parse(JSON.stringify(
      {
        searchEntries: operationalExampleDitSearchRes.searchEntries.filter((entry) => {
          if (!entry.dn || typeof (entry.dn) !== 'string') {
            throw new Error('test data broken entry lacks dn');
          }

          return entry.dn.match(new RegExp(`${parentDn}$`));
        }),
        searchReferences: []
      }
    )) as searchRes;

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
          res.searchEntries = JSON.parse(JSON.stringify(visibleChildSearchRes.searchEntries)) as ldapEntry[];

          delete res.searchEntries[0].dn;
        } else {
          res.searchEntries = operationalChildSearchRes.searchEntries as operationalLdapEntry[];
        }

        return res;
      };

      try {
        await fetchLdapChildren('id', 'searchDn');

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
          res.searchEntries = JSON.parse(JSON.stringify(visibleChildSearchRes.searchEntries)) as ldapEntry[];

          delete res.searchEntries[0].objectClass;
        } else {
          res.searchEntries = JSON.parse(JSON.stringify(operationalChildSearchRes.searchEntries)) as operationalLdapEntry[];
        }

        return res;
      };

      try {
        await fetchLdapChildren('id', 'searchDn');

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
          res.searchEntries = JSON.parse(JSON.stringify(visibleChildSearchRes.searchEntries)) as ldapEntry[];
        } else {
          res.searchEntries = JSON.parse(JSON.stringify(operationalChildSearchRes.searchEntries)) as operationalLdapEntry[];
        }

        return res;
      };

      const res = await fetchLdapChildren('id', 'searchDn');

      expect(res).toBeDefined();

      const starLessVisChildren = JSON.parse(JSON.stringify(visibleChildSearchRes.searchEntries)) as ldapEntry[];

      starLessVisChildren.forEach((entry) => delete entry['*']);

      const plusLessOprChildren = JSON.parse(JSON.stringify(operationalChildSearchRes.searchEntries)) as operationalLdapEntry[];

      plusLessOprChildren.forEach((entry) => delete entry['+']);

      res.forEach((entry) => {
        expect(entry.visibleEntry.dn).toStrictEqual(entry.operationalEntry.dn);

        const starLessVisEntry = starLessVisChildren.find((ent) => ent.dn === entry.visibleEntry.dn);
        expect(starLessVisEntry).toBeDefined();
        if (!starLessVisEntry) {
          return;
        }

        const plusLessOprEntry = plusLessOprChildren.find((ent) => ent.dn === entry.visibleEntry.dn);
        expect(entry.visibleEntry).toStrictEqual(starLessVisEntry);
        expect(entry.operationalEntry).toStrictEqual(plusLessOprEntry);
      });
    });
  });
});
