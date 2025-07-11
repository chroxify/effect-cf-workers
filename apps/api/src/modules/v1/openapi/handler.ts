import { Effect } from 'effect';
import { HttpApiBuilder, OpenApi } from '@effect/platform';
import { RepoApi } from '@/modules/v1/schema';

export const OpenApiGroupLive = HttpApiBuilder.group(RepoApi, 'openapi', (handlers) =>
  handlers.handle('get-raw-openapi', () => Effect.succeed(OpenApi.fromApi(RepoApi)))
);
