import { createBetterAuthConfig } from '@acme/auth';
import { createAuthClient } from 'better-auth/react';

export const auth = createAuthClient(createBetterAuthConfig(process.env));
