import { betterAuth } from 'better-auth';
import { type DB, drizzleAdapter } from 'better-auth/adapters/drizzle';
import { bearer, magicLink, openAPI } from 'better-auth/plugins';

// biome-ignore lint/suspicious/noExplicitAny: environment variables
export const createBetterAuth = ({ db, env, schema }: { db: DB; env: any; schema: Record<string, any> }) => {
  return betterAuth({
    ...createBetterAuthConfig(env),
    database: drizzleAdapter(db, { provider: 'pg', schema }),
  });
};

// biome-ignore lint/suspicious/noExplicitAny: environment variables
export function createBetterAuthConfig(env: any) {
  return {
    baseURL: env.BETTER_AUTH_URL,
    basePath: '/v1/auth',
    secret: env.BETTER_AUTH_SECRET,
    emailAndPassword: {
      enabled: true,
    },
    plugins: [
      bearer(),
      magicLink({
        sendMagicLink: async ({ email, token, url }) => {
          // biome-ignore lint/suspicious/noConsole: debugging
          console.log('sendMagicLink', email, token, url);
        },
      }),
      openAPI({
        path: '/reference',
        disableDefaultReference: env.ENVIRONMENT !== 'development',
      }),
    ],
    socialProviders: {
      github: {
        clientId: env.GITHUB_CLIENT_ID,
        clientSecret: env.GITHUB_CLIENT_SECRET,
      },
    },
  };
}
