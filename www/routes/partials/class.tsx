import { Partial } from "fresh/runtime";
import { define } from "../../utils/core.ts";
import type { RouteConfig } from "fresh";

export const config: RouteConfig = {
	skipAppWrapper: true,
	skipInheritedLayouts: true,
};

export default define.page((_ctx) => {
	return (
		<Partial name="body">
			<p>ini main page</p>
		</Partial>
	);
});
