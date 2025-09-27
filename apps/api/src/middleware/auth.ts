import { HttpApiMiddleware, HttpServerRequest } from '@effect/platform';
import { Context, Effect, Layer } from 'effect';
import type { Session, User } from '@/schema/auth';
import { Unauthorized } from '@/schema/errors';
import * as Auth from '@/services/core/Auth';

export class AuthContext extends Context.Tag('AuthContext')<
  AuthContext,
  {
    readonly user: User.Model;
    readonly session: Session.Model;
  }
>() {}

export class Authorization extends HttpApiMiddleware.Tag<Authorization>()('Authorization', {
  failure: Unauthorized,
  provides: AuthContext,
}) {}

export const AuthorizationLive = Layer.effect(
  Authorization,
  Effect.gen(function* () {
    const authService = yield* Auth.Auth;

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
