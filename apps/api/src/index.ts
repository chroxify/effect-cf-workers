import { HttpApiBuilder, HttpMiddleware, HttpServer } from '@effect/platform';
import { WorkerEnv, type WorkerBindings } from './services/WorkerEnv';
import { Effect, Layer, Logger } from 'effect';
import { RepoApiLive, ScalarLive } from './modules/v1';
import * as Auth from '@/services/Auth';

// Cloudflare Worker/Fetch handler
export default {
  async fetch(request: Request, env: WorkerBindings, ctx: ExecutionContext) {
    const workerEnv = WorkerEnv.Default(env);
    return Effect.runPromise(
      Effect.gen(function* () {
        const authServer = yield* Auth.Auth;

        const url = new URL(request.url);
        if (url.pathname.startsWith('/v1/auth')) {
          return authServer.handler(request);
        }

        const { handler, dispose } = HttpApiBuilder.toWebHandler(
          Layer.mergeAll(
            RepoApiLive.pipe(Layer.provide(workerEnv)),
            ScalarLive.pipe(Layer.provide(workerEnv)),
            HttpServer.layerContext
          ),
          {
            middleware: (app) => app.pipe(HttpMiddleware.logger).pipe(Effect.provide(Logger.pretty)),
          }
        );
        return handler(request).finally(() => ctx.waitUntil(dispose()));
      }).pipe(Effect.provide(Auth.Auth.Live), Effect.provide(workerEnv))
    );
  },
};
