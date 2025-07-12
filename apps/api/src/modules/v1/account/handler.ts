import { Effect } from "effect";
import { HttpApiBuilder } from "@effect/platform";
import { AcmeApi } from "@/modules/v1/schema";
import { AuthContext } from "@/middleware/auth";

export const AccountGroupLive = HttpApiBuilder.group(
	AcmeApi,
	"account",
	(handlers) =>
		handlers.handle("get-account", () =>
			Effect.gen(function* () {
				const authContext = yield* AuthContext;
				return authContext;
			}),
		),
);
