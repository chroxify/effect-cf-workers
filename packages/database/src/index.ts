import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

export const tables = {
  ...schema,
};

export const createDrizzle = (url: string) => {
  const client = postgres(url, {
    max: 5,
    fetch_types: false,
  });

  return drizzle(client, { schema: tables });
};
