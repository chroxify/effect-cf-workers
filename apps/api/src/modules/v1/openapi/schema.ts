import { HttpApiEndpoint, HttpApiGroup } from '@effect/platform';
import { Schema } from 'effect';

export const OpenApiGroup = HttpApiGroup.make('openapi')
  .add(HttpApiEndpoint.get('get-raw-openapi', '/docs.json').addSuccess(Schema.Any))
  .prefix('/swagger');
