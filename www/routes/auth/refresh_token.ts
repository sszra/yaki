import { getCookies } from "@std/http/cookie";
import { define } from "../../utils/core.ts";
import { refreshSession } from "../../utils/auth.ts";

export const handler = define.handlers({
	async GET(ctx) {
		const cookies = getCookies(ctx.req.headers);
		const refreshToken = cookies["refresh_token"];

		try {
			return await refreshSession(refreshToken);
		} catch (_err) {
			return ctx.redirect("/auth/logout");
		}
	},
});
