import { test, vi, expect, describe } from 'vitest';

import generateLdapServerTree from '../../../src/utils/generateLdapServerTree';
import type { searchReq, searchRes, serverTreeEntry } from '../../../src/utils/types';

export const rootDseSearchRes: searchRes = {
  'searchEntries': [
    {
      'dn': '',
      'objectClass': [
        'top',
        'OpenLDAProotDSE'
      ],
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
      '*': [],
      '+': []
    }
  ],
  'searchReferences': []
};

export const exampleDitSearchRes: searchRes = {
  'searchEntries': [
    {
      'dn': 'cn=readers,ou=groups,dc=example,dc=org',
      'cn': 'readers',
      'objectClass': 'groupOfNames',
      'member': [
        'cn=user01,ou=users,dc=example,dc=org',
        'cn=user02,ou=users,dc=example,dc=org'
      ],
      'structuralObjectClass': 'groupOfNames',
      'entryUUID': 'd1ff0f66-320a-1040-8989-dd1544f28094',
      'creatorsName': 'cn=admin,dc=example,dc=org',
      'createTimestamp': '20250930053403Z',
      'entryCSN': '20250930053403.869749Z#000000#000#000000',
      'modifiersName': 'cn=admin,dc=example,dc=org',
      'modifyTimestamp': '20250930053403Z',
      'entryDN': 'cn=readers,ou=groups,dc=example,dc=org',
      'subschemaSubentry': 'cn=Subschema',
      'hasSubordinates': 'FALSE',
      '*': [],
      '+': []
    },
    {
      'dn': 'dc=example,dc=org',
      'objectClass': [
        'dcObject',
        'organization'
      ],
      'dc': 'example',
      'o': 'example',
      'structuralObjectClass': 'organization',
      'entryUUID': 'd1fd0c84-320a-1040-8984-dd1544f28094',
      'creatorsName': 'cn=admin,dc=example,dc=org',
      'createTimestamp': '20250930053403Z',
      'entryCSN': '20250930053403.856567Z#000000#000#000000',
      'modifiersName': 'cn=admin,dc=example,dc=org',
      'modifyTimestamp': '20250930053403Z',
      'entryDN': 'dc=example,dc=org',
      'subschemaSubentry': 'cn=Subschema',
      'hasSubordinates': 'TRUE',
      '*': [],
      '+': []
    },
    {
      'dn': 'ou=users,dc=example,dc=org',
      'objectClass': 'organizationalUnit',
      'ou': 'users',
      'structuralObjectClass': 'organizationalUnit',
      'entryUUID': 'd1fe0076-320a-1040-8985-dd1544f28094',
      'creatorsName': 'cn=admin,dc=example,dc=org',
      'createTimestamp': '20250930053403Z',
      'entryCSN': '20250930053403.862812Z#000000#000#000000',
      'modifiersName': 'cn=admin,dc=example,dc=org',
      'modifyTimestamp': '20250930053403Z',
      'entryDN': 'ou=users,dc=example,dc=org',
      'subschemaSubentry': 'cn=Subschema',
      'hasSubordinates': 'TRUE',
      '*': [],
      '+': []
    },

    {
      'dn': 'ou=groups,dc=example,dc=org',
      'objectClass': 'organizationalUnit',
      'ou': 'groups',
      'structuralObjectClass': 'organizationalUnit',
      'entryUUID': 'd1fe3fdc-320a-1040-8986-dd1544f28094',
      'creatorsName': 'cn=admin,dc=example,dc=org',
      'createTimestamp': '20250930053403Z',
      'entryCSN': '20250930053403.864436Z#000000#000#000000',
      'modifiersName': 'cn=admin,dc=example,dc=org',
      'modifyTimestamp': '20250930053403Z',
      'entryDN': 'ou=groups,dc=example,dc=org',
      'subschemaSubentry': 'cn=Subschema',
      'hasSubordinates': 'TRUE',
      '*': [],
      '+': []
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
      'structuralObjectClass': 'inetOrgPerson',
      'entryUUID': 'd1fe8424-320a-1040-8987-dd1544f28094',
      'creatorsName': 'cn=admin,dc=example,dc=org',
      'createTimestamp': '20250930053403Z',
      'entryCSN': '20250930053403.866184Z#000000#000#000000',
      'modifiersName': 'cn=admin,dc=example,dc=org',
      'modifyTimestamp': '20250930053403Z',
      'entryDN': 'cn=user01,ou=users,dc=example,dc=org',
      'subschemaSubentry': 'cn=Subschema',
      'hasSubordinates': 'FALSE',
      '*': [],
      '+': []
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
      'structuralObjectClass': 'inetOrgPerson',
      'entryUUID': 'd1feca2e-320a-1040-8988-dd1544f28094',
      'creatorsName': 'cn=admin,dc=example,dc=org',
      'createTimestamp': '20250930053403Z',
      'entryCSN': '20250930053403.867977Z#000000#000#000000',
      'modifiersName': 'cn=admin,dc=example,dc=org',
      'modifyTimestamp': '20250930053403Z',
      'entryDN': 'cn=user02,ou=users,dc=example,dc=org',
      'subschemaSubentry': 'cn=Subschema',
      'hasSubordinates': 'FALSE',
      '*': [],
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

describe('generateLdapServerTree.ts tests', () => {
  test('no root DSE', async () => {
    mockedSearchClient = (_id: string, _req: searchReq): searchRes => {
      return {
        searchEntries: [],
        searchReferences: []
      };
    };

    try {
      await generateLdapServerTree('id');

      throw new Error('no error');
    } catch (err) {
      expect(err).instanceOf(Error);
      if (!(err instanceof Error)) {
        throw err;
      }

      expect(err.message).toStrictEqual('no root DSE found');
    }
  });

  test('no namingContexts', async () => {
    mockedSearchClient = (_id: string, _req: searchReq): searchRes => {
      const res = { ...rootDseSearchRes, searchEntries: [{ ...rootDseSearchRes.searchEntries[0] }] };

      delete res.searchEntries[0].namingContexts;

      return res;
    };

    try {
      await generateLdapServerTree('id');

      throw new Error('no error');
    } catch (err) {
      expect(err).instanceOf(Error);
      if (!(err instanceof Error)) {
        throw err;
      }

      expect(err.message).toStrictEqual('root DSE has no namingContexts');
    }
  });

  test('success test', async () => {
    mockedSearchClient = (_id: string, req: searchReq): searchRes => {
      if (req.baseDn === '') {
        return rootDseSearchRes;
      } if (req.baseDn === 'dc=example,dc=org') {
        return exampleDitSearchRes;
      }

      throw new Error(`unexpected basedn: ${req.baseDn}`);
    };

    const entryMap: Record<string, serverTreeEntry> = await generateLdapServerTree('id');
    const ldapTreeRoot: serverTreeEntry = entryMap['dse'];

    expect(ldapTreeRoot.visible).toStrictEqual(true);
    expect(Object.keys(ldapTreeRoot.children).length).toStrictEqual(1);

    const hiddenOrg = entryMap[ldapTreeRoot.children['dc=org']];

    expect(hiddenOrg.visible).toStrictEqual(false);
    expect(hiddenOrg.dn).toStrictEqual('dc=org');

    const exampleDn = entryMap[Object.keys(hiddenOrg.children)[0]];

    expect(exampleDn.visible).toStrictEqual(true);
    expect(Object.keys(exampleDn.children).length).toStrictEqual(2);
    expect(exampleDn.dn).toStrictEqual('dc=example,dc=org');

    const usersDn = Object.values(exampleDn.children).find((entry) => entry === 'ou=users,dc=example,dc=org');

    expect(usersDn).toBeDefined();
    if (!usersDn) {
      return;
    }

    const users = entryMap[usersDn];

    expect(users).toBeDefined();
    if (!users) {
      return;
    }
    expect(users.visible).toStrictEqual(true);
    if (users.visible !== true) {
      return;
    }
    expect(users.entry).toStrictEqual(exampleDitSearchRes.searchEntries.find((entry) => entry.dn === users.dn));
    expect(Object.keys(users.children).length).toStrictEqual(2);

    Object.values(users.children).forEach((userDn) => {
      const user = entryMap[userDn];

      expect(Object.keys(user.children).length).toStrictEqual(0);
      expect(user.visible).toStrictEqual(true);
      if (user.visible !== true) {
        return;
      }
      expect(user.entry).toStrictEqual(exampleDitSearchRes.searchEntries.find((entry) => entry.dn === user.dn));
    });

    const groupsDn = Object.values(exampleDn.children).find((entry) => entry === `ou=groups,${exampleDn.dn}`);

    expect(groupsDn).toBeDefined();
    if (!groupsDn) {
      return;
    }

    const groups = entryMap[groupsDn];

    expect(groups.visible).toStrictEqual(true);
    if (groups.visible !== true) {
      return;
    }
    expect(groups.entry).toStrictEqual(exampleDitSearchRes.searchEntries.find((entry) => entry.dn === groups.dn));
    Object.keys(groups.children).forEach((groupDn) => {
      const group = entryMap[groupDn];

      expect(Object.keys(group.children).length).toStrictEqual(0);
      expect(group.visible).toStrictEqual(true);
      if (group.visible !== true) {
        return;
      }
      expect(group.entry).toStrictEqual(exampleDitSearchRes.searchEntries.find((entry) => entry.dn === group.dn));
    });
  });
});
