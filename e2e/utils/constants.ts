export const pageUrl: string = 'http://localhost:5173';

export const ldapServerUrl: string = 'ldap://localhost:1389';

export const adminDn: string = 'cn=admin,dc=example,dc=org';

export const adminPassword: string = 'password';

export const invalidOid: string = '1.2';

export const whoAmIOid: string = '1.3.6.1.4.1.4203.1.11.3';

export const defaultTreeEntries = [
  'dc=example,dc=org',
  'ou=users,dc=example,dc=org',
  'ou=groups,dc=example,dc=org',
  'cn=user01,ou=users,dc=example,dc=org',
  'cn=user02,ou=users,dc=example,dc=org',
  'cn=readers,ou=groups,dc=example,dc=org',
];
