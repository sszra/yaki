import { type RouteConfig } from "fresh";
import { define } from "../utils/core.ts";
import { LoginAuth } from "../components/LoginAuth.tsx";
import { resolveSession } from "../utils/auth.ts";

export const config: RouteConfig = {
	skipInheritedLayouts: true,
};

export const handler = define.handlers({
	async GET(ctx) {
		try {
			await resolveSession(ctx);
			return ctx.redirect("/class");
		} catch (_err) {
			return ctx.redirect("/auth/refresh_token");
		}
	},
});

export const _component = define.page<typeof handler>((_ctx) => {
	return (
		<div class="flex justify-center items-center w-dvw h-dvh">
			<div class="flex flex-col justify-center gap-2">
				<p class="font-semibold text-2xl">Masuk ke akun Kamu!</p>
				<div>
					<LoginAuth
						icon="/icons/discord.svg"
						platformName="Discord"
						path="/login/discord"
					/>
				</div>
			</div>
		</div>
	);
});
