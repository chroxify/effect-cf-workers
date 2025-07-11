import * as schema from './schema';

export { drizzle as pgDrizzle } from 'drizzle-orm/node-postgres';

export const tables = {
  ...schema,
};
