import {
  ldapEntry,
  ldapControl,
  modifyEntry,
  entryAttribute,
  searchScope,
  searchDerefAliases,
  ldapSearch,
  ldapSchema,
  objectClassSchema,
  attributeTypeSchema
} from './types';

export const pageUrl: string = 'http://localhost:5173';

export const ldapServerUrl: string = 'ldap://localhost:1389';

export const adminDn: string = 'cn=admin,dc=example,dc=org';

export const adminPassword: string = 'password';

export const invalidOid: string = '1.2';

export const whoAmIOid: string = '1.3.6.1.4.1.4203.1.11.3';

export const tlsServerUrl: string = 'ldaps://localhost:1638';

export const customCertFilePath: string = './../tools/testTlsFiles/testCaCert.pem';

export const configAdminDn: string = 'cn=admin,cn=config';

export const defaultNewObjectClassSchema: objectClassSchema = {
  curSchemaType: 'objectClass',
  description: 'test desc',
  obsolete: false,
  type: 'STRUCTURAL',
  reqAttributes: ['cn'],
  optAttributes: ['sn']
};

export const defaultNewAttributeTypeSchema: attributeTypeSchema = {
  curSchemaType: 'attributeType',
  description: 'test desc',
  eqMatchingRule: 'caseExactMatch',
  attributeSyntax: { oid: '1.3.6.1.4.1.1466.115.121.1.15' },
  singleValue: true,
  collective: false,
  noUserMod: false,
};

export const testAttributeTypes: attributeTypeSchema[] = [

  {
    curSchemaType: 'attributeType',
    oid: '2.16.840.1.113730.3.1.39',
    name: [
      'preferredLanguage'
    ],
    description: 'RFC2798: preferred written or spoken language for a person',
    eqMatchingRule: 'caseIgnoreMatch',
    subStrMatchingRule: 'caseIgnoreSubstringsMatch',
    attributeSyntax: {
      oid: '1.3.6.1.4.1.1466.115.121.1.15'
    },
    singleValue: true,
  },
  {
    curSchemaType: 'attributeType',
    oid: '2.5.4.34',
    name: [
      'seeAlso'
    ],
    description: 'RFC4519: DN of related object',
    superiorAttributeType: 'distinguishedName'
  },
  {
    curSchemaType: 'attributeType',
    oid: '1.3.6.1.4.1.42.2.27.8.1.29',
    name: [
      'pwdLastSuccess'
    ],
    description: 'The timestamp of the last successful authentication',
    eqMatchingRule: 'generalizedTimeMatch',
    ordMatchingRule: 'generalizedTimeOrderingMatch',
    attributeSyntax: {
      oid: '1.3.6.1.4.1.1466.115.121.1.24'
    },
    singleValue: true,
    noUserMod: true,
    usage: 'DIRECTORYOPERATION'
  },
  {
    curSchemaType: 'attributeType',
    oid: '1.3.6.1.4.1.4203.1.12.2.3.2.0.5',
    name: [
      'olcLimits'
    ],
    eqMatchingRule: 'caseIgnoreMatch',
    attributeSyntax: {
      oid: '1.3.6.1.4.1.1466.115.121.1.15'
    },
    extensions: [
      {
        name: 'X-ORDERED',
        value: [
          'VALUES'
        ]
      }
    ]
  },
  {
    curSchemaType: 'attributeType',
    oid: '1.3.6.1.4.1.4203.666.1.25',
    name: [
      'contextCSN'
    ],
    description: 'the largest committed CSN of a context',
    eqMatchingRule: 'CSNMatch',
    ordMatchingRule: 'CSNOrderingMatch',
    attributeSyntax: {
      oid: '1.3.6.1.4.1.4203.666.11.2.1',
      size: 64
    },
    noUserMod: true,
    usage: 'DSAOPERATION'
  }
];

export const defaultNewObjectClassTestEntry: ldapEntry = {
  dn: 'cn=testEntry,ou=users,dc=example,dc=org',
  attributes: [
    {
      name: 'dn',
      values: ['cn=testEntry,ou=users,dc=example,dc=org']
    },
    {
      name: 'sn',
      values: ['testSn']
    },
    {
      name: 'cn',
      values: ['testEntry']
    }
  ]
};

export const pilotPersonSchema: objectClassSchema = {
  curSchemaType: 'objectClass',
  oid: '0.9.2342.19200300.100.4.4',
  names: [
    'pilotPerson',
    'newPilotPerson'
  ],
  supObjectClasses: [
    'person'
  ],
  type: 'STRUCTURAL',
  obsolete: false,
  optAttributes: [
    'userid',
    'textEncodedORAddress',
    'rfc822Mailbox',
    'favouriteDrink',
    'roomNumber',
    'userClass',
    'homeTelephoneNumber',
    'homePostalAddress',
    'secretary',
    'personalTitle',
    'preferredDeliveryMethod',
    'businessCategory',
    'janetMailbox',
    'otherMailbox',
    'mobileTelephoneNumber',
    'pagerTelephoneNumber',
    'organizationalStatus',
    'mailPreferenceOption',
    'personalSignature'
  ]
};

export const simpleSecurityObjectSchema: ldapSchema = {
  curSchemaType: 'objectClass',
  oid: '0.9.2342.19200300.100.4.19',
  names: [
    'simpleSecurityObject'
  ],
  description: 'RFC1274: simple security object',
  supObjectClasses: [
    'top'
  ],
  type: 'AUXILIARY',
  reqAttributes: [
    'userPassword'
  ]
};

export const invalidNewSchemaAttribute: string = 'structuralObjectClass';

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

export const personAutoCompelete: ldapEntry = {
  dn: '',
  attributes: [
    {
      name: 'dn',
      values: ['']
    },
    {
      name: 'objectClass',
      values: ['person']
    },
    {
      name: 'sn',
      values: ['']
    },
    {
      name: 'cn',
      values: ['']
    },
    {
      name: 'userPassword',
      values: ['']
    },
    {
      name: 'telephoneNumber',
      values: ['']
    },
    {
      name: 'seeAlso',
      values: ['']
    },
    {
      name: 'description',
      values: ['']
    }
  ]
};

export const autoCompeletePersonModify: modifyEntry = {
  dn: 'cn=autofillTestPerson,ou=users,dc=example,dc=org',
  modifications: [
    {
      type: 'append',
      attribute: {
        name: 'dn',
        values: ['cn=autofillTestPerson,ou=users,dc=example,dc=org']
      }
    },
    {
      type: 'append',
      attribute: {
        name: 'sn',
        values: ['testAutofillPerson']
      }
    },
    {
      type: 'append',
      attribute: {
        name: 'cn',
        values: ['autofillTestPerson']
      }
    },
    {
      type: 'append',
      attribute: {
        name: 'userPassword',
        values: ['password']
      }
    },
    {
      type: 'append',
      attribute: {
        name: 'telephoneNumber',
        values: ['123', '456']
      }
    },
    {
      type: 'append',
      attribute: {
        name: 'description',
        values: ['testDesc']
      }
    },
    {
      type: 'deleteAttribute',
      name: 'seeAlso'
    }
  ]
};

export const autoCompeletePersonFinalEntry: ldapEntry = {
  dn: 'cn=autofillTestPerson,ou=users,dc=example,dc=org',
  attributes: [
    {
      name: 'dn',
      values: ['cn=autofillTestPerson,ou=users,dc=example,dc=org']
    },
    {
      name: 'objectClass',
      values: ['person']
    },
    {
      name: 'sn',
      values: ['testAutofillPerson']
    },
    {
      name: 'cn',
      values: ['autofillTestPerson']
    },
    {
      name: 'userPassword',
      values: ['password']
    },
    {
      name: 'telephoneNumber',
      values: ['123', '456']
    },
    {
      name: 'description',
      values: ['testDesc']
    }
  ]
};

export const defaultNewEntryModifiedDn: string = 'cn=testModify,ou=users,dc=example,dc=org';

export const defaultNewEntryModifyBody: modifyEntry = {
  dn: defaultNewEntryDn,
  modifications: [
    {
      type: 'append',
      attribute: {
        name: 'objectClass',
        values: ['pkiUser']
      }
    },
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
    values: ['person', 'pkiUser']
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

export const defaultSearchTimeLimit = '5';

export const defaultSearchMaxEntries = '10';

export const defaultSearchBaseDns: string[] = [
  'dc=example,dc=org'
];

export const defaultSearchScope: searchScope = 'sub';

export const defaultSearchDerefAliases: searchDerefAliases = 'never';

export const defaultSearchFormContents: ldapSearch = {
  name: '',
  filter: '',
  timeLimit: defaultSearchTimeLimit,
  maxEntries: defaultSearchMaxEntries,
  baseDns: defaultSearchBaseDns,
  scope: defaultSearchScope,
  aliasDeref: defaultSearchDerefAliases
};
