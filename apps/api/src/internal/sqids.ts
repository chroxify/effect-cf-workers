import { HttpApiSchema } from '@effect/platform';
import { Effect, Schema } from 'effect';
import Sqids from 'sqids';
import { WorkerEnv } from '@/services/core/WorkerEnv';

export class SqidsDecodingError extends Schema.TaggedError<SqidsDecodingError>('SqidsDecodingError')(
  'SqidsDecodingError',
  {
    message: Schema.optionalWith(Schema.String, {
      default: () => 'Failed to decode ID.',
    }),
  },
  HttpApiSchema.annotations({
    status: 400,
    description: 'Failed to decode ID.',
  })
) {}

type TransformId<T> = T extends number
  ? string
  : T extends Date
    ? Date
    : T extends Array<infer U>
      ? Array<TransformId<U>>
      : T extends object
        ? {
            [K in keyof T]: K extends string
              ? K extends `${string}id${string}` | `${string}Id${string}`
                ? TransformId<T[K]>
                : T[K]
              : T[K];
          }
        : T;

type RecordOrArray = Record<string, unknown> | Array<unknown>;

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
};

const _transformIds = <T extends RecordOrArray>(obj: T, sqids: Sqids): TransformId<T> => {
  if (!obj || typeof obj !== 'object') return obj as TransformId<T>;

  if (Array.isArray(obj)) {
    return obj.map((item) => (isRecord(item) ? _transformIds(item, sqids) : item)) as TransformId<T>;
  }

  if (obj instanceof Date) {
    return obj as TransformId<T>;
  }

  return Object.entries(obj).reduce(
    (acc, [key, value]) => {
      if (key.toLowerCase().includes('id')) {
        if (typeof value === 'number') {
          acc[key] = sqids.encode([value]);
        } else if (typeof value === 'string' && !Number.isNaN(Number(value))) {
          acc[key] = sqids.encode([Number.parseInt(value, 10)]);
        } else {
          acc[key] = value;
        }
      } else if (value instanceof Date) {
        acc[key] = value;
      } else if (value && typeof value === 'object') {
        acc[key] = isRecord(value) ? _transformIds(value, sqids) : value;
      } else {
        acc[key] = value;
      }
      return acc;
    },
    {} as Record<string, unknown>
  ) as TransformId<T>;
};

export const transformIds = <T extends RecordOrArray>(
  predicate: (env: WorkerEnv) => Effect.Effect<T>
): Effect.Effect<TransformId<T>, never, WorkerEnv> =>
  Effect.flatMap(WorkerEnv, (env) =>
    Effect.flatMap(predicate(env), (object) => {
      const sqids = new Sqids({
        minLength: 14,
        alphabet: env.SQIDS_ALPHABET,
      });

      return Effect.succeed(_transformIds(object, sqids));
    })
  );

export const transformId = (id: number): Effect.Effect<string, never, WorkerEnv> =>
  Effect.flatMap(WorkerEnv, (env) => {
    const sqids = new Sqids({
      minLength: 14,
      alphabet: env.SQIDS_ALPHABET,
    });
    return Effect.succeed(sqids.encode([id]));
  });

export const decodeId = <E>(encoded: string, ErrorClass: new () => E): Effect.Effect<number, E, WorkerEnv> =>
  Effect.flatMap(WorkerEnv, (env) => {
    const sqids = new Sqids({
      minLength: 14,
      alphabet: env.SQIDS_ALPHABET,
    });

    return Effect.try({
      try: () => {
        const decoded = sqids.decode(encoded);
        const isValid = decoded.length === 1 && sqids.encode(decoded) === encoded;

        if (!isValid) {
          throw new Error('Invalid ID');
        }

        return decoded[0];
      },
      catch: () => new ErrorClass(),
    });
  });
