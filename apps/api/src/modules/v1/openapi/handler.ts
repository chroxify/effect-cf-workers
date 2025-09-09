import { HttpApiBuilder, OpenApi } from '@effect/platform';
import { Effect } from 'effect';
import { AcmeApi } from '@/modules/v1/schema';

export const OpenApiGroupLive = HttpApiBuilder.group(AcmeApi, 'openapi', (handlers) =>
  handlers.handle('get-raw-openapi', () => Effect.succeed(OpenApi.fromApi(AcmeApi)))
);
