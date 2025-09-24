import * as z from 'zod';

export const ldapDbNewClientSchema = z.object({
  url: z.string()
});

const controlObjectSchema = z.object({
  type: z.string(),
  critical: z.boolean()
});

const controlSchema = z.object({
  control: z.union([controlObjectSchema, z.array(controlObjectSchema)]).optional()
});

export const bindReqSchema = z.object({
  ...controlSchema.shape,
  dnOrSaslMechanism: z.string(),
  password: z.string().optional(),
});

export const searchReqSchema = z.object({
  ...controlSchema.shape,
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
  ...controlSchema.shape,
  baseDn: z.string(),
  entry: z.record(z.string(), z.union([z.string(), z.array(z.string())]))
});

export const delReqSchema = z.object({
  ...controlSchema.shape,
  dn: z.string()
});

export const exopReqSchema = z.object({
  ...controlSchema.shape,
  oid: z.string(),
  value: z.string().optional()
});

export const compareReqSchema = z.object({
  ...controlSchema.shape,
  dn: z.string(),
  attribute: z.string(),
  value: z.string()
});

export const modifyDNReqSchema = z.object({
  ...controlSchema.shape,
  dn: z.string(),
  newDN: z.string()
});
