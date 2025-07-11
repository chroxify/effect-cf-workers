import { HttpApiMiddleware, HttpServerRequest } from '@effect/platform';
import { Context, Effect, Layer } from 'effect';
import { Unauthorized } from '@/schema/errors';
import { AuthService } from '@/services/AuthService';
import type { Session, User } from '@/schema/models';

export class AuthContext extends Context.Tag('AuthContext')<
  AuthContext,
  { user: User.Model; session: Session.Model }
>() {}

export class Authorization extends HttpApiMiddleware.Tag<Authorization>()('Authorization', {
  failure: Unauthorized,
  provides: AuthContext,
}) {}

export const AuthorizationLive = Layer.effect(
  Authorization,
  Effect.gen(function* () {
    const authService = yield* AuthService;

    return Effect.gen(function* () {
      const request = yield* HttpServerRequest.HttpServerRequest;
      const authHeader = new Headers(request.headers).get('Authorization');

      const session = yield* Effect.promise(() =>
        authService.api.getSession({
          headers: new Headers({
            authorization: authHeader ?? '',
          }),
        })
      );

      if (!session) {
        throw new Unauthorized({
          message: 'Unauthorized Access',
          details: 'Missing or invalid authorization token provided.',
        });
      }

      return {
        user: {
          ...session.user,
          image: session.user.image ?? null,
        },
        session: {
          ...session.session,
          ipAddress: session.session.ipAddress ?? null,
          userAgent: session.session.userAgent ?? null,
        },
      };
    });
  })
);
