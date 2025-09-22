import * as z from 'zod';

export const ldapDbNewClientSchema = z.object({
  url: z.string()
});

export const bindReqSchema = z.object({
  dnOrSaslMechanism: z.string(),
  password: z.string().optional(),
});

export const searchReqSchema = z.object({
  baseDn: z.string(),
  options: z.object({
    scope: z.enum(['base', 'one', 'sub', 'children']),
    filter: z.string(),
    derefAliases: z.enum(['never', 'always', 'search', 'find']),
    sizeLimit: z.int(),
    timeLimit: z.int(),
    paged: z.boolean(),
    attributes: z.array(z.string())
  })
});

export const addReqSchema = z.object({
  baseDn: z.string(),
  entry: z.record(z.string(), z.union([z.string(), z.array(z.string())]))
});
