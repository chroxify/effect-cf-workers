import { Effect } from 'effect';
import { HttpApiBuilder } from '@effect/platform';
import { RepoApi } from '@/modules/v1/schema';
import { AuthService } from '@/services/AuthService';
import { InvalidMagicToken, SessionResolutionFailure } from './errors';

export const AuthGroupLive = HttpApiBuilder.group(RepoApi, 'auth', (handlers) =>
  handlers
    .handle('send-magic-link', ({ payload }) =>
      Effect.gen(function* () {
        const authService = yield* AuthService;

        const { status } = yield* Effect.promise(() =>
          authService.api.signInMagicLink({
            body: {
              email: payload.email,
            },
            headers: {
              'Content-Type': 'application/json',
            },
          })
        );

        return { success: status };
      })
    )
    .handle('verify-magic-link', ({ payload }) =>
      Effect.gen(function* () {
        const authService = yield* AuthService;

        const data = yield* Effect.promise(() =>
          authService.api.magicLinkVerify({
            query: {
              token: payload.token,
            },
            headers: {
              'Content-Type': 'application/json',
            },
          })
        ).pipe(Effect.catchAllDefect(() => Effect.fail(new InvalidMagicToken())));

        const session = yield* Effect.promise(() =>
          authService.api.getSession({
            headers: new Headers({
              Authorization: `Bearer ${data.token}`,
              'Content-Type': 'application/json',
            }),
          })
        ).pipe(Effect.catchAllDefect(() => Effect.fail(new SessionResolutionFailure())));

        if (!session) {
          throw new SessionResolutionFailure();
        }

        return {
          session: {
            ...session.session,
            userAgent: session.session.userAgent ?? null,
            ipAddress: session.session.ipAddress ?? null,
          },
          user: data.user,
        };
      })
    )
);
