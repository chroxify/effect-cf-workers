import { HttpApiBuilder, HttpApiScalar } from '@effect/platform';
import { Layer } from 'effect';
import { AuthorizationLive } from '@/middleware/auth';
import { ServiceLayerLive } from '@/services';
import { AccountGroupLive } from './account/handler';
import { OpenApiGroupLive } from './openapi/handler';
import { AcmeApi } from './schema';

export const AcmeApiLive = HttpApiBuilder.api(AcmeApi).pipe(
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
}).pipe(Layer.provide(AcmeApiLive));
