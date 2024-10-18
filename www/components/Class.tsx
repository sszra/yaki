import type { ResolvedClass } from "../utils/class.ts";

interface ClassProps {
	data: ResolvedClass;
}

export function Class({ data }: ClassProps) {
	const { homeroomTeacher } = data;

	return (
		<a href={`/class/${data.id}/tasks`}>
			<div class="flex flex-col bg-slate-100 px-3 py-2 rounded-xl w-full">
				<div class="flex flex-col gap-1">
					<p class="font-semibold">{data.name}</p>
					<div class="flex gap-2 items-center">
						{homeroomTeacher.avatarUrl && (
							<img
								class="rounded-full size-4"
								src={homeroomTeacher.avatarUrl}
							/>
						)}
						<p class="text-sm">{homeroomTeacher.username}</p>
					</div>
				</div>
			</div>
		</a>
	);
}
