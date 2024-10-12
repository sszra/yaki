import { Partial } from "fresh/runtime";

export function Title({ text }: { text: string }) {
	return (
		<Partial name="title">
			<p class="font-semibold text-lg">{text}</p>
		</Partial>
	);
}
