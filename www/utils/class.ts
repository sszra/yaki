import { kv } from "./core.ts";
import { snowflake } from "./snowflake.ts";
import { retrieveUser, type User } from "./user.ts";

export interface Class {
	id: string;
	name: string;
	homeroomTeacherId: string;
}
export interface ResolvedClass extends Omit<Class, "homeroomTeacherId"> {
	homeroomTeacher: User;
}

export async function createClass(name: string, homeroomTeacher: User) {
	const id = snowflake();
	const newClass: Class = {
		id,
		name,
		homeroomTeacherId: homeroomTeacher.id,
	};

	const { value: currentTeacherClasses } = await kv.get<string[]>([
		"users",
		"byId",
		homeroomTeacher.id,
		"classes",
	]);
	const commit = await kv.atomic().set(["classes", id], newClass).set([
		"users",
		"byId",
		homeroomTeacher.id,
		"classes",
	], [...currentTeacherClasses!, id]).commit();

	if (commit.ok) {
		return newClass;
	} else {
		throw new Error("Failed to create class");
	}
}

export async function resolveClass(data: Class) {
	const homeroomTeacher = await retrieveUser(data.homeroomTeacherId);

	const resolvedClass: ResolvedClass = {
		id: data.id,
		name: data.name,
		homeroomTeacher,
	};
	return resolvedClass;
}

export async function retrieveClass(classId: string) {
	const { value: classes } = await kv.get<Class>(["classes", classId]);

	if (classes) {
		return await resolveClass(classes);
	} else {
		throw new Error("Unknown Class");
	}
}

export async function retrieveClassesFor(
	userId: string,
	fullData: true,
): Promise<ResolvedClass[]>;
export async function retrieveClassesFor(
	userId: string,
	fullData?: boolean,
): Promise<string[]>;
export async function retrieveClassesFor(
	userId: string,
	fullData?: boolean,
): Promise<ResolvedClass[] | string[]> {
	const { value: classes } = await kv.get<string[]>([
		"users",
		"byId",
		userId,
		"classes",
	]);

	if (fullData) {
		return await Promise.all(
			classes!.map((ctx) => retrieveClass(ctx)),
		);
	} else {
		return classes!;
	}
}
