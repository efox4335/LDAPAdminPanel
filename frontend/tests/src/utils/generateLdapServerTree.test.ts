import { test, expect, describe } from 'vitest';

import generateLdapServerTree from '../../../src/utils/generateLdapServerTree';
import type { queryFetchRes, serverTreeEntry } from '../../../src/utils/types';

const testData: queryFetchRes[] = [
  {
    'visibleEntry': {
      'dn': '',
      'objectClass': [
        'top',
        'OpenLDAProotDSE'
      ]
    },
    'operationalEntry': {
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
      'subschemaSubentry': 'cn=Subschema'
    }
  },
  {
    'visibleEntry': {
      'dn': 'dc=example,dc=org',
      'objectClass': [
        'dcObject',
        'organization'
      ],
      'dc': 'example',
      'o': 'example'
    },
    'operationalEntry': {
      'dn': 'dc=example,dc=org',
      'structuralObjectClass': 'organization',
      'entryUUID': 'f15d0232-3917-1040-8940-772898619db4',
      'creatorsName': 'cn=admin,dc=example,dc=org',
      'createTimestamp': '20251009045538Z',
      'entryCSN': '20251009045538.091746Z#000000#000#000000',
      'modifiersName': 'cn=admin,dc=example,dc=org',
      'modifyTimestamp': '20251009045538Z',
      'entryDN': 'dc=example,dc=org',
      'subschemaSubentry': 'cn=Subschema',
      'hasSubordinates': 'TRUE'
    }
  },
  {
    'visibleEntry': {
      'dn': 'ou=users,dc=example,dc=org',
      'objectClass': 'organizationalUnit',
      'ou': 'users'
    },
    'operationalEntry': {
      'dn': 'ou=users,dc=example,dc=org',
      'structuralObjectClass': 'organizationalUnit',
      'entryUUID': 'f15d4652-3917-1040-8941-772898619db4',
      'creatorsName': 'cn=admin,dc=example,dc=org',
      'createTimestamp': '20251009045538Z',
      'entryCSN': '20251009045538.093492Z#000000#000#000000',
      'modifiersName': 'cn=admin,dc=example,dc=org',
      'modifyTimestamp': '20251009045538Z',
      'entryDN': 'ou=users,dc=example,dc=org',
      'subschemaSubentry': 'cn=Subschema',
      'hasSubordinates': 'TRUE'
    }
  },
  {
    'visibleEntry': {
      'dn': 'ou=groups,dc=example,dc=org',
      'objectClass': 'organizationalUnit',
      'ou': 'groups'
    },
    'operationalEntry': {
      'dn': 'ou=groups,dc=example,dc=org',
      'structuralObjectClass': 'organizationalUnit',
      'entryUUID': 'f15d7de8-3917-1040-8942-772898619db4',
      'creatorsName': 'cn=admin,dc=example,dc=org',
      'createTimestamp': '20251009045538Z',
      'entryCSN': '20251009045538.094915Z#000000#000#000000',
      'modifiersName': 'cn=admin,dc=example,dc=org',
      'modifyTimestamp': '20251009045538Z',
      'entryDN': 'ou=groups,dc=example,dc=org',
      'subschemaSubentry': 'cn=Subschema',
      'hasSubordinates': 'TRUE'
    }
  },
  {
    'visibleEntry': {
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
      'homeDirectory': '/home/user01'
    },
    'operationalEntry': {
      'dn': 'cn=user01,ou=users,dc=example,dc=org',
      'structuralObjectClass': 'inetOrgPerson',
      'entryUUID': 'f15db7cc-3917-1040-8943-772898619db4',
      'creatorsName': 'cn=admin,dc=example,dc=org',
      'createTimestamp': '20251009045538Z',
      'entryCSN': '20251009045538.096396Z#000000#000#000000',
      'modifiersName': 'cn=admin,dc=example,dc=org',
      'modifyTimestamp': '20251009045538Z',
      'entryDN': 'cn=user01,ou=users,dc=example,dc=org',
      'subschemaSubentry': 'cn=Subschema',
      'hasSubordinates': 'FALSE'
    }
  },
  {
    'visibleEntry': {
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
      'homeDirectory': '/home/user02'
    },
    'operationalEntry': {
      'dn': 'cn=user02,ou=users,dc=example,dc=org',
      'structuralObjectClass': 'inetOrgPerson',
      'entryUUID': 'f15dfd68-3917-1040-8944-772898619db4',
      'creatorsName': 'cn=admin,dc=example,dc=org',
      'createTimestamp': '20251009045538Z',
      'entryCSN': '20251009045538.098177Z#000000#000#000000',
      'modifiersName': 'cn=admin,dc=example,dc=org',
      'modifyTimestamp': '20251009045538Z',
      'entryDN': 'cn=user02,ou=users,dc=example,dc=org',
      'subschemaSubentry': 'cn=Subschema',
      'hasSubordinates': 'FALSE'
    }
  },
  {
    'visibleEntry': {
      'dn': 'cn=readers,ou=groups,dc=example,dc=org',
      'cn': 'readers',
      'objectClass': 'groupOfNames',
      'member': [
        'cn=user01,ou=users,dc=example,dc=org',
        'cn=user02,ou=users,dc=example,dc=org'
      ]
    },
    'operationalEntry': {
      'dn': 'cn=readers,ou=groups,dc=example,dc=org',
      'structuralObjectClass': 'groupOfNames',
      'entryUUID': 'f15e3ba2-3917-1040-8945-772898619db4',
      'creatorsName': 'cn=admin,dc=example,dc=org',
      'createTimestamp': '20251009045538Z',
      'entryCSN': '20251009045538.099772Z#000000#000#000000',
      'modifiersName': 'cn=admin,dc=example,dc=org',
      'modifyTimestamp': '20251009045538Z',
      'entryDN': 'cn=readers,ou=groups,dc=example,dc=org',
      'subschemaSubentry': 'cn=Subschema',
      'hasSubordinates': 'FALSE'
    }
  }
];

describe('generateLdapServerTree.ts tests', () => {
  test('success test', () => {
    const entryMap: Record<string, serverTreeEntry> = generateLdapServerTree(testData, '');
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

    expect(users.entry).toStrictEqual(testData.find((entry) => entry.visibleEntry.dn === users.dn)?.visibleEntry);
    expect(users.operationalEntry).toStrictEqual(testData.find((entry) => entry.operationalEntry.dn === users.dn)?.operationalEntry);
    expect(Object.keys(users.children).length).toStrictEqual(2);

    Object.values(users.children).forEach((userDn) => {
      const user = entryMap[userDn];

      expect(Object.keys(user.children).length).toStrictEqual(0);
      expect(user.visible).toStrictEqual(true);
      if (user.visible !== true) {
        return;
      }
      expect(user.entry).toStrictEqual(testData.find((entry) => entry.visibleEntry.dn === user.dn)?.visibleEntry);
      expect(user.operationalEntry).toStrictEqual(testData.find((entry) => entry.operationalEntry.dn === user.dn)?.operationalEntry);
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
    expect(groups.entry).toStrictEqual(testData.find((entry) => entry.visibleEntry.dn === groups.dn)?.visibleEntry);
    expect(groups.operationalEntry).toStrictEqual(testData.find((entry) => entry.operationalEntry.dn == groups.dn)?.operationalEntry);
    Object.keys(groups.children).forEach((groupDn) => {
      const group = entryMap[groupDn];

      expect(Object.keys(group.children).length).toStrictEqual(0);
      expect(group.visible).toStrictEqual(true);
      if (group.visible !== true) {
        return;
      }
      expect(group.entry).toStrictEqual(testData.find((entry) => entry.visibleEntry.dn === group.dn)?.visibleEntry);
      expect(group.operationalEntry).toStrictEqual(testData.find((entry) => entry.operationalEntry.dn === group.dn)?.operationalEntry);
    });
  });

  test('subtree generate', () => {
    const subtreeBase = 'ou=users,dc=example,dc=org';

    const subtreeTestData = testData.filter((entry) => {
      return entry.visibleEntry.dn.match(new RegExp(`${subtreeBase}$`));
    });

    const res = generateLdapServerTree(subtreeTestData, subtreeBase);

    Object.keys(res).forEach((entry) => {
      expect(entry.match(new RegExp(`${subtreeBase}$`))).toBeTruthy();
    });
  });
});
