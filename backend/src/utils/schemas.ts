import * as z from 'zod';

export const stringArraySchema = z.array(z.string());

export const ldapDbUrlSchema = z.string();

export const bindReqSchema = z.object({
  dnOrSaslMechanism: z.string(),
  password: z.string().optional(),
  cliendId: z.int()
});
