import { page } from "fresh";
import { define } from "../utils/core.ts";
import { resolveSession } from "../utils/auth.ts";
import { retrieveFriends } from "../utils/friend.ts";

export const handler = define.handlers({
	async GET(ctx) {
		ctx.state.title = "Teman Saya";

		const user = await resolveSession(ctx);

		if (user) {
			ctx.state.user = user;
			const friends = await retrieveFriends(user.id);
			return page({ friends });
		} else {
			return ctx.redirect("/");
		}
	},
});

export default define.page<typeof handler>((_ctx) => {
	return <p>Coming soon</p>;
});
