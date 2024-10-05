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
				<TabLink href="/class" partial="/partials/class">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="26"
						height="26"
						viewBox="0 0 24 24"
					>
						<path
							class="stroke-black group-aria-[current]:stroke-white"
							fill="none"
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="1.5"
							d="m6 12l-1.586 1.586a2 2 0 0 0 0 2.828l3.172 3.172a2 2 0 0 0 2.828 0l9.172-9.172a2 2 0 0 0 0-2.828l-3.172-3.172a2 2 0 0 0-2.828 0L12 6m-6 6l2 2m-2-2l3-3m3-3l2 2m-2-2L9 9m0 0l3 3"
						/>
					</svg>
				</TabLink>
				<TabLink href="/friends" partial="/partials/friends">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="26"
						height="26"
						viewBox="0 0 24 24"
					>
						<g
							class="stroke-black group-aria-[current]:stroke-white"
							fill="none"
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="1.5"
						>
							<path d="M8 9.5a6.5 6.5 0 1 0 13 0a6.5 6.5 0 1 0-13 0" />
							<path d="M3 14.5a6.5 6.5 0 1 0 13 0a6.5 6.5 0 1 0-13 0" />
						</g>
					</svg>
				</TabLink>
			</div>
			<div class="grow p-4">
				<Partial name="body">
					<Component />
				</Partial>
			</div>
		</div>
	);
});
