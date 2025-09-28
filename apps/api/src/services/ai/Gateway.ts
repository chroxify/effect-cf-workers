import { createOpenAI } from '@ai-sdk/openai';
import type { LanguageModel } from 'ai';
import { Context, Effect, Either, Layer } from 'effect';
import { WorkerEnv } from '../core/WorkerEnv';

export class Gateway extends Context.Tag('Gateway')<Gateway, LanguageModel>() {
  static readonly Live = Layer.effect(
    this,
    Effect.gen(function* () {
      const env = yield* WorkerEnv;

      const gatewayUrl = yield* Effect.either(
        Effect.tryPromise({
          try: () => env.AI.gateway('numa').getUrl(),
          // biome-ignore lint/suspicious/noExplicitAny: expected
          catch: (error: any) => error.message,
        })
      );

      if (Either.isLeft(gatewayUrl)) {
        yield* Effect.logError('Gateway failed, using default endpoint', {
          message: gatewayUrl.left,
        });
      }

      const openai = createOpenAI({
        ...(gatewayUrl
          ? {
              baseURL: `${gatewayUrl}openai`,
              headers: {
                'cf-aig-authorization': `Bearer ${env.GATEWAY_API_KEY}`,
              },
            }
          : {}),
        apiKey: env.OPENAI_API_KEY,
      });

      return openai('gpt-4o-mini');
    })
  );
}
