import { Effect } from 'effect';
import { Layer } from 'effect';
import { Context } from 'effect';
import { tables } from '@repo/database';
import { neon } from '@neondatabase/serverless';
import { WorkerEnvService } from './WorkerEnvService';
import { drizzle as neonDrizzle } from 'drizzle-orm/neon-http';
import { drizzle as pgDrizzle } from 'drizzle-orm/node-postgres';

export class DatabaseService extends Context.Tag('DatabaseService')<
  DatabaseService,
  ReturnType<typeof pgDrizzle> | ReturnType<typeof neonDrizzle>
>() {
  static readonly Live = Layer.effect(
    this,
    Effect.gen(function* () {
      const env = yield* WorkerEnvService;
      const db =
        env.ENVIRONMENT === 'development'
          ? pgDrizzle(env.DATABASE_URL, { schema: tables })
          : neonDrizzle(neon(env.DATABASE_URL), { schema: tables });

      return db;
    })
  );
}
