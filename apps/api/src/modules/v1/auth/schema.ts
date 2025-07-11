import { Schema } from 'effect';
import { HttpApiGroup } from '@effect/platform';
import { HttpApiEndpoint } from '@effect/platform';
import { InvalidMagicToken, SessionResolutionFailure } from './errors';
import { Session, User } from '@/schema/models';

export const AuthGroup = HttpApiGroup.make('auth')
  .add(
    HttpApiEndpoint.post('send-magic-link', '/send-magic-link')
      .setPayload(
        Schema.Struct({
          email: Schema.String.pipe(Schema.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)),
        })
      )
      .addSuccess(
        Schema.Struct({
          success: Schema.Boolean,
        })
      )
  )
  .add(
    HttpApiEndpoint.post('verify-magic-link', '/verify-magic-link')
      .setPayload(
        Schema.Struct({
          token: Schema.String,
        })
      )
      .addSuccess(
        Schema.Struct({
          session: Session.Model,
          user: User.Model,
        })
      )
      .addError(InvalidMagicToken)
      .addError(SessionResolutionFailure)
  )
  .prefix('/auth');
