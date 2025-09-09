import { HttpApiBuilder, HttpMiddleware, HttpServer } from '@effect/platform';
import { Effect, Layer, Logger } from 'effect';
import * as Auth from '@/services/Auth';
import { AcmeApiLive, ScalarLive } from './modules/v1';
import { type WorkerBindings, WorkerEnv } from './services/WorkerEnv';

// Cloudflare Worker/Fetch handler
export default {
  async fetch(request: Request, env: WorkerBindings, ctx: ExecutionContext) {
    const workerEnv = WorkerEnv.Default(env);
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
            AcmeApiLive.pipe(Layer.provide(workerEnv)),
            ScalarLive.pipe(Layer.provide(workerEnv)),
            HttpServer.layerContext
          ),
          {
            middleware: (app) =>
              app.pipe(HttpMiddleware.logger).pipe(HttpMiddleware.cors()).pipe(Effect.provide(Logger.pretty)),
          }
        );
        return handler(request).finally(() => ctx.waitUntil(dispose()));
      }).pipe(Effect.provide(Auth.Auth.Live), Effect.provide(workerEnv))
    );
  },
};
