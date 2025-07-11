import { HttpApiSchema } from '@effect/platform';
import { Schema } from 'effect';

export const ErrorSchema = { message: Schema.String, details: Schema.optional(Schema.String) };

export class BadRequest extends Schema.TaggedError<BadRequest>()(
  'BadRequest',
  ErrorSchema,
  HttpApiSchema.annotations({
    status: 400,
    description: 'Bad Request',
  })
) {}

export class Unauthorized extends Schema.TaggedError<Unauthorized>()(
  'Unauthorized',
  ErrorSchema,
  HttpApiSchema.annotations({
    status: 401,
    description: 'Unauthorized',
  })
) {}

export class Forbidden extends Schema.TaggedError<Forbidden>()(
  'Forbidden',
  ErrorSchema,
  HttpApiSchema.annotations({
    status: 403,
    description: 'Forbidden',
  })
) {}

export class NotFound extends Schema.TaggedError<NotFound>()(
  'NotFound',
  ErrorSchema,
  HttpApiSchema.annotations({
    status: 404,
    description: 'Not Found',
  })
) {}

export class MethodNotAllowed extends Schema.TaggedError<MethodNotAllowed>()(
  'MethodNotAllowed',
  ErrorSchema,
  HttpApiSchema.annotations({
    status: 405,
    description: 'Method Not Allowed',
  })
) {}

export class NotAcceptable extends Schema.TaggedError<NotAcceptable>()(
  'NotAcceptable',
  ErrorSchema,
  HttpApiSchema.annotations({
    status: 406,
    description: 'Not Acceptable',
  })
) {}

export class RequestTimeout extends Schema.TaggedError<RequestTimeout>()(
  'RequestTimeout',
  ErrorSchema,
  HttpApiSchema.annotations({
    status: 408,
    description: 'Request Timeout',
  })
) {}

export class Conflict extends Schema.TaggedError<Conflict>()(
  'Conflict',
  ErrorSchema,
  HttpApiSchema.annotations({
    status: 409,
    description: 'Conflict',
  })
) {}

export class Gone extends Schema.TaggedError<Gone>()(
  'Gone',
  ErrorSchema,
  HttpApiSchema.annotations({
    status: 410,
    description: 'Gone',
  })
) {}

export class InternalServerError extends Schema.TaggedError<InternalServerError>()(
  'InternalServerError',
  ErrorSchema,
  HttpApiSchema.annotations({
    status: 500,
    description: 'Internal Server Error',
  })
) {}

export class NotImplemented extends Schema.TaggedError<NotImplemented>()(
  'NotImplemented',
  ErrorSchema,
  HttpApiSchema.annotations({
    status: 501,
    description: 'Not Implemented',
  })
) {}

export class ServiceUnavailable extends Schema.TaggedError<ServiceUnavailable>()(
  'ServiceUnavailable',
  ErrorSchema,
  HttpApiSchema.annotations({
    status: 503,
    description: 'Service Unavailable',
  })
) {}
