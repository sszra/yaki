import { page, type RouteConfig } from "fresh";
import { define } from "../../utils/core.ts";
import { createClass } from "../../utils/class.ts";

export const config: RouteConfig = {
	skipInheritedLayouts: true,
};

export const handler = define.handlers({
	GET(_ctx) {
		return page({ error: { name: null } });
	},
	async POST(ctx) {
		const data = await ctx.req.formData();

		const name = data.get("name") as string;

		if (!name) {
			return page({ error: { name: "This is required field" } });
		} else {
			const newClass = await createClass(name, ctx.state.user);
			return ctx.redirect(`/class/${newClass.id}`);
		}
	},
});

export default define.page<typeof handler>(({ data }) => {
	const { error } = data;

	return (
		<div class="w-dvw h-dvh flex justify-center items-center p-4">
			<div class="flex flex-col justify-center items-center gap-2 w-full max-w-80">
				<p class="font-bold text-2xl">Buat Kelas Baru</p>
				<div class="flex flex-col justify-center items-center w-full">
					<form
						method="POST"
						class="flex flex-col w-full gap-2 items-center"
					>
						<div class="flex flex-col gap-1 w-full">
							<label for="name">Nama Kelas:</label>
							<input
								class="bg-slate-100 rounded-full px-3 py-2 outline-none w-full"
								id="name"
								name="name"
								type="text"
							/>
							{error.name && (
								<p class="text-red-400">
									This field is required
								</p>
							)}
						</div>
						<button type="submit">
							<div class="bg-black px-3 py-1 text-white rounded-full">
								<p>Buat Kelas</p>
							</div>
						</button>
					</form>
				</div>
			</div>
		</div>
	);
});
