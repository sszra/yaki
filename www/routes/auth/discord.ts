import { API, type APIUser } from "@discordjs/core";
import { define } from "../../utils/core.ts";
import { REST } from "@discordjs/rest";
import { createUser, retrieveConnectedUser } from "../../utils/user.ts";
import { createSession } from "../../utils/auth.ts";

export const handler = define.handlers({
	async GET(ctx) {
		const clientId = Deno.env.get("DISCORD_CLIENT_ID")!;
		const clientSecret = Deno.env.get("DISCORD_CLIENT_SECRET")!;
		const redirectUrl = Deno.env.get("DISCORD_REDIRECT_URL")!;
		const code = ctx.url.searchParams.get("code")!;

		const api = new API(new REST());

		const exchangedToken = await api.oauth2.tokenExchange({
			client_id: clientId,
			client_secret: clientSecret,
			code,
			grant_type: "authorization_code",
			redirect_uri: redirectUrl,
		});

		const oauthApi = new API(
			new REST({ authPrefix: "Bearer" }).setToken(
				exchangedToken.access_token,
			),
		);

		const currentDiscordUser = await oauthApi.users.getCurrent();
		const existedUser = await retrieveConnectedUser(
			"discord",
			currentDiscordUser.id,
		);

		if (existedUser) {
			return await createSession(existedUser);
		} else {
			const newUser = await createUser({
				username: currentDiscordUser.username,
				avatar: await fetchAvatar(api, currentDiscordUser),
				connections: {
					discord: {
						id: currentDiscordUser.id,
						username: currentDiscordUser.username,
					},
				},
			});
			return await createSession(newUser);
		}
	},
});

async function fetchAvatar(api: API, user: APIUser) {
	if (user.avatar) {
		const avatarUrl = api.rest.cdn.avatar(user.id, user.avatar, {
			extension: "png",
		});
		const response = await fetch(avatarUrl);
		return await response.blob();
	}
}
