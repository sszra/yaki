import { API, OAuth2Scopes } from "@discordjs/core";
import { define } from "../../utils/core.ts";
import { REST } from "@discordjs/rest";

export const handler = define.handlers({
	GET(ctx) {
		const clientId = Deno.env.get("DISCORD_CLIENT_ID")!;
		const redirectUrl = Deno.env.get("DISCORD_REDIRECT_URL")!;
		const scopes = [OAuth2Scopes.Identify];

		const api = new API(new REST());
		return ctx.redirect(api.oauth2.generateAuthorizationURL({
			client_id: clientId,
			redirect_uri: redirectUrl,
			response_type: "code",
			scope: scopes.join(" "),
		}));
	},
});
