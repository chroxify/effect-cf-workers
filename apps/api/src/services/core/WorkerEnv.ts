import { Effect } from 'effect';

export interface WorkerBindings {
  BETTER_AUTH_URL: string;
  BETTER_AUTH_SECRET: string;
  DATABASE_URL: string;
  ENVIRONMENT: string;
  OPENAI_API_KEY: string;
  SQIDS_ALPHABET: string;
  GATEWAY_API_KEY: string;
  AI: Ai;
}

export class WorkerEnv extends Effect.Service<WorkerEnv>()('WorkerEnv', {
  effect: Effect.fn(function* (bindings: WorkerBindings) {
    yield* Effect.try({
      try: () => bindings,
      catch: () => new Error('Worker bindings not provided'),
    });
    return bindings;
  }),
}) {}
