import * as z from 'zod';

export const ldapDbNewClientSchema = z.object({
  url: z.string()
});

export const bindReqSchema = z.object({
  dnOrSaslMechanism: z.string(),
  password: z.string().optional(),
  clientId: z.int()
});
