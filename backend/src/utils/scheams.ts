import * as z from 'zod';

export const stringArraySchema = z.array(z.string());

export const ldapDbUrlSchema = z.string();
