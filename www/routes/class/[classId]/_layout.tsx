import type { RouteConfig, RouteHandler } from "fresh";
import type { ResolvedClass } from "../../../utils/class.ts";
import { define, type State } from "../../../utils/core.ts";
import { Partial } from "fresh/runtime";

interface Data {
	fetchedClass: ResolvedClass;
}

export const config: RouteConfig = {
	skipInheritedLayouts: true,
};

export default define.page<RouteHandler<Data, State>>(({ data, Component }) => {
	const { fetchedClass } = data;

	return (
		<div class="w-dvw h-dvh p-4">
			<div class="flex flex-col gap-2 size-full">
				<div class="flex flex-col">
					<p class="font-semibold text-3xl">{fetchedClass.name}</p>
					<div class="flex gap-2 items-center">
						{fetchedClass.homeroomTeacher.avatarUrl && (
							<img
								class="rounded-full size-6"
								src={fetchedClass.homeroomTeacher.avatarUrl}
							/>
						)}
						<p class="text-lg">
							{fetchedClass.homeroomTeacher.username}
						</p>
					</div>
				</div>
				<div class="flex flex-col grow" f-client-nav>
					<div class="flex flex-col grow gap-2">
						<form class="flex relative items-center">
							<input
								class="pl-10 py-2 grow outline-none bg-slate-200 rounded-full placeholder:text-slate-500 pr-2"
								type="text"
								name="query"
								placeholder="Cari sesuatu..."
							/>
							<svg
								class="fill-slate-500 absolute left-3"
								xmlns="http://www.w3.org/2000/svg"
								width="1.3em"
								height="1.3em"
								viewBox="0 0 16 16"
							>
								<path
									fill-rule="evenodd"
									d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06zM10.5 7a3.5 3.5 0 1 1-7 0a3.5 3.5 0 0 1 7 0"
									clip-rule="evenodd"
								/>
							</svg>
						</form>
						<div class="flex flex-col grow">
							<Partial name="content">
								<Component />
							</Partial>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
});
