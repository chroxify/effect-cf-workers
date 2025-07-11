import { Effect } from 'effect';
import { Layer } from 'effect';
import { betterAuth as _betterAuth } from 'better-auth';
import { Context } from 'effect';
import { type DB, drizzleAdapter } from 'better-auth/adapters/drizzle';
import { bearer } from 'better-auth/plugins';
import { magicLink } from 'better-auth/plugins';
import { DatabaseService } from './DatabaseService';
import { tables } from '@repo/database';

const betterAuth = (db: DB) => {
  return _betterAuth({
    database: drizzleAdapter(db, { provider: 'pg', schema: tables.auth }),
    plugins: [
      bearer(),
      magicLink({
        sendMagicLink: async ({ email, token, url }) => {
          // biome-ignore lint/suspicious/noConsole: <explanation>
          console.log('sendMagicLink', email, token, url);
        },
      }),
    ],
  });
};

export class AuthService extends Context.Tag('AuthService')<AuthService, ReturnType<typeof betterAuth>>() {
  static readonly Live = Layer.effect(
    this,
    Effect.gen(function* () {
      const db = yield* DatabaseService;
      return betterAuth(db);
    })
  );
}
