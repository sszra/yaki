import { Partial } from "fresh/runtime";
import { define } from "../utils/core.ts";
import { TabLink } from "../components/Tab.tsx";
import { Title } from "../components/Title.tsx";

export default define.page(({ Component, state }) => {
	const { title, user } = state;

	return (
		<div
			class="w-dvw h-dvh bg-white flex flex-col md:flex-row select-none"
			f-client-nav
		>
			<div class="flex justify-center gap-10 items-center md:flex-col w-full md:w-auto h-auto md:h-full order-last md:order-first p-4">
				<TabLink
					icon="/icons/library.svg"
					focusIcon="/icons/library_focused.svg"
					href="/class"
					partial="/partials/class"
				/>
				<TabLink
					icon="/icons/sparkle.svg"
					focusIcon="/icons/sparkle_focused.svg"
					href="/friends"
					partial="/partials/friends"
				/>
			</div>
			<div class="flex flex-col grow p-4 space-y-3">
				<div class="flex justify-between items-center w-full">
					<Title text={title} />
					<div class="bg-slate-100 rounded-full size-10 overflow-hidden">
						<img class="pointer-events-none" src={user.avatarUrl} />
					</div>
				</div>
				<div class="grow">
					<Partial name="body">
						<Component />
					</Partial>
				</div>
			</div>
		</div>
	);
});
