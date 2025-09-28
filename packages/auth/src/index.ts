import { betterAuth } from 'better-auth';
import { type DB, drizzleAdapter } from 'better-auth/adapters/drizzle';
import { bearer, openAPI } from 'better-auth/plugins';

interface Env {
  BETTER_AUTH_URL: string;
  BETTER_AUTH_SECRET: string;
  ENVIRONMENT: string;
}

export const createBetterAuth = ({ db, env, schema }: { db: DB; env: Env; schema: Record<string, any> }) => {
  return betterAuth({
    ...createBetterAuthConfig(env),
    database: drizzleAdapter(db, { provider: 'pg', schema }),
  });
};

export function createBetterAuthConfig(env: Env) {
  return {
    baseURL: env.BETTER_AUTH_URL,
    basePath: '/v1/auth',
    secret: env.BETTER_AUTH_SECRET,
    emailAndPassword: {
      enabled: true,
    },
    plugins: [
      bearer(),
      openAPI({
        path: '/reference',
        disableDefaultReference: env.ENVIRONMENT !== 'development',
      }),
    ],
    socialProviders: {},
  };
}
