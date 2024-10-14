import { page } from "fresh";
import { define } from "../utils/core.ts";
import { retrieveClasses } from "../utils/class.ts";
import { resolveSession } from "../utils/auth.ts";

export const handler = define.handlers({
	async GET(ctx) {
		ctx.state.title = "Kelas Saya";

		const user = await resolveSession(ctx);

		if (user) {
			ctx.state.user = user;
			const classes = await retrieveClasses(user.id);
			return page({ classes });
		} else {
			return ctx.redirect("/");
		}
	},
});

export default define.page<typeof handler>(({ data }) => {
	const { classes } = data;

	if (classes.length < 1) {
		return (
			<div class="flex flex-col justify-center items-center size-full">
				<p>Kamu belum bergabung ke Kelas apapun.</p>
			</div>
		);
	} else {
		return (
			<div class="flex flex-col size-full">
				<p>Still WIP.</p>
			</div>
		);
	}
});
