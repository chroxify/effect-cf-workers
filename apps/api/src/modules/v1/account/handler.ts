import { Effect } from 'effect';
import { HttpApiBuilder } from '@effect/platform';
import { RepoApi } from '@/modules/v1/schema';
import { AuthContext } from '@/middleware/auth';

export const AccountGroupLive = HttpApiBuilder.group(RepoApi, 'account', (handlers) =>
  handlers.handle('get-account', () =>
    Effect.gen(function* () {
      const authContext = yield* AuthContext;
      return authContext;
    })
  )
);
