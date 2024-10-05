import type { ComponentChildren } from "preact";

interface TabProps {
	children: ComponentChildren;
	href: string;
	partial: string;
}

export function TabLink(props: TabProps) {
	return (
		<a
			href={props.href}
			f-partial={props.partial}
			class="flex justify-center items-center group aria-[current]:bg-black size-10 rounded-full"
		>
			{props.children}
		</a>
	);
}
