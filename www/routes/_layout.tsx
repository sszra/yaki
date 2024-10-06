import { Partial } from "fresh/runtime";
import { define } from "../utils/core.ts";
import { TabLink } from "../components/Tab.tsx";

export default define.page(({ Component }) => {
	return (
		<div
			class="w-dvw h-dvh bg-white flex flex-col md:flex-row"
			f-client-nav
		>
			<div class="flex justify-center space-x-16 md:space-x-0 md:space-y-10 items-center md:flex-col w-full md:w-auto h-auto md:h-full order-last md:order-first p-4">
				<TabLink
					icon="/icons/home.svg"
					focusIcon="/icons/home_focused.svg"
					href="/class"
					partial="/partials/class"
				/>
				<TabLink
					icon="/icons/friends.svg"
					focusIcon="/icons/friends_focused.svg"
					href="/friends"
					partial="/partials/friends"
				/>
			</div>
			<div class="grow p-4">
				<Partial name="body">
					<Component />
				</Partial>
			</div>
		</div>
	);
});
