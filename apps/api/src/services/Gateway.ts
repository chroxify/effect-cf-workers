import { createOpenAI } from '@ai-sdk/openai';
import type { LanguageModel } from 'ai';
import { Context, Effect, Layer } from 'effect';
import { WorkerEnv } from './WorkerEnv';

export class Gateway extends Context.Tag('Gateway')<Gateway, LanguageModel>() {
  static readonly Live = Layer.effect(
    this,
    Effect.gen(function* () {
      const env = yield* WorkerEnv;

      const gateway = yield* Effect.promise(() => env.AI.gateway('numa').getUrl());

      const openai = createOpenAI({
        baseURL: `${gateway}openai`,
        headers: {
          'cf-aig-authorization': `Bearer ${env.GATEWAY_API_KEY}`,
        },
        apiKey: env.OPENAI_API_KEY,
      });

      return openai('gpt-4o-mini');
    })
  );
}
