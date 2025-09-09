import { neon } from '@neondatabase/serverless';
import { drizzle as neonDrizzle } from 'drizzle-orm/neon-http';
import { drizzle as pgDrizzle } from 'drizzle-orm/node-postgres';
import * as schema from './schema';

export { drizzle as pgDrizzle } from 'drizzle-orm/node-postgres';

export const tables = {
  ...schema,
};

export const createDrizzle = (url: string, type: 'pg' | 'neon') => {
  if (type === 'pg') {
    return pgDrizzle(url, { schema: tables });
  }
  return neonDrizzle(neon(url), { schema: tables });
};
