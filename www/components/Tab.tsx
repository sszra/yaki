interface TabProps {
	icon: string;
	focusIcon: string;
	href: string;
	partial: string;
}

export function TabLink(props: TabProps) {
	return (
		<a
			href={props.href}
			f-partial={props.partial}
			class="flex justify-center items-center group relative"
		>
			<div class="absolute -top-4 md:top-4 md:-right-4 size-1 group-aria-[current]:bg-black rounded-full">
			</div>
			<img class="group-aria-[current]:hidden size-9" src={props.icon} />
			<img
				class="hidden group-aria-[current]:block size-9"
				src={props.focusIcon}
			/>
		</a>
	);
}
