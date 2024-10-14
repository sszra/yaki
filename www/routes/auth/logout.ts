import { deleteCookie } from "@std/http/cookie";
import { define } from "../../utils/core.ts";
import { STATUS_CODE } from "@std/http/status";

export const handler = define.handlers({
	GET(_ctx) {
		const headers = new Headers({
			location: "/",
		});

		deleteCookie(headers, "access_token", { path: "/" });
		deleteCookie(headers, "refresh_token", { path: "/refresh_token" });

		return new Response(null, { headers, status: STATUS_CODE.Found });
	},
});
