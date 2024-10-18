import { Partial } from "fresh/runtime";
import { define } from "../../../utils/core.ts";
import type { RouteConfig } from "fresh";
import { Title } from "../../../components/Title.tsx";

export const config: RouteConfig = {
	skipAppWrapper: true,
	skipInheritedLayouts: true,
};

export default define.page((_ctx) => {
	return (
		<>
			<Title text="Teman Saya" />
			<Partial name="body">
				<p>ini friends page</p>
			</Partial>
		</>
	);
});
