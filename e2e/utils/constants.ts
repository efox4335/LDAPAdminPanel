import { ldapEntry, ldapControl, modifyEntry, entryAttribute } from './types';

export const pageUrl: string = 'http://localhost:5173';

export const ldapServerUrl: string = 'ldap://localhost:1389';

export const adminDn: string = 'cn=admin,dc=example,dc=org';

export const adminPassword: string = 'password';

export const invalidOid: string = '1.2';

export const whoAmIOid: string = '1.3.6.1.4.1.4203.1.11.3';

export const invalidCriticalControl: ldapControl = {
  oid: invalidOid,
  critical: true
};

const defaultNewEntryDn: string = 'cn=testUser,ou=users,dc=example,dc=org';

export const defaultNewEntry: ldapEntry = {
  dn: defaultNewEntryDn,
  attributes: [
    {
      name: 'dn',
      values: ['cn=testUser,ou=users,dc=example,dc=org']
    },
    {
      name: 'objectClass',
      values: ['person']
    },
    {
      name: 'sn',
      values: ['testUser', 'testValue']
    },
    {
      name: 'description',
      values: ['test desc']
    },
    {
      name: 'telephoneNumber',
      values: ['12345']
    }
  ]
};

export const defaultNewEntryModifiedDn: string = 'cn=testModify,ou=users,dc=example,dc=org';

export const defaultNewEntryModifyBody: modifyEntry = {
  dn: defaultNewEntryDn,
  modifications: [
    {
      type: 'deleteAttribute',
      name: 'description'
    },
    {
      type: 'add',
      attribute: {
        name: 'userPassword',
        values: ['testPassword']
      }
    },
    {
      type: 'truncate',
      attribute: {
        name: 'telephoneNumber',
        values: ['67890']
      }
    },
    {
      type: 'deleteValues',
      attribute: {
        name: 'sn',
        values: ['testValue']
      }
    },
    {
      type: 'append',
      attribute: {
        name: 'sn',
        values: ['modTestUser']
      }
    }
  ]
};

export const defaultNewEntryModifyDn: modifyEntry = {
  dn: defaultNewEntryDn,
  modifications: [
    {
      type: 'truncate',
      attribute: {
        name: 'dn',
        values: [defaultNewEntryModifiedDn]
      }
    }
  ]
};

export const defaultNewEntryRestoreDn: modifyEntry = {
  dn: defaultNewEntryModifiedDn,
  modifications: [
    {
      type: 'truncate',
      attribute: {
        name: 'dn',
        values: [defaultNewEntryDn]
      }
    }
  ]
};

export const defaultNewEntryInvalidModifyBody: modifyEntry = {
  dn: defaultNewEntryDn,
  modifications: [
    {
      type: 'deleteAttribute',
      name: 'cn'
    }
  ]
};

export const defaultNewEntryInvalidModifyDn: modifyEntry = {
  dn: defaultNewEntryDn,
  modifications: [
    {
      type: 'truncate',
      attribute: {
        name: 'dn',
        values: ['']
      }
    }
  ]
};

export const defaultNewEntryModifiedBody: entryAttribute[] = [
  {
    name: 'objectClass',
    values: ['person']
  },
  {
    name: 'sn',
    values: ['testUser', 'modTestUser']
  },
  {
    name: 'telephoneNumber',
    values: ['67890']
  },
  {
    name: 'userPassword',
    values: ['testPassword']
  }
];

export const defaultTreeEntries: ldapEntry[] = [
  {
    dn: 'dc=example,dc=org',
    attributes: [
      { name: 'dn', values: ['dc=example,dc=org'] },
      {
        name: 'objectClass', values: [
          'dcObject',
          'organization'
        ]
      },
      { name: 'dc', values: ['example'] },
      { name: 'o', values: ['example'] },
      { name: 'structuralObjectClass', values: ['organization'] },
      { name: 'creatorsName', values: ['cn=admin,dc=example,dc=org'] },
      { name: 'modifiersName', values: ['cn=admin,dc=example,dc=org'] },
      { name: 'entryDN', values: ['dc=example,dc=org'] },
      { name: 'subschemaSubentry', values: ['cn=Subschema'] },
      { name: 'hasSubordinates', values: ['TRUE'] }
    ]
  },
  {
    dn: 'ou=users,dc=example,dc=org',
    attributes: [
      { name: 'dn', values: ['ou=users,dc=example,dc=org'] },
      { name: 'objectClass', values: ['organizationalUnit'] },
      { name: 'ou', values: ['users'] },

      { name: 'structuralObjectClass', values: ['organizationalUnit'] },
      { name: 'creatorsName', values: ['cn=admin,dc=example,dc=org'] },
      { name: 'modifiersName', values: ['cn=admin,dc=example,dc=org'] },
      { name: 'entryDN', values: ['ou=users,dc=example,dc=org'] },
      { name: 'subschemaSubentry', values: ['cn=Subschema'] },
      { name: 'hasSubordinates', values: ['TRUE'] },
    ]
  },
  {
    dn: 'ou=groups,dc=example,dc=org',
    attributes: [
      { name: 'dn', values: ['ou=groups,dc=example,dc=org'] },
      { name: 'objectClass', values: ['organizationalUnit'] },
      { name: 'ou', values: ['groups'] },

      { name: 'dn', values: ['ou=groups,dc=example,dc=org'] },
      { name: 'structuralObjectClass', values: ['organizationalUnit'] },
      { name: 'creatorsName', values: ['cn=admin,dc=example,dc=org'] },
      { name: 'modifiersName', values: ['cn=admin,dc=example,dc=org'] },
      { name: 'entryDN', values: ['ou=groups,dc=example,dc=org'] },
      { name: 'subschemaSubentry', values: ['cn=Subschema'] },
      { name: 'hasSubordinates', values: ['TRUE'] },
    ]
  },
  {
    dn: 'cn=user01,ou=users,dc=example,dc=org',
    attributes: [
      { name: 'dn', values: ['cn=user01,ou=users,dc=example,dc=org'] },
      {
        name: 'cn', values: [
          'User1',
          'user01'
        ]
      },
      { name: 'sn', values: ['Bar1'] },
      {
        name: 'objectClass', values: [
          'inetOrgPerson',
          'posixAccount',
          'shadowAccount'
        ]
      },
      { name: 'userPassword', values: ['bitnami1'] },
      { name: 'uid', values: ['user01'] },
      { name: 'uidNumber', values: ['1000'] },
      { name: 'gidNumber', values: ['1000'] },
      { name: 'homeDirectory', values: ['/home/user01'] },

      { name: 'structuralObjectClass', values: ['inetOrgPerson'] },
      { name: 'creatorsName', values: ['cn=admin,dc=example,dc=org'] },
      { name: 'modifiersName', values: ['cn=admin,dc=example,dc=org'] },
      { name: 'entryDN', values: ['cn=user01,ou=users,dc=example,dc=org'] },
      { name: 'subschemaSubentry', values: ['cn=Subschema'] },
      {
        name: 'hasSubordinates', values: ['FALSE']
      },
    ]
  },
  {
    dn: 'cn=user02,ou=users,dc=example,dc=org',
    attributes: [

      { name: 'dn', values: ['cn=user02,ou=users,dc=example,dc=org'] },
      {
        name: 'cn', values: [
          'User2',
          'user02'
        ]
      },
      { name: 'sn', values: ['Bar2'] },
      {
        name: 'objectClass', values: [
          'inetOrgPerson',
          'posixAccount',
          'shadowAccount'
        ]
      },
      { name: 'userPassword', values: ['bitnami2'] },
      { name: 'uid', values: ['user02'] },
      { name: 'uidNumber', values: ['1001'] },
      { name: 'gidNumber', values: ['1001'] },
      { name: 'homeDirectory', values: ['/home/user02'] },

      { name: 'structuralObjectClass', values: ['inetOrgPerson'] },
      { name: 'creatorsName', values: ['cn=admin,dc=example,dc=org'] },
      { name: 'modifiersName', values: ['cn=admin,dc=example,dc=org'] },
      { name: 'entryDN', values: ['cn=user02,ou=users,dc=example,dc=org'] },
      { name: 'subschemaSubentry', values: ['cn=Subschema'] },
      { name: 'hasSubordinates', values: ['FALSE'] },
    ]
  },
  {
    dn: 'cn=readers,ou=groups,dc=example,dc=org',
    attributes: [

      { name: 'dn', values: ['cn=readers,ou=groups,dc=example,dc=org'] },
      { name: 'cn', values: ['readers'] },
      { name: 'objectClass', values: ['groupOfNames'] },
      {
        name: 'member', values: [
          'cn=user01,ou=users,dc=example,dc=org',
          'cn=user02,ou=users,dc=example,dc=org'
        ]
      },

      { name: 'structuralObjectClass', values: ['groupOfNames'] },
      { name: 'creatorsName', values: ['cn=admin,dc=example,dc=org'] },
      { name: 'modifiersName', values: ['cn=admin,dc=example,dc=org'] },
      { name: 'entryDN', values: ['cn=readers,ou=groups,dc=example,dc=org'] },
      { name: 'subschemaSubentry', values: ['cn=Subschema'] },
      { name: 'hasSubordinates', values: ['FALSE'] }
    ]
  }
];
