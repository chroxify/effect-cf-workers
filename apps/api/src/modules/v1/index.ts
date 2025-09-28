import { Otlp } from '@effect/opentelemetry';
import { FetchHttpClient, HttpApiBuilder, HttpApiScalar } from '@effect/platform';
import { Effect, Layer } from 'effect';
import { AuthorizationLive } from '@/middleware/auth';
import { ServiceLayerLive } from '@/services';
import { WorkerEnv } from '@/services/core/WorkerEnv';
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

export const TelemetryLive = Layer.unwrapEffect(
  Effect.gen(function* () {
    const env = yield* WorkerEnv;
    if (!env.OTEL_EXPORTER_OTLP_ENDPOINT) {
      yield* Effect.logError('OTEL_EXPORTER_OTLP_ENDPOINT secret is not set');
      return Layer.empty;
    }
    return Otlp.layer({
      baseUrl: env.OTEL_EXPORTER_OTLP_ENDPOINT,
      resource: {
        serviceName: 'acme-api',
        attributes: {
          'deployment.environment': env.ENVIRONMENT,
        },
      },
    }).pipe(Layer.provide(FetchHttpClient.layer));
  })
);
