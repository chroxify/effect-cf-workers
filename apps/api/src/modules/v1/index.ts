import { RepoApi } from './schema';
import { HttpApiBuilder, HttpApiScalar } from '@effect/platform';
import { AuthorizationLive } from '@/middleware/auth';
import { Layer } from 'effect';
import { AccountGroupLive } from './account/handler';
import { OpenApiGroupLive } from './openapi/handler';
import { ServiceLayerLive } from '@/services';

export const RepoApiLive = HttpApiBuilder.api(RepoApi).pipe(
  // Handlers
  Layer.provide(AccountGroupLive),

  // Raw OpenAPI
  Layer.provide(OpenApiGroupLive),

  // Auth Middleware
  Layer.provide(AuthorizationLive),

  // Services
  Layer.provideMerge(ServiceLayerLive)
);

export const ScalarLive = HttpApiScalar.layer({
  path: '/v1/swagger',
}).pipe(Layer.provide(RepoApiLive));
