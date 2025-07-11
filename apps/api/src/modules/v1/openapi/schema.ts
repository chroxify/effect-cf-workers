import { Schema } from 'effect';
import { HttpApiGroup } from '@effect/platform';
import { HttpApiEndpoint } from '@effect/platform';

export const OpenApiGroup = HttpApiGroup.make('openapi')
  .add(HttpApiEndpoint.get('get-raw-openapi', '/docs.json').addSuccess(Schema.Any))
  .prefix('/swagger');
