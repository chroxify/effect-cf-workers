import { Schema } from 'effect';

export class Model extends Schema.Class<Model>('User-Model')({
  id: Schema.String,
  name: Schema.String,
  email: Schema.String,
  emailVerified: Schema.Boolean,
  image: Schema.NullishOr(Schema.String),
  createdAt: Schema.Date,
  updatedAt: Schema.Date,
}) {}
