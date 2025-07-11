import { HttpApiBuilder, HttpMiddleware, HttpServer } from '@effect/platform';
import { WorkerEnvService, type WorkerBindings } from './services/WorkerEnvService';
import { Effect, Layer, Logger } from 'effect';
import { RepoApiLive, ScalarLive } from './modules/v1';

// App layer
const makeAppLayer = (env: WorkerBindings) => {
  const workerEnvLayer = WorkerEnvService.Default(env);
  return Layer.mergeAll(
    RepoApiLive.pipe(Layer.provide(workerEnvLayer)),
    ScalarLive.pipe(Layer.provide(workerEnvLayer)),
    HttpServer.layerContext
  );
};

// Cloudflare Worker/Fetch handler
export default {
  async fetch(request: Request, env: WorkerBindings, ctx: ExecutionContext) {
    const { handler, dispose } = HttpApiBuilder.toWebHandler(makeAppLayer(env), {
      middleware: (app) => app.pipe(HttpMiddleware.logger).pipe(Effect.provide(Logger.pretty)),
    });
    return await handler(request).finally(() => ctx.waitUntil(dispose()));
  },
};
