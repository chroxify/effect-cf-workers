import { createDrizzle } from '@acme/database';
import { Context, Effect, Layer } from 'effect';
import { WorkerEnv } from './WorkerEnv';

const make = Effect.gen(function* () {
  const env = yield* WorkerEnv;
  return createDrizzle(env.HYPERDRIVE.connectionString);
});

export class Database extends Context.Tag('Database')<Database, Effect.Effect.Success<typeof make>>() {
  static readonly Live = Layer.effect(this, make);
}
