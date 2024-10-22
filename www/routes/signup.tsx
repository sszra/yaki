import { page, type RouteConfig } from "fresh";
import { define } from "../utils/core.ts";
import { createSession, resolveSession } from "../utils/auth.ts";
import { createUser } from "../utils/user.ts";
import { Signup } from "../islands/Signup.tsx";
import { Partial } from "fresh/runtime";

export const config: RouteConfig = {
	skipInheritedLayouts: true,
};

export const handler = define.handlers({
	async GET(ctx) {
		const user = await resolveSession(ctx);

		if (user) {
			return ctx.redirect("/class");
		} else {
			return page();
		}
	},
	async POST(ctx) {
		const user = await resolveSession(ctx);

		if (user) {
			return ctx.redirect("/class");
		} else {
			const data = await ctx.req.formData();

			const username = data.get("username") as string;
			const password = data.get("password") as string;
			try {
				const newUser = await createUser({ username, password });
				return await createSession(newUser);
			} catch (err) {
				return page({
					username,
					password,
					error: (err as Error).message,
				});
			}
		}
	},
});

export default define.page<typeof handler>(({ data }) => {
	return (
		<div
			class="w-dvw h-dvh bg-gray-100 p-4 flex flex-col justify-center items-center gap-3"
			f-client-nav
		>
			<Partial name="form">
				<Signup
					username={data?.username}
					password={data?.password}
					error={data?.error}
				/>
			</Partial>
			<Partial name="switch">
				<p class="text-sm font-semibold">
					Sudah punya akun?{" "}
					<a href="/login" f-partial="/partials/login">
						<span class="text-purple-500">Login</span>
					</a>
				</p>
			</Partial>
		</div>
	);
});
