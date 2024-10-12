import { Partial } from "fresh/runtime";
import { define } from "../../utils/core.ts";
import { page, type RouteConfig } from "fresh";
import { Title } from "../../components/Title.tsx";
import type { Class } from "../../utils/class.ts";

export const config: RouteConfig = {
	skipAppWrapper: true,
	skipInheritedLayouts: true,
};

export const handler = define.handlers({
	GET(ctx) {
		ctx.state.title = "Kelas Saya";
		return page({ classes: [] satisfies Class[] });
	},
});

export default define.page<typeof handler>(({ data }) => {
	const { classes } = data;

	return (
		<>
			<Title text="Kelas Saya" />
			<Partial name="body">
				{classes.length < 1
					? (
						<div class="flex flex-col justify-center items-center size-full">
							<p>Kamu belum bergabung ke Kelas apapun.</p>
						</div>
					)
					: (
						<div class="flex flex-col size-full">
							<p>Still WIP.</p>
						</div>
					)}
			</Partial>
		</>
	);
});
