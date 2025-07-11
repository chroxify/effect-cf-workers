import { RepoApi } from './schema';
import { HttpApiBuilder, HttpApiScalar } from '@effect/platform';
import { AuthorizationLive } from '@/middleware/auth';
import { Layer } from 'effect';
import { AuthService } from '@/services/AuthService';
import { DatabaseService } from '@/services/DatabaseService';
import { AuthGroupLive } from '@/modules/v1/auth/handler';
import { AccountGroupLive } from './account/handler';
import { OpenApiGroupLive } from './openapi/handler';

export const RepoApiLive = HttpApiBuilder.api(RepoApi).pipe(
  // Handlers
  Layer.provide(AuthGroupLive),
  Layer.provide(AccountGroupLive),

  // Raw OpenAPI
  Layer.provide(OpenApiGroupLive),

  // Auth Middleware
  Layer.provide(AuthorizationLive),

  // Services
  Layer.provide(AuthService.Live),
  Layer.provide(DatabaseService.Live)
);

export const ScalarLive = HttpApiScalar.layer({
  path: '/v1/swagger',
}).pipe(Layer.provide(RepoApiLive));
