import { HttpApiBuilder, HttpMiddleware, HttpServer } from '@effect/platform';
import { Effect, Layer, Logger } from 'effect';
import * as Auth from '@/services/core/Auth';
import { AcmeApiLive, ScalarLive, TelemetryLive } from './modules/v1';
import { type WorkerBindings, WorkerEnv } from './services/core/WorkerEnv';

// Cloudflare Worker/Fetch handler
export default {
  async fetch(request: Request, env: WorkerBindings, ctx: ExecutionContext) {
    const workerEnv = WorkerEnv.Default(env);
    const runtimeLayer = Layer.mergeAll(workerEnv, Logger.structured);
    return Effect.runPromise(
      Effect.gen(function* () {
        const authServer = yield* Auth.Auth;

        const url = new URL(request.url);
        if (url.pathname.startsWith('/v1/auth')) {
          return authServer.handler(request).then((response) => {
            response.headers.set('Access-Control-Allow-Origin', '*');
            return response;
          });
        }

        const { handler, dispose } = HttpApiBuilder.toWebHandler(
          Layer.mergeAll(
            AcmeApiLive.pipe(Layer.provide(runtimeLayer)),
            ScalarLive.pipe(Layer.provide(runtimeLayer)),
            TelemetryLive.pipe(Layer.provide(runtimeLayer)),
            HttpServer.layerContext
          ),
          {
            middleware: (app) =>
              app.pipe(HttpMiddleware.logger, HttpMiddleware.cors(), Effect.provide(Logger.structured)),
          }
        );
        return handler(request).finally(() => ctx.waitUntil(dispose()));
      }).pipe(Effect.provide(Auth.Auth.Live), Effect.provide(runtimeLayer))
    );
  },
};
