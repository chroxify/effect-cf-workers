import { createBetterAuth } from '@acme/auth';
import { tables } from '@acme/database';
import { Context, Effect, Layer } from 'effect';
import * as Database from './Database';
import * as WorkerEnv from './WorkerEnv';

const make = Effect.gen(function* () {
  const db = yield* Database.Database;
  const env = yield* WorkerEnv.WorkerEnv;
  return createBetterAuth({ db, env, schema: tables.auth });
});

export class Auth extends Context.Tag('Auth')<Auth, Effect.Effect.Success<typeof make>>() {
  static readonly Live = Layer.effect(this, make).pipe(Layer.provide(Database.Database.Live));
}
