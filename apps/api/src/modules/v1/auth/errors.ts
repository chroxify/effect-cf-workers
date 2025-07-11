import { Schema } from 'effect';
import { HttpApiSchema } from '@effect/platform';

export class InvalidMagicToken extends Schema.TaggedError<InvalidMagicToken>('InvalidMagicToken')(
  'InvalidMagicToken',
  {
    message: Schema.optionalWith(Schema.String, {
      default: () => 'An invalid magic token was provided.',
    }),
  },
  HttpApiSchema.annotations({
    status: 400,
    description: 'An invalid magic token was provided.',
  })
) {}

export class SessionResolutionFailure extends Schema.TaggedError<SessionResolutionFailure>(
  'SessionResolutionFailure'
)(
  'SessionResolutionFailed',
  {
    message: Schema.optionalWith(Schema.String, {
      default: () => 'Failed to resolve session from token.',
    }),
  },
  HttpApiSchema.annotations({
    status: 500,
    description: 'Failed to resolve session from token.',
  })
) {}
