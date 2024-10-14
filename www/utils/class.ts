import { kv } from "./core.ts";

export interface Class {
	id: string;
	name: string;
	homeroomTeacher: string;
}

export async function retrieveClasses(userId: string): Promise<Class[]> {
	const { value: classes } = await kv.get<Class[]>([
		"users",
		"byId",
		userId,
		"classes",
	]);
	return classes!;
}
