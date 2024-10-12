import { page } from "fresh";
import { define } from "../utils/core.ts";

export const handler = define.handlers({
	GET(ctx) {
		ctx.state.title = "Teman Saya";
		return page();
	},
});

export default define.page<typeof handler>((_ctx) => {
	return <p>ini friends page</p>;
});
