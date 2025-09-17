import type { bindReq } from '../src/utils/types';

export const serverUrl = 'ldap://localhost:1389';

export const invalidClientId: string = 'abcdef';

export const baseDn = 'dc=example,dc=org';

export const validBind: bindReq = {
  dnOrSaslMechanism: `cn=admin,${baseDn}`,
  password: 'password'
};
