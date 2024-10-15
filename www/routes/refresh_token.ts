import { getCookies, setCookie } from "@std/http/cookie";
import { define } from "../utils/core.ts";
import { refreshToken as createRefreshToken } from "../utils/auth.ts";
import { STATUS_CODE } from "@std/http/status";

export const handler = define.handlers({
	async GET(ctx) {
		const cookies = getCookies(ctx.req.headers);
		const refreshToken = cookies["refresh_token"];

		if (refreshToken) {
			const newAccessToken = await createRefreshToken(refreshToken);

			if (newAccessToken) {
				const headers = new Headers({
					location: "/",
				});

				setCookie(headers, {
					name: "access_token",
					value: newAccessToken.token,
					expires: newAccessToken.expire,
					path: "/",
				});

				return new Response(null, {
					headers,
					status: STATUS_CODE.Found,
				});
			} else {
				return ctx.redirect("/auth/logout");
			}
		} else {
			return ctx.redirect("/auth/logout");
		}
	},
});
