import { page } from "fresh";
import { define } from "../../utils/core.ts";
import { retrieveFriends } from "../../utils/friend.ts";

export const handler = define.handlers({
	async GET(ctx) {
		ctx.state.title = "Teman Saya";
		const friends = await retrieveFriends(ctx.state.user.id);
		return page({ friends });
	},
});

export default define.page<typeof handler>((_ctx) => {
	return <p>Coming soon</p>;
});
