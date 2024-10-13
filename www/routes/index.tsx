import { page, type RouteConfig } from "fresh";
import { define } from "../utils/core.ts";

export const config: RouteConfig = {
	skipInheritedLayouts: true,
};

export const handler = define.handlers({
	GET(_ctx) {
		return page();
	},
});

export default define.page<typeof handler>((_ctx) => {
	return <p>Hello world!</p>;
});
