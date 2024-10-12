import { page } from "fresh";
import { define } from "../utils/core.ts";
import type { Class } from "../utils/class.ts";

export const handler = define.handlers({
	GET(ctx) {
		ctx.state.title = "Kelas Saya";
		return page({ classes: [] satisfies Class[] });
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
