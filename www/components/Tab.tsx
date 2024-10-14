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
			<div class="flex justify-center items-center group-aria-[current]:bg-slate-200 rounded-full p-2">
				<img
					class="group-aria-[current]:hidden size-8"
					src={props.icon}
				/>
				<img
					class="hidden group-aria-[current]:block size-8"
					src={props.focusIcon}
				/>
			</div>
		</a>
	);
}
