import { page, type RouteConfig } from "fresh";
import { define, kv } from "../../utils/core.ts";
import { createSession, resolveSession } from "../../utils/auth.ts";
import { searchUser } from "../../utils/user.ts";
import { verify } from "@felix/bcrypt";
import { Login } from "../../islands/Login.tsx";
import { Partial } from "fresh/runtime";

export const config: RouteConfig = {
	skipInheritedLayouts: true,
};

export const handler = define.handlers({
	async GET(ctx) {
		try {
			await resolveSession(ctx);
			return ctx.redirect("/class");
		} catch (_err) {
			return page();
		}
	},
	async POST(ctx) {
		try {
			await resolveSession(ctx);
			return ctx.redirect("/class");
		} catch (_err) {
			const data = await ctx.req.formData();

			const username = data.get("username") as string;
			const password = data.get("password") as string;
			try {
				const user = await searchUser(username);
				const { value: userPassword } = await kv.get<string>([
					"users",
					"byId",
					user.id,
					"password",
				]);

				const isMatch = await verify(password, userPassword!);

				if (isMatch) {
					return await createSession(user);
				} else {
					throw new Error("Username atau Kata Sandi salah");
				}
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
				<Login
					username={data?.username}
					password={data?.password}
					error={data?.error}
				/>
			</Partial>
			<Partial name="switch">
				<p class="text-sm font-semibold">
					Belum punya akun?{" "}
					<a href="/signup">
						<span class="text-purple-500">Signup</span>
					</a>
				</p>
			</Partial>
		</div>
	);
});
