import { HttpApiBuilder } from '@effect/platform';
import { Effect } from 'effect';
import { AuthContext } from '@/middleware/auth';
import { AcmeApi } from '@/modules/v1/schema';

export const AccountGroupLive = HttpApiBuilder.group(AcmeApi, 'account', (handlers) =>
  handlers.handle('get-account', () =>
    Effect.gen(function* () {
      const authContext = yield* AuthContext;
      return authContext;
    })
  )
);
