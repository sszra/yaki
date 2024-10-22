import { page } from "fresh";
import { define } from "../../utils/core.ts";
import { retrieveClassesFor } from "../../utils/class.ts";
import { authMiddleware } from "../../utils/auth.ts";
import { Class } from "../../components/Class.tsx";

export const middleware = authMiddleware;

export const handler = define.handlers({
	async GET(ctx) {
		ctx.state.title = "Teman Saya";

		const fetchedClasses = await retrieveClassesFor(
			ctx.state.user.id,
			true,
		);
		return page({ fetchedClasses });
	},
});

export default define.page<typeof handler>(({ data }) => {
	const { fetchedClasses } = data;

	if (fetchedClasses.length < 1) {
		return (
			<div class="flex flex-col justify-center items-center size-full">
				<div class="flex flex-col gap-2 items-center">
					<p>Kamu belum bergabung ke Kelas apapun.</p>
					<div
						class="flex gap-2 items-center text-sm"
						f-client-nav={false}
					>
						<a href="/class/new">
							<div class="flex gap-2 bg-black px-3 py-1 text-white rounded-full">
								<p>Buat Kelas</p>
							</div>
						</a>
						<p>atau</p>
						<a href="/class/join">
							<div class="flex gap-2 bg-black px-3 py-1 text-white rounded-full">
								<p>Gabung Kelas</p>
							</div>
						</a>
					</div>
				</div>
			</div>
		);
	} else {
		return (
			<div class="flex flex-col size-full" f-client-nav={false}>
				{fetchedClasses.map((classes) => <Class data={classes} />)}
			</div>
		);
	}
});
