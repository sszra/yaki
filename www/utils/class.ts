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

export interface Task {
	id: string;
	title: string;
	description?: string;
	dueDate?: number;
	authorId: string;
	classId: string;
}

export interface ResolvedTask extends Omit<Task, "authorId" | "dueDate"> {
	dueDate?: Date;
	author: User;
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

// TODO(@szrraa): make the `createTask` function

export async function resolveTask(taskId: string) {
	const { value: rawTask } = await kv.get<Task>(["tasks", taskId]);

	if (rawTask) {
		const data: ResolvedTask = {
			id: rawTask.id,
			title: rawTask.title,
			description: rawTask.description,
			dueDate: rawTask.dueDate ? new Date(rawTask.dueDate) : undefined,
			author: await retrieveUser(rawTask.authorId),
			classId: rawTask.classId,
		};
		return data;
	} else {
		throw new Error("Unknown Task");
	}
}

export async function retrieveTasks(
	classId: string,
	fullData: true,
): Promise<ResolvedTask[]>;
export async function retrieveTasks(
	classId: string,
	fullData?: boolean,
): Promise<string[]>;
export async function retrieveTasks(classId: string, fullData?: boolean) {
	const { value: taskIds } = await kv.get<string[]>([
		"class",
		classId,
		"tasks",
	]);

	if (fullData) {
		return await Promise.all(taskIds!.map((ctx) => resolveTask(ctx)));
	} else {
		return taskIds;
	}
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
