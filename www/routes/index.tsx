import { page, type RouteConfig } from "fresh";
import { define } from "../utils/core.ts";
import { LoginAuth } from "../components/LoginAuth.tsx";
import { resolveSession } from "../utils/auth.ts";

export const config: RouteConfig = {
	skipInheritedLayouts: true,
};

export const handler = define.handlers({
	async GET(ctx) {
		const user = await resolveSession(ctx);
		if (user) {
			return ctx.redirect("/class");
		} else {
			ctx.state.title = "Login";
			return page();
		}
	},
});

export default define.page<typeof handler>((_ctx) => {
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
