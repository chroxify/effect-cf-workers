import { Effect } from 'effect';

// Base type for worker bindings
export interface WorkerBindings {
  BETTER_AUTH_URL: string;
  BETTER_AUTH_SECRET: string;
  DATABASE_URL: string;
  ENVIRONMENT: string;
  // Add more bindings here as needed
}

export class WorkerEnvService extends Effect.Service<WorkerEnvService>()('WorkerEnvService', {
  effect: Effect.fn(function* (bindings: WorkerBindings) {
    yield* Effect.try({
      try: () => bindings,
      catch: () => new Error('Worker bindings not provided'),
    });
    return bindings;
  }),
}) {}
