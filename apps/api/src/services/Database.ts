import { Effect } from "effect";
import { Layer } from "effect";
import { Context } from "effect";
import { createDrizzle } from "@acme/database";
import { WorkerEnv } from "./WorkerEnv";

const make = Effect.gen(function* () {
	const env = yield* WorkerEnv;
	return createDrizzle(
		env.DATABASE_URL,
		env.ENVIRONMENT === "development" ? "pg" : "neon",
	);
});

export class Database extends Context.Tag("Database")<
	Database,
	Effect.Effect.Success<typeof make>
>() {
	static readonly Live = Layer.effect(this, make);
}
