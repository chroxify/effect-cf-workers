import { Schema } from 'effect';

export class Model extends Schema.Class<Model>('Session-Model')({
  id: Schema.String,
  userId: Schema.String,
  token: Schema.String,
  ipAddress: Schema.NullishOr(Schema.String),
  userAgent: Schema.NullishOr(Schema.String),
  expiresAt: Schema.Date,
  createdAt: Schema.Date,
  updatedAt: Schema.Date,
}) {}
