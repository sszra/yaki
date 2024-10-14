import { kv } from "./core.ts";
import type { User } from "./user.ts";

export async function retrieveFriends(userId: string): Promise<User[]> {
	const { value: friends } = await kv.get<string[]>([
		"users",
		"byId",
		userId,
		"friends",
	]);

	const fetchedFriends = await Promise.all(
		friends!.map((ctx) => kv.get<User>(["users", "byId", ctx])),
	);
	return fetchedFriends.map((ctx) => ctx.value!);
}
